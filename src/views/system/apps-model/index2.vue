<template>
  <PageContent class="">
    <template #top>
      <el-form ref="queryRef" :model="queryParams" inline>
        <el-form-item label="应用名称" prop="modelName">
          <el-select v-model="queryParams.modelName" placeholder="请选择应用名称" clearable style="width: 200px">
            <el-option v-for="item in sysModelApps" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          <el-button icon="Plus" @click="open = true">创建应用</el-button>
        </el-form-item>
      </el-form>
    </template>
    <el-table v-loading="loading" :data="modelList" height="100%">
      <el-table-column type="index" width="80" align="center" label="序号" />
      <el-table-column prop="provider" label="提供商" />
      <el-table-column prop="type" label="模型类型" />
      <el-table-column prop="modelName" label="模型名称" />
      <el-table-column v-if="!['sonic'].includes(queryParams.modelName)" prop="maxTokens" label="最大token" />
      <template v-if="['sonic'].includes(queryParams.modelName)">
        <el-table-column prop="createdAt" label="创建时间" />
        <el-table-column prop="updatedAt" label="更新时间" />
      </template>
      <template v-if="!['ragflow', 'dify', 'sonic'].includes(queryParams.modelName)">
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column label="默认" width="100">
          <template #default="scope">
            <el-switch v-if="scope.row.use !== undefined" v-model="scope.row.use" active-value="1" inactive-value="0" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button type="primary" link @click="handleEdit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </template>
    </el-table>

    <create-apps-model v-model:open="open" :current-app="currentApp" @success="getData" />
  </PageContent>
</template>
<script lang="ts" setup>
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'
import { getDifyModels, getRagModels, getDifyProviders, getSonicsModels } from '@/api/system/appsModel'
import { useDict } from '@/utils/dict'
import { ModelItem } from './type'
import CreateAppsModel from './create.vue'

const { sys_model_apps: sysModelApps } = useDict('sys_model_apps')
const queryParams = reactive({
  modelName: ''
})

const loading = ref(false)
const modelList = ref<ModelItem[]>([])

const open = ref(false)
const currentApp = ref<any>(null)

function handleEdit(row: any) {
  open.value = true
  currentApp.value = row
}

const getData = async () => {
  const { modelName } = queryParams
  if (!modelName) return
  try {
    loading.value = true
    modelList.value = []
    if (modelName === 'ragflow') {
      const { code, data }: any = await getRagModels()
      if (code === 0) {
        const dataList: ModelItem[] = []
        Object.entries(data).forEach(([key, value]: any) => {
          const llmList = value?.llm ?? {}
          dataList.push(
            ...llmList.map(({ name, type, used_token }: any) => ({
              type,
              provider: key,
              modelName: name,
              maxTokens: used_token
            }))
          )
        })
        modelList.value = dataList
      } else {
        ElMessage.error('获取失败')
      }
    } else if (modelName === 'dify') {
      const { data: providers }: any = await getDifyProviders()
      const providerKeys = providers?.map((i: any) => i.provider)?.filter(Boolean) ?? []
      const reqs = providerKeys.map((provider: string) => getDifyModels(provider))
      const resps = await Promise.all(reqs)
      const dataList: ModelItem[] = []
      resps.forEach((resp: any) => {
        const { data }: any = resp
        dataList.push(
          ...data.map((i: any) => {
            const { model, model_properties, model_type, provider } = i
            return {
              type: model_type,
              provider: provider.label.zh_Hans,
              modelName: model,
              maxTokens: model_properties.context_size
            }
          })
        )
      })
      modelList.value = dataList
    } else if (modelName === 'sonic') {
      const { data }: any = await getSonicsModels()
      modelList.value = data.map((i: any) => {
        const { name, config, createdAt, updatedAt } = i
        const { provider, modelName } = config
        return {
          nicname: name,
          type: 'llm',
          provider,
          modelName,
          maxTokens: '',
          createdAt: dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: dayjs(updatedAt).format('YYYY-MM-DD HH:mm:ss')
        }
      })
    }
    loading.value = false
  } catch (error) {
    console.error(error)
    loading.value = false
  }
}

function handleQuery() {
  getData()
}

function resetQuery() {
  queryParams.modelName = ''
  getData()
}

watch(
  sysModelApps,
  val => {
    const [first] = val ?? []
    if (!first) return
    queryParams.modelName = first.value
  },
  { immediate: true }
)

watch(() => queryParams.modelName, getData, { immediate: true })
</script>
