<template>
  <PageContent>
    <template #top>
      <el-form v-show="showSearch" ref="queryRef" :model="queryParams" :inline="true" label-width="68px" @submit.prevent>
        <el-form-item label="敏感词" prop="wordStr">
          <el-input v-model="queryParams.wordStr" placeholder="请输入敏感词" clearable style="width: 240px" @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          <el-button v-hasPermi="['system:sensitiveWord:add']" type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </template>

    <el-table
      v-loading="loading"
      class="base-table"
      stripe
      height="100%"
      :data="sensitiveWordList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="编号" type="index" width="80" align="center" />
      <el-table-column label="敏感词" prop="wordStr" :show-overflow-tooltip="true" min-width="150" align="center" />
      <el-table-column label="人员白名单" prop="userId" align="center">
        <template #default="scope">
          <!-- el-tag 标签展示被名单人员 -->
          <div v-if="scope.row.userId && scope.row.userId.length > 0">
            <el-tag v-for="userId in scope.row.userId" :key="userId" type="primary" size="small" style="margin-right: 5px">
              {{ getUserNameById(userId) }}
            </el-tag>
          </div>
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="gmtCreate" align="center">
        <template #default="scope">
          {{ scope.row.gmtCreate ? dayjs(scope.row.gmtCreate).format('YYYY-MM-DD HH:mm:ss') : '无' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="type" align="center" width="160">
        <template #default="{ row }">
          <el-popover placement="left" width="110" popper-style="min-width: unset;" trigger="hover">
            <template #reference>
              <PopoverBtn />
            </template>
            <div>
              <el-button link type="warning" :loading="row.loading" @click="handleUpdate(row)">修改</el-button>
              <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
            </div>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <template #floor>
      <pagination
        v-show="total > queryParams.pageSize"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        :total="total"
        @pagination="getList"
      />
    </template>

    <el-dialog v-model="open" :title="title" width="600px" append-to-body>
      <el-form ref="sensitiveWordRef" :model="form" :rules="rules" label-width="100px">
        <div v-for="(item, index) in form.wordList" :key="item.id || item.key" class="word-item">
          <el-form-item
            :label="`敏感词`"
            :prop="`wordList.${index}.wordStr`"
            :rules="[{ required: true, message: '敏感词不能为空', trigger: 'blur' }]"
          >
            <div style="display: flex; align-items: center; position: relative; width: 100%">
              <el-input v-model="item.wordStr" placeholder="请输入敏感词" maxlength="100" style="width: 100%" />
              <el-button
                v-if="form.wordList.length > 1"
                type="danger"
                icon="Close"
                circle
                size="small"
                style="position: absolute; top: 0; right: 0; transform: translateX(100%) translateY(-100%)"
                @click="removeWordItem(index)"
              />
            </div>
          </el-form-item>
          <el-form-item :label="`人员白名单`" :prop="`wordList.${index}.userId`">
            <el-cascader
              v-model="item.userId"
              :style="{ width: '100%' }"
              :options="options"
              filterable
              :props="{
                multiple: true,
                label: 'label',
                value: 'id',
                children: 'children'
              }"
              :show-all-levels="false"
              clearable
            />
          </el-form-item>
        </div>
        <el-form-item v-if="!form.id" label-width="0">
          <el-button icon="Plus" style="width: 100%; margin-top: 10px" @click="addWordItem">添加敏感词</el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </PageContent>
</template>

<script setup name="SensitiveWord" lang="ts">
/* eslint-disable camelcase */
import { getCurrentInstance, ComponentInternalInstance, ref, reactive, toRefs } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import {
  listSensitiveWord,
  getSensitiveWord,
  addSensitiveWord,
  updateSensitiveWord,
  insertSensitiveWord,
  delSensitiveWord
} from '@/api/system/sensitiveWord'
import { useDict } from '@/utils/dict'
import { queryDeptTreeUser } from '@/api/system/user'

const { proxy } = getCurrentInstance() as ComponentInternalInstance

const { sys_normal_disable, sensitive_word_type } = useDict('sys_normal_disable', 'sensitive_word_type')
const sensitiveWordList = ref<any[]>([])
const open = ref(false)
const importOpen = ref(false)
const loading = ref(false)
const showSearch = ref(true)
const ids = ref<number[]>([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref('')
const dateRange = ref<any>([])
const uploadRef = ref<any>(null)

const data = reactive<{
  form: any
  queryParams: any
  importForm: any
  rules: any
}>({
  form: {
    wordList: [{ key: Date.now(), wordStr: '', userId: [] }]
  },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    wordStr: undefined
  },
  importForm: {
    file: null
  },
  rules: {
    wordList: [
      {
        required: true,
        message: '敏感词列表不能为空',
        trigger: 'submit',
        validator: (rule: any, value: any, callback: any) => {
          if (!value || value.length === 0) {
            callback(new Error('敏感词列表不能为空'))
          } else {
            // 检查每个敏感词是否为空
            const emptyWord = value.find((item: any) => !item.wordStr || item.wordStr.trim() === '')
            if (emptyWord) {
              callback(new Error('敏感词不能为空'))
            } else {
              callback()
            }
          }
        }
      }
    ]
  }
})

const { queryParams, form, importForm, rules } = toRefs(data)
const queryRef = ref<any>(null)
const sensitiveWordRef = ref<any>(null)

// /** 获取级别类型 */
// function getLevelType(level: string) {
//   const types: any = { '1': 'success', '2': 'warning', '3': 'danger' }
//   return types[level] || 'info'
// }

// /** 获取级别文本 */
// function getLevelText(level: string) {
//   const texts: any = { '1': '低级', '2': '中级', '3': '高级' }
//   return texts[level] || '未知'
// }

/** 查询敏感词列表 */
async function getList() {
  if (loading.value) return
  loading.value = true
  const data = { ...queryParams.value }
  try {
    const { data: res } = await listSensitiveWord(data)
    const { recordList, totailCount } = res
    // console.log(res.rows)
    total.value = totailCount
    sensitiveWordList.value = recordList
  } catch (error) {
    console.error(error)
  }
  loading.value = false
}

/** 查询部门树结构 */
const options = ref<any[]>([])
const getDeptTreeUser = async () => {
  const { data } = await queryDeptTreeUser()
  options.value = data
}

/** 根据用户ID获取用户名称 */
function getUserNameById(userId: string) {
  if (!userId || !options.value || options.value.length === 0) {
    return userId
  }

  // 递归搜索用户ID
  const findUser = (nodes: any[]): string | undefined => {
    for (const node of nodes) {
      // 检查当前节点是否为用户节点

      const { id, label, children = [] } = node

      if (id === userId && label) {
        return label
      }

      // 如果有子节点，继续递归搜索
      if (children.length > 0) {
        const result = findUser(children)
        if (result) return result
      }
    }
  }

  return findUser(options.value) || userId
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  dateRange.value = []
  queryRef.value.resetFields()
  handleQuery()
}

/** 删除按钮操作 */
function handleDelete(row: any) {
  const wordIds = row.id || ids.value
  ElMessageBox.confirm(`是否确认删除编号为"${wordIds}"的敏感词数据项?`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => delSensitiveWord(wordIds))
    .then(() => {
      getList()
      ElMessage.success('删除成功')
    })
    .catch((e: any) => {
      console.log(e)
    })
}

// /** 导出按钮操作 */
// function handleExport() {
//   proxy!.download(
//     'system/sensitiveWord/export',
//     {
//       ...queryParams.value
//     },
//     `sensitive_word_${new Date().getTime()}.xlsx`
//   )
// }

/** 多选框选中数据 */
function handleSelectionChange(selection: any[]) {
  ids.value = selection.map(item => item.id)
  single.value = selection.length !== 1
  multiple.value = !selection.length
}

/** 敏感词状态修改 */
// function handleStatusChange(row: any) {
//   const text = row.status === '0' ? '启用' : '停用'
//   proxy!.$modal
//     .confirm(`确认要"${text}""${row.word}"敏感词吗?`)
//     .then(() => changeSensitiveWordStatus(row.id, row.status))
//     .then(() => {
//       proxy!.$modal.msgSuccess(`${text}成功`)
//     })
//     .catch(() => {
//       row.status = row.status === '0' ? '1' : '0'
//     })
// }

/** 重置新增的表单以及其他数据 */
function reset() {
  form.value = {
    wordList: [{ key: Date.now(), wordStr: '', userId: [] }]
  }

  sensitiveWordRef.value?.resetFields()
}

/** 添加敏感词项 */
function addWordItem() {
  form.value.wordList.push({
    key: Date.now(),
    wordStr: '',
    userId: []
  })
}

/** 删除敏感词项 */
function removeWordItem(index: number) {
  form.value.wordList.splice(index, 1)
}

/** 添加敏感词 */
async function handleAdd() {
  open.value = true
  title.value = '添加敏感词'
  await nextTick()
  reset()
}

/** 修改敏感词 */
async function handleUpdate(row: any) {
  reset()
  const wordId = row.id || ids.value
  try {
    row.loading = true
    const response = await getSensitiveWord(wordId)
    // 确保wordList是数组格式
    if (response.data && !response.data.wordList && response.data.wordStr) {
      // 兼容旧数据格式
      response.data.wordList = [{ id: wordId, wordStr: response.data.wordStr, userId: response.data.userId || [] }]
    }
    form.value = response.data
    open.value = true
    title.value = '修改敏感词'
  } catch (error) {
    console.error(error)
  }
  row.loading = false
}

/** 提交按钮 */
function submitForm() {
  sensitiveWordRef.value.validate(async (valid: any) => {
    if (valid) {
      // 处理表单数据，可能需要根据后端API要求进行转换
      const submitData = [
        ...form.value.wordList.map(({ userId, wordStr, id }: any) => ({
          id,
          wordStr,
          userId: userId.map((ids: any) => (Array.isArray(ids) && ids.length > 0 ? ids[ids.length - 1] : ids)).filter(Boolean)
        }))
      ]

      try {
        let reqlist: Promise<any>[] = []
        reqlist = submitData.map(info => insertSensitiveWord(info))
        await Promise.all(reqlist)
        ElMessage.success(form.value.id ? '修改成功' : '新增成功')
        open.value = false
        getList()
      } catch (error) {
        console.error(error)
      }
    }
  })
}

/** 取消按钮 */
function cancel() {
  open.value = false
  reset()
}
onMounted(() => {
  getList()
  getDeptTreeUser()
})
</script>

<style lang="scss" scoped>
.custom-table {
  color: #333;
}
.userId {
  width: 100%;
}

.word-item {
  border: 1px solid #ebeef5;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  background-color: #fafafa;
}

.word-item:last-child {
  margin-bottom: 0;
}
</style>
