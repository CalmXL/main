<template>
  <PageContent class="app-container">
    <template #top>
      <el-form v-show="showSearch" ref="queryRef" :model="queryParams" :inline="true">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="queryParams.menuName" placeholder="请输入菜单名称" clearable style="width: 200px" @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="菜单状态" clearable style="width: 200px">
            <el-option v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button v-hasPermi="['system:menu:add']" type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="info" plain icon="Sort" @click="toggleExpandAll">展开/折叠</el-button>
        </el-col>
        <right-toolbar v-model:show-search="showSearch" @query-table="getList" />
      </el-row>
    </template>
    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="menuList"
      row-key="menuId"
      height="100%"
      :default-expand-all="isExpandAll"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      class="base-table"
      stripe
    >
      <el-table-column prop="menuName" label="菜单名称" :show-overflow-tooltip="true" width="200" />
      <!-- <el-table-column prop="icon" label="图标" align="center" width="100">
        <template #default="scope">
          <svg-icon :icon-class="scope.row.icon" />
        </template>
      </el-table-column> -->
      <el-table-column prop="orderNum" align="center" label="排序" width="60" />
      <el-table-column prop="perms" label="权限标识" :show-overflow-tooltip="true" />
      <el-table-column prop="agentId" label="应用ID" :show-overflow-tooltip="true" />
      <el-table-column prop="component" label="组件路径" :show-overflow-tooltip="true" />
      <el-table-column prop="path" label="路由地址" :show-overflow-tooltip="true" />
      <el-table-column prop="query" label="路由参数" :show-overflow-tooltip="true" />
      <el-table-column prop="status" label="状态" width="80">
        <template #default="scope">
          <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" width="160" prop="createTime">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="80" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-popover placement="top" :width="180" trigger="hover">
            <template #reference>
              <PopoverBtn />
            </template>
            <div class="flex justify-center items-center">
              <el-button v-hasPermi="['system:menu:edit']" :loading="editLoading" link type="primary" @click="handleUpdate(scope.row)">
                修改
              </el-button>
              <el-button v-hasPermi="['system:menu:add']" link type="primary" @click="handleAdd(scope.row)">新增</el-button>
              <el-button v-hasPermi="['system:menu:remove']" link type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </div>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改菜单对话框 -->
    <Dialog v-model="open" :title="title" width="780px" append-to-body>
      <el-form ref="menuRef" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单">
              <el-tree-select
                v-model="form.parentId"
                :data="menuOptions"
                :props="{ value: 'menuId', label: 'menuName', children: 'children' }"
                value-key="menuId"
                placeholder="选择上级菜单"
                check-strictly
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="form.menuType" @change="changeMenuType">
                <el-radio label="M">目录</el-radio>
                <el-radio label="C">菜单</el-radio>
                <el-radio label="F">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <template v-if="form.menuType !== 'F'">
            <el-col :span="12">
              <el-form-item label="菜单图标" prop="icon">
                <el-popover v-model:visible="showChooseIcon" placement="bottom-start" :width="540" trigger="click" @show="showSelectIcon">
                  <template #reference>
                    <el-input
                      v-model="form.icon"
                      v-click-outside="hideSelectIcon"
                      placeholder="点击选择图标"
                      readonly
                      @blur="showSelectIcon"
                    >
                      <template #prefix>
                        <template v-if="form.icon && form.icon !== '#'">
                          <el-icon v-if="/^nav-/.test(form.icon)">
                            <svg-icon :icon-class="form.icon" />
                          </el-icon>
                          <el-icon v-else>
                            <component :is="form.icon" />
                          </el-icon>
                        </template>
                        <el-icon v-else>
                          <search />
                        </el-icon>
                      </template>
                    </el-input>
                  </template>
                  <icon-select ref="iconSelectRef" @selected="selected" />
                </el-popover>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="图标大小" prop="iconSize">
                <el-input-number v-model="form.iconSize" controls-position="right" placeholder="请输入图标大小" class="!w-full" />
              </el-form-item>
            </el-col>
          </template>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="form.menuName" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" class="!w-full" :min="0" />
            </el-form-item>
          </el-col>
          <el-col v-if="['M', 'C'].includes(form.menuType)" :span="12">
            <el-form-item>
              <template #label>
                <span>是否微前端</span>
              </template>
              <el-radio-group v-model="form.isMicro">
                <el-radio label="0">是</el-radio>
                <el-radio label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col v-if="form.isMicro !== '0' && !['F'].includes(form.menuType)" :span="12">
            <el-form-item>
              <template #label>
                <span>
                  是否外链
                  <el-tooltip content="选择是外链则路由地址需要以`http(s)://`开头" placement="top">
                    <Question />
                  </el-tooltip>
                </span>
              </template>
              <el-radio-group v-model="form.isFrame">
                <el-radio label="0">是</el-radio>
                <el-radio label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col v-if="form.menuType !== 'F'" :span="12">
            <el-form-item prop="path">
              <template #label>
                <span>
                  路由地址
                  <el-tooltip content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头" placement="top">
                    <Question />
                  </el-tooltip>
                </span>
              </template>
              <el-input v-model="form.path" placeholder="请输入路由地址" />
            </el-form-item>
          </el-col>
          <template v-if="['C', 'M'].includes(form.menuType)">
            <template v-if="form.isMicro !== '0'">
              <el-col v-if="form.menuType === 'C'" :span="12">
                <el-form-item prop="component">
                  <template #label>
                    <span>
                      组件路径
                      <el-tooltip content="访问的组件路径，如：`system/user/index`，默认在`views`目录下" placement="top">
                        <Question />
                      </el-tooltip>
                    </span>
                  </template>
                  <el-input v-model="form.component" placeholder="请输入组件路径" />
                </el-form-item>
              </el-col>
            </template>
            <template v-else>
              <el-col :span="12">
                <el-form-item prop="component" :rules="[{ required: true, message: '微应用地址不能为空', trigger: 'blur' }]">
                  <template #label>
                    <span>
                      微应用地址
                      <el-tooltip content="微应用地址，如：`https://baidu.com/`" placement="top">
                        <Question />
                      </el-tooltip>
                    </span>
                  </template>
                  <el-input v-model="form.component" placeholder="请输入微应用地址" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="group" label="微前端应用" :rules="[{ required: true, message: '微应用地址不能为空', trigger: 'blur' }]">
                  <el-select v-model="form.group" placeholder="">
                    <el-option v-for="item in microPaths" :key="item.id" :label="item.label" :value="item.id" />
                  </el-select>
                  <!-- <el-input v-model="form.component" placeholder="请输入微应用地址" /> -->
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="showHistory" label="显示历史列表">
                  <el-radio-group v-model="form.showHistory" placeholder="">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </template>
          </template>
          <el-col v-if="form.menuType !== 'M'" :span="12">
            <el-form-item>
              <el-input v-model="form.perms" placeholder="请输入权限标识" maxlength="100" />
              <template #label>
                <span>
                  权限字符
                  <el-tooltip content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)" placement="top">
                    <Question />
                  </el-tooltip>
                </span>
              </template>
            </el-form-item>
          </el-col>
          <el-col v-if="form.menuType === 'C'" :span="12">
            <el-form-item>
              <template #label>
                <span>
                  应用ID
                  <el-tooltip content="数据埋点使用，用于记录应用使用次数" placement="top">
                    <Question />
                  </el-tooltip>
                </span>
              </template>
              <el-input v-model="form.agentId" placeholder="请输入埋点ID" />
            </el-form-item>
          </el-col>
          <el-col v-if="['C'].includes(form.menuType)" :span="12">
            <el-form-item>
              <template #label>
                <span>
                  是否缓存
                  <el-tooltip content="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致" placement="top">
                    <Question />
                  </el-tooltip>
                </span>
              </template>
              <el-radio-group v-model="form.isCache">
                <el-radio label="0">缓存</el-radio>
                <el-radio label="1">不缓存</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col v-if="form.menuType !== 'F'" :span="12">
            <el-form-item>
              <template #label>
                <span>
                  显示状态
                  <el-tooltip content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问" placement="top">
                    <Question />
                  </el-tooltip>
                </span>
              </template>
              <el-radio-group v-model="form.visible">
                <el-radio v-for="dict in sys_show_hide" :key="dict.value" :label="dict.value">
                  {{ dict.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col v-if="form.menuType !== 'F'" :span="12">
            <el-form-item>
              <template #label>
                <span>
                  菜单状态
                  <el-tooltip content="选择停用则路由将不会出现在侧边栏，也不能被访问" placement="top">
                    <Question />
                  </el-tooltip>
                </span>
              </template>
              <el-radio-group v-model="form.status">
                <el-radio v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.value">
                  {{ dict.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col v-if="['M', 'C'].includes(form.menuType)" :span="12">
            <el-form-item label="禁用">
              <el-radio-group v-model="form.disabled">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col v-if="['M', 'C'].includes(form.menuType)" :span="12">
            <el-form-item label="开发调试">
              <el-radio-group v-model="form.dev">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col v-if="['M', 'C'].includes(form.menuType)" :span="12">
            <el-form-item>
              <!-- <el-input v-model="form.query" placeholder="请输入路由参数" maxlength="255" /> -->
              <div class="query-list">
                <div v-for="(item, index) in querylist" :key="index" class="query-item">
                  <ElInput v-model="item.key" size="small" />
                  <span class="query-item-colon">:</span>
                  <ElInput v-model="item.value" size="small" />
                  <el-icon class="query-item-close" size="16" @click="removeQueryItem(index)"><CircleClose /></el-icon>
                </div>
                <ElButton type="primary" size="small" @click="addQueryItem">新增</ElButton>
              </div>
              <template #label>
                <span>
                  路由参数
                  <el-tooltip placement="top" content="访问路由的默认传递参数，如：`{&quot;id&quot;: 1, &quot;name&quot;: &quot;ry&quot;}`">
                    <Question />
                  </el-tooltip>
                </span>
              </template>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </template>
    </Dialog>
  </PageContent>
</template>

<script setup name="Menu" lang="ts">
/* eslint-disable camelcase */
import { FormRules, ClickOutside as vClickOutside } from 'element-plus'
import { getCurrentInstance, ComponentInternalInstance, ref, reactive, toRefs, nextTick } from 'vue'
import { fromPairs } from 'lodash'
import { addMenu, delMenu, getMenu, listMenu, updateMenu } from '@/api/system/menu'
import SvgIcon from '@/components/SvgIcon/index.vue'
// import IconSelect from '@/components/IconSelect/index.vue'
import { handleTree, parseTime, resetForm } from '@/utils/ruoyi'
import { useDict } from '@/utils/dict'
import modal from '@/plugins/modal'
import { microPaths } from '@/config'

const { proxy } = getCurrentInstance() as ComponentInternalInstance

const { sys_show_hide, sys_normal_disable } = useDict('sys_show_hide', 'sys_normal_disable')

const menuList = ref<any[]>([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const title = ref('')
const menuOptions = ref<any[]>([])
const isExpandAll = ref(false)
const refreshTable = ref(true)
const showChooseIcon = ref(false)
const iconSelectRef = ref<any>(null)

const data = reactive<{
  form: any
  queryParams: any
  rules: FormRules<any>
}>({
  form: {},
  queryParams: {
    menuName: undefined,
    visible: undefined
  },
  rules: {
    menuName: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }],
    orderNum: [{ required: true, message: '菜单顺序不能为空', trigger: 'blur' }],
    path: [{ required: true, message: '路由地址不能为空', trigger: 'blur' }]
  }
})

const validatorMicroPath = (rule: any, value: any, callback: any) => {
  if (/^(https?:\/\/)/.test(value) || /^\/\/\S+/.test(value)) {
    callback()
  } else {
    callback(new Error('地址格式异常，http(s)://'))
  }
}

type IconInfo = {
  type: 'element' | 'custom'
  name: string
}

const { queryParams, form, rules } = toRefs(data)

const querylist = ref<{ key: string; value: string }[]>([])

const addQueryItem = () => {
  querylist.value.push({ key: '', value: '' })
}

const removeQueryItem = (index: number) => {
  querylist.value.splice(index, 1)
}

watch(
  form,
  value => {
    const query = value.query || 'null'

    try {
      querylist.value = Object.entries(JSON.parse(query)).map(([key, value]) => ({ key, value })) as { key: string; value: string }[]
    } catch (error) {
      querylist.value = []
    }
  },
  { immediate: true }
)

const queryString = computed(() => {
  const list = querylist.value
    .filter(item => item.key !== '' && item.value !== '')
    .map(item => {
      let value: any = item.value?.trim?.() ?? item.value
      const key = item.key?.trim?.() ?? item.key
      if (value === 'true' || value === 'false') {
        value = value === 'true'
      } else if (/^\d+$/.test(value) || /^\d+\.\d+$/.test(value)) {
        value = Number(value)
      }
      return [key, value]
    })
  if (list.length === 0) return ''

  const map = fromPairs(list)

  return JSON.stringify(map)
})

watch(
  queryString,
  value => {
    if (value.length > 255) {
      modal.msgError('路由参数不能超过255个字符')
    }
  },
  { immediate: true }
)

/** 查询菜单列表 */
function getList() {
  loading.value = true
  listMenu(queryParams.value).then(response => {
    menuList.value = handleTree(response.data, 'menuId')
    loading.value = false
  })
}
/** 查询菜单下拉树结构 */
function getTreeselect() {
  menuOptions.value = []
  return listMenu().then((response: any) => {
    const menu: any = { menuId: 0, menuName: '主类目', children: [] }
    menu.children = handleTree(response.data, 'menuId')
    menuOptions.value.push(menu)
  })
}
/** 取消按钮 */
function cancel() {
  open.value = false
  reset()
}
/** 表单重置 */
function reset() {
  form.value = {
    menuId: undefined,
    parentId: 0,
    menuName: undefined,
    icon: undefined,
    menuType: 'M',
    orderNum: undefined,
    isMicro: '1',
    isFrame: '1',
    isCache: '0',
    visible: '0',
    status: '0'
  }
  const menuRef = proxy?.$refs.menuRef as any
  menuRef?.resetFields()
}
/** 展示下拉图标 */
function showSelectIcon() {
  iconSelectRef.value.reset()
  showChooseIcon.value = true
}
/** 选择图标 */
function selected(info: IconInfo) {
  form.value.icon = info.name
  showChooseIcon.value = false
}
/** 图标外层点击隐藏下拉列表 */
function hideSelectIcon(event: any) {
  const elem = event.relatedTarget || event.srcElement || event.target || event.currentTarget
  const { className } = elem
  if (className !== 'el-input__inner') {
    showChooseIcon.value = false
  }
}
/** 搜索按钮操作 */
function handleQuery() {
  getList()
}
/** 重置按钮操作 */
function resetQuery() {
  resetForm('queryRef')
  handleQuery()
}
/** 新增按钮操作 */
function handleAdd(row: any) {
  reset()
  getTreeselect()
  if (row != null && row.menuId) {
    form.value.parentId = row.menuId
  } else {
    form.value.parentId = 0
  }
  open.value = true
  title.value = '添加菜单'
}
/** 展开/折叠操作 */
function toggleExpandAll() {
  refreshTable.value = false
  isExpandAll.value = !isExpandAll.value
  nextTick(() => {
    refreshTable.value = true
  })
}
/** 修改按钮操作 */
const editLoading = ref(false)
const microKeys = [{ key: 'group' }, { key: 'iconSize' }, { key: 'showHistory' }, { key: 'disabled' }, { key: 'dev' }]
async function handleUpdate(row: any) {
  reset()
  try {
    editLoading.value = true
    await getTreeselect()
    const { data = {} } = await getMenu(row.menuId)

    try {
      const query = JSON.parse(data.query) ?? {}
      microKeys.forEach(item => {
        if (query[item.key] !== undefined) {
          data[item.key] = query[item.key]
          delete query[item.key]
        }
      })

      data.query = JSON.stringify(query)
    } catch (error) {}

    console.log(data)
    form.value = data
    open.value = true
    title.value = '修改菜单'
  } catch (error) {
    console.error(error)
  } finally {
    editLoading.value = false
  }
}
/** 提交按钮 */
function submitForm() {
  form.value.query = queryString.value
  const menuRef = proxy?.$refs.menuRef as any
  menuRef.validate((valid: any) => {
    if (valid) {
      let query: Record<string, any> = {}
      try {
        query = JSON.parse(form.value.query || '{}') ?? {}
      } catch (error) {
        console.error(error)
      }
      microKeys.forEach(item => {
        query[item.key] = form.value[item.key]
      })
      form.value.query = JSON.stringify(query)
      if (form.value.menuId !== undefined) {
        // form.value.meta = { microApp: form.value.microApp }
        updateMenu(form.value).then(() => {
          modal.msgSuccess('修改成功')
          open.value = false
          getList()
        })
      } else {
        addMenu(form.value).then(() => {
          modal.msgSuccess('新增成功')
          open.value = false
          getList()
        })
      }
    }
  })
}
/** 删除按钮操作 */
function handleDelete(row: any) {
  modal
    .confirm(`是否确认删除名称为"${row.menuName}"的数据项?`)
    .then(() => delMenu(row.menuId))
    .then(() => {
      getList()
      modal.msgSuccess('删除成功')
    })
    .catch((e: any) => {
      console.log(e)
    })
}

function changeMenuType() {
  form.value.isMicro = '1'
  form.value.component = ''
}

getList()
</script>

<style lang="scss" scoped>
.custom-table {
  color: #333;
}

.query-list {
  gap: 8px;
  display: flex;
  flex-direction: column;

  .query-item-colon {
    margin: 0 4px;
  }

  .query-item {
    display: flex;
    position: relative;

    .query-item-close {
      top: 0;
      right: 0;
      width: 20px;
      height: 20px;
      cursor: pointer;
      position: absolute;
      transform: translateY(-50%) translateX(50%);
      transition: all 0.3s;
      border-radius: 50px;
      background-color: white;

      &:hover {
        color: #f56c6c;
      }
    }
  }
}
</style>
