import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default function createAutoImport() {
  return AutoImport({
    dts: 'types/auto-imports.d.ts',
    resolvers: [ElementPlusResolver()],
    eslintrc: {
      enabled: true,
      filepath: 'types/.eslintrc-auto-import.json',
      globalsPropValue: true
    },
    imports: ['vue', 'vue-router']
  })
}
