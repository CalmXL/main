<template>
  <!-- 授权用户 -->
  <el-dialog v-model="visible" title="选择用户" width="1000px" top="5vh" append-to-body>
    <el-form ref="queryRef" :model="queryParams" :inline="true">
      <el-form-item label="用户名称" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入用户名称"
          clearable
          style="width: 200px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickName">
        <el-input
          v-model="queryParams.nickName"
          placeholder="请输入用户昵称"
          clearable
          style="width: 200px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="phonenumber">
        <el-input
          v-model="queryParams.phonenumber"
          placeholder="请输入手机号码"
          clearable
          style="width: 200px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row>
      <el-table
        ref="refTable"
        :data="userList"
        height="360px"
        @row-click="clickRow"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="用户名称" prop="userName" :show-overflow-tooltip="true" />
        <el-table-column label="用户昵称" prop="nickName" :show-overflow-tooltip="true" />
        <el-table-column label="邮箱" prop="email" :show-overflow-tooltip="true" />
        <el-table-column label="手机" prop="phonenumber" :show-overflow-tooltip="true" />
        <el-table-column label="状态" align="center" prop="status">
          <template #default="scope">
            <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        :total="total"
        style="width:100%;min-height:30px"
        @pagination="getList"
      />
    </el-row>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleSelectUser">确 定</el-button>
        <el-button @click="visible = false">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="SelectUser" lang="ts">
/* eslint-disable camelcase */
import { getCurrentInstance, ComponentInternalInstance, ref, reactive } from 'vue'
import { authUserSelectAll, unallocatedUserList } from '@/api/system/role'
import { parseTime } from '@/utils/ruoyi'

const props = defineProps({
  roleId: {
    type: [Number, String]
  }
})

const { proxy } = getCurrentInstance() as ComponentInternalInstance

const { sys_normal_disable } = proxy!.useDict('sys_normal_disable')

const userList = ref<any[]>([])
const visible = ref(false)
const total = ref(0)
const userIds = ref<any[]>([])

const queryParams = reactive<{
    pageNum: number;
    pageSize: number;
    roleId?: any;
    userName: any;
    nickName: any;
    phonenumber: any;
}>({
  pageNum: 1,
  pageSize: 20,
  roleId: undefined,
  userName: undefined,
  nickName: undefined,
  phonenumber: undefined
})

// 显示弹框
function show() {
  queryParams.roleId = props.roleId
  getList()
  visible.value = true
}
/** 选择行 */
function clickRow(row: any) {
  (proxy?.$refs.refTable as any).toggleRowSelection(row)
}
// 多选框选中数据
function handleSelectionChange(selection: any[]) {
  userIds.value = selection.map(item => item.userId)
}
// 查询表数据
function getList() {
  unallocatedUserList(queryParams).then((res: any) => {
    userList.value = res.rows
    total.value = res.total
  })
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.pageNum = 1
  getList()
}
/** 重置按钮操作 */
function resetQuery() {
    proxy!.resetForm('queryRef')
    handleQuery()
}
const emit = defineEmits(['ok'])
/** 选择授权用户操作 */
function handleSelectUser() {
  const { roleId } = queryParams
  const uIds = userIds.value
  if (uIds.length === 0) {
        proxy!.$modal.msgError('请选择要分配的用户')
        return
  }
  authUserSelectAll({ roleId, userIds: uIds }).then((res: any) => {
        proxy!.$modal.msgSuccess(res.msg)
        if (res.code === 200) {
          visible.value = false
          emit('ok')
        }
  })
}

defineExpose({
  show
})
</script>
