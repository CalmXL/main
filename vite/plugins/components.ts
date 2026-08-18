import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default function createComponents() {
  return Components({
    transformer: 'vue3',
    dts: 'types/components.d.ts',
    resolvers: [
      ElementPlusResolver({
        importStyle: 'sass',
        directives: true,
        version: '2.7.2'
      })
    ]
  })
}
