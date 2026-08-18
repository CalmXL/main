import vue from '@vitejs/plugin-vue'
import { PluginOption } from 'vite'
import ElementPlus from 'unplugin-element-plus/vite'

import legacy from '@vitejs/plugin-legacy'
import createAutoImport from './auto-import'
import createComponents from './components'
import createSvgIcon from './svg-icon'
import createCompression from './compression'
import createSetupExtend from './setup-extend'
import { codeInspectorPlugin } from 'code-inspector-plugin'

export default function createVitePlugins(viteEnv: Record<string, string>, isBuild = false) {
  const isCompatibleMode = viteEnv.VITE_APP_COMPATIBLE_MODE === 'true'

  const vitePlugins: PluginOption[] = [vue()]
  vitePlugins.push(ElementPlus({ useSource: true }))
  vitePlugins.push(createAutoImport())
  vitePlugins.push(createComponents())
  vitePlugins.push(createSetupExtend())
  vitePlugins.push(createSvgIcon(isBuild))
  isBuild && vitePlugins.push(...createCompression(viteEnv))
  vitePlugins.push(codeInspectorPlugin({
    bundler: 'vite',
  }),)
  if (isCompatibleMode) {
    vitePlugins.push(
      legacy({
        targets: ['defaults', 'not IE 11', 'Chrome 86'], // 适配低版本 Chrome
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'] // 可选
      })
    )
  }
  return vitePlugins
}
