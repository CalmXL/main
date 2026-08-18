export const BASE_URL = import.meta.env.VITE_APP_BASE_API
export const isProd = import.meta.env.VITE_APP_ENV === 'production'
export const remFontSize = 32

export const useRem = import.meta.env.VITE_APP_USE_REM === 'true'

export const is804Env = import.meta.env.VITE_APP_BUILD_ENV === '804'
export const isDxEnv = import.meta.env.VITE_APP_BUILD_ENV === 'dx'
export const PrePath = import.meta.env.VITE_APP_PRE_PROXY_PATH
export const HideLogo = import.meta.env.VITE_APP_HIDE_LOGO === 'true'
export const is804PreEnv = is804Env && (location.origin === 'https://ai.maxrocky.com:8012' || location.origin === 'https://testai.maxrocky.com:8012')

export const microPaths = [
  { path: '/rag', name: '/rag', id: 'rag', label: 'Rag', prefix: '', devServer: `${location.origin}/rag` },
  { path: '/newTender', name: '/newTender', id: 'newTender', label: 'newTender', prefix: '', devServer: `${location.origin}/newTender` },
  { path: '/resume', name: '/resume', id: 'resume', label: '人事简历', prefix: '', devServer: `${location.origin}/resume` },
  { path: '/craft', name: '/craft', id: 'craft', label: '工艺', prefix: '', devServer: `${location.origin}/craft` },
  { path: '/templateDify', name: '/templateDify', id: 'templateDify', label: '工作流模板', prefix: '', devServer: `${location.origin}/templateDify` },
  { path: '/okr', name: '/okr', id: 'okr', label: '考核管理', prefix: '', devServer: `${location.origin}/okr` },
  { path: '/dify', name: '/flow', id: 'flow', label: '工作流', prefix: '', tokenKey: 'access_token', devServer: `${location.origin}/dify` },
  { path: '/max', name: '/max', id: 'max', label: 'Max', prefix: '', devServer: `${location.origin}/max/` },
  { path: '/bid-review', name: '/bid-review', id: 'bid-review', label: '标书审核', prefix: '', devServer: `${location.origin}/bid-review/` },
  // { path: '/dify', prefix: '', devServer: `${location.protocol}//${location.hostname}:3000/dify` },
  {
    path: '/sonic',
    name: '/sonic',
    id: 'sonic',
    label: 'Sonic',
    prefix: '/business',
    devServer: `${location.protocol}//${location.hostname}:9000/sonic`
  }
]

export type MicroPath = (typeof microPaths)[number]

export const AiWorkUrl = `${PrePath}/indicator_platform_server/aiWriting/api`
export const RagBastUrl = `${PrePath}/indicator_platform_server/rag/v1`
export const ModelBaseUrl = import.meta.env.VITE_APP_BASE_API_MODEL // isProd ? `${PrePath}/indicator_platform_server/model8020` : '/models'
export const ModelFlowBaseUrl = `${PrePath}/indicator_platform_server/api3020`
export const AiBidsUrl = `${PrePath}/indicator_platform_server/ppt5001/api/v1/bids`
export const FeedbackBaseUrl = BASE_URL
// export const ModelBaseUrl = `${PrePath}/indicator_platform_server/model8020`
export const BaseLoginUrl = '/login'
export const LoginUrl = `${PrePath}${BaseLoginUrl}`
export const ServerIp = import.meta.env.VITE_APP_SERVER_IP

export const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

export const CDN_URL = import.meta.env.VITE_APP_CDN_URL

export const BaseApiModel = import.meta.env.VITE_APP_BASE_API_MODEL

export const WatermarkText = import.meta.env.VITE_APP_WATERMARK_TEXT
