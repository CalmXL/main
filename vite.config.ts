import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import postcsspxtorem from 'postcss-pxtorem'
import createVitePlugins from './vite/plugins'
import { readFileSync } from 'fs'
import { viteExternalsPlugin } from 'vite-plugin-externals'

// UnoCSS dynamic import to avoid ESM issues
let UnoCSS: any
async function loadUnoCSS() {
  try {
    const unocss = await import('unocss/vite')
    UnoCSS = unocss.default
  } catch (e) {
    UnoCSS = () => ({})
    console.warn('UnoCSS not available, using empty plugin')
  }
}

export default defineConfig(async ({ mode, command }) => {
  const env = loadEnv(mode, process.cwd())

  // Load UnoCSS dynamically
  await loadUnoCSS()

  const useRem = env.VITE_APP_USE_REM === 'true'
  const useCDN = env.VITE_APP_USE_CDN === 'true'
  const preProxyPath = env.VITE_APP_PRE_PROXY_PATH || '/'

  const cdnCjsJson = readFileSync(path.resolve(__dirname, 'vite/assets/CDN_CJS.json'), 'utf-8')
  const cdnCjsObj = JSON.parse(cdnCjsJson)

  const cdnCssObj = cdnCjsObj.filter((item: any) => item.type === 'css')
  const cdnJsObj = cdnCjsObj.filter((item: any) => item.type === 'js').filter((item: any) => !item.disabled)

  const externals = cdnJsObj.reduce((pre: any, cur: any) => {
    pre[cur.name] = cur.global
    return pre
  }, {})

  const cdnJson = cdnJsObj.map((item: any) => `<script src="${item.src}"></script>`).join('\n')
  const cdnCssJson = cdnCssObj.map((item: any) => `<link rel="stylesheet" href="${item.src}">`).join('\n')

  return {
    plugins: [
      UnoCSS(),
      // useCDN ? viteExternalsPlugin(externals) : undefined,
      ...createVitePlugins(env, command === 'build'),
      {
        name: 'html-transform',
        transformIndexHtml(html: string) {
          // 根据环境注入不同的脚本或 meta
          const envScript = useCDN ? `${cdnJson}` : ''
          const envCss = useCDN ? `${cdnCssJson}` : ''
          return html.replace('<!-- inject:script -->', envScript).replace('<!-- inject:css -->', envCss)
        }
      }
    ].filter(Boolean),
    // 部署生产环境和开发环境下的URL。
    // 默认情况下，vite 会假设你的应用是被部署在一个域名的根路径上
    // 例如 https://www.ruoyi.vip/。
    // 如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.ruoyi.vip/admin/，则设置 baseUrl 为 /admin/。
    base: preProxyPath,
    server: {
      port: 8090,
      cors: true,
      host: true,
      // allowedHosts: ["mac.space77.cc"],
      proxy: {
        // '/house-admin': {
        //   target: 'http://175.178.60.159:81',
        //   changeOrigin: true,
        //   ws: true,
        //   secure: false
        // }
        '/indicator_platform_server': {
          target: 'https://testai.maxrocky.com/',
          changeOrigin: true,
          ws: true,
          secure: false
        },
        '/filedown': {
          target: 'https://testai.maxrocky.com/',
          changeOrigin: true,
          ws: true,
          secure: false
        },
        '/microPath': {
          target: 'http://localhost:5173/',
          changeOrigin: true,
          ws: true,
          secure: false,
          rewrite: p => p.replace(/^\/microPath/, '')
        },
        '/rag': {
          target: 'http://localhost:5177/',
          changeOrigin: true,
          ws: true,
          secure: false
          // rewrite: p => p.replace(/^\/rag/, '')
        },
        '/max': {
          target: 'http://localhost:3000/',
          changeOrigin: true,
          ws: true,
          secure: false
          // rewrite: p => p.replace(/^\/rag/, '')
        },
        '/maximum': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
          rewrite: p => p.replace(/^\/maximum\//, '/')
        },
        '/console': {
          // target: 'https://testai.maxrocky.com/',
          target: 'http://114.115.135.46:8014/',
          changeOrigin: true,
          ws: true,
          secure: false
          // rewrite: p => p.replace(/^\/rag/, '')
        },
        '/onlyofficeApi': {
          target: 'https://testai.maxrocky.com/',
          changeOrigin: true,
          secure: false,
          ws: true
        },
        '/difyApi': {
          // target: 'http://114.115.135.46:8009/',
          target: 'https://testai.maxrocky.com/',
          changeOrigin: true,
          secure: false
        },
        '/dify': {
          // target: 'https://testai.maxrocky.com/',
          target: 'http://localhost:3000/',
          changeOrigin: true,
          secure: false,
          ws: true
        },
        '/craft': {
          // target: 'https://testai.maxrocky.com/',
          target: 'http://localhost:9527/',
          changeOrigin: true,
          secure: false
        },
        '/templateDify': {
          // target: 'https://testai.maxrocky.com/',
          target: 'http://localhost:3000/',
          changeOrigin: true,
          secure: false
        },
        '/proxy': {
          target: 'https://testai.maxrocky.com',
          // target: 'http://localhost:8020/',
          // target: 'http://localhost:3001',
          changeOrigin: true,
          secure: false
        },
        '/pp': {
          // target: 'https://testai.maxrocky.com/',
          target: 'http://localhost:8020/',
          changeOrigin: true,
          secure: false
        },
        '/api': {
          target: 'http://localhost:8020/',
          changeOrigin: true,
          secure: false,
          ws: true
        },
        '/queueTest': {
          target: 'http://localhost:8020/',
          changeOrigin: true,
          secure: false,
          ws: true,
          rewrite: p => p.replace(/^\/queueTest/, '')
        },
        '/resume': {
          target: 'http://localhost:3000/',
          changeOrigin: true,
          secure: false,
          ws: true
        },
        '/okr': {
          target: 'http://localhost:5173/',
          changeOrigin: true,
          secure: false,
          ws: true
        },
        '/flowBase': {
          target: 'http://114.115.135.46:7090/3020/',
          changeOrigin: true,
          secure: false,
          ws: true,
          rewrite: p => p.replace(/^\/flowBase/, '')
        },
        '/vditor': {
          // target: 'http://localhost:5173/',
          target: 'https://testai.maxrocky.com/zhiyuan-static',
          changeOrigin: true,
          secure: false,
          ws: true,
          rewrite: p => p.replace(/^\/vditor/, '/vditor@3.11.2')
        },
        '/zhiyuan': {
          target: 'https://digitallab.189.cn:31417',
          // target: 'https://testai.maxrocky.com:7089/8021/',
          changeOrigin: true,
          secure: false
        }
      }
    },
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './'),
        '@': path.resolve(__dirname, './src')
      }
    },
    css: {
      postcss: {
        plugins: [
          useRem
            ? postcsspxtorem({
                rootValue: 32, // 基准值，即 1rem = 32px
                propList: ['*'], // 需要转换的属性列表，['*'] 表示所有属性都转
                unitPrecision: 5, // 小数精度
                selectorBlackList: [], // 过滤不需要转换的选择器，例如 ['no-rem']
                replace: true, // 替换包含 px 的规则
                mediaQuery: false, // 是否在媒体查询中转换 px
                minPixelValue: 0 // 最小转换数值，低于这个值的 px 不会被转换
                // exclude: /node_modules/i
              })
            : null
        ].filter(Boolean)
      },
      preprocessorOptions: {
        scss: {
          // api: 'modern-compiler',
          silenceDeprecations: ['legacy-js-api', 'if-function', 'import', 'global-builtin'],
          additionalData: '@use "~/src/assets/styles/mixin.scss" as *;'
        }
      }
    },
    build: {
      sourcemap: false,
      rollupOptions: {
        external: useCDN ? externals : undefined,
        output: {
          manualChunks(id) {
            if (id.includes('element-plus/theme')) {
              return 'ele'
            }
          }
        }
      }
      // target: isCompatibleMode ? 'es2015' : undefined
    }
  }
})
