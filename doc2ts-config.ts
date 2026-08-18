import { TranslateType } from 'doc2ts'
import type { Doc2TsConfig } from 'doc2ts'

const doc2tsConfig: Doc2TsConfig = {
  outDir: './src/services',
  origins: [
    {
      // url: 'http://114.115.135.46:7090/8020/swagger/doc.json'
      url: 'http://localhost:8020/swagger/doc.json'
    },
    {
      name: 'feedback',
      sharedId: 'c614584e-daa2-49cb-8271-38594226b5ee'
    },
    {
      name: 'modelFlow',
      sharedId: '18d8e10a-ab3d-4243-a77d-bd185573b378'
    }
  ],
  resultTypeRender: 'Promise<[any, {typeName}["data"], {typeName}]>',
  // resultTypeRender(funcName, typeInfo) {
  //   let typeValue = ''
  //   if (typeInfo) {
  //     const dataKeyItemType = typeInfo.typeItems.find(i => i.name === 'data')
  //     if (dataKeyItemType) {
  //       const required = dataKeyItemType?.required ?? false
  //       const typeName = dataKeyItemType?.getKeyValue() ?? ''
  //       typeValue = typeName ? `${typeName}${!required && typeName !== 'null' ? ' | undefined' : ''}` : 'unknown'
  //     } else {
  //       typeValue = typeInfo.typeName
  //     }
  //   } else {
  //     typeValue = 'unknown'
  //   }

  //   return `Promise<${typeValue}>`
  // },
  languageType: 'typeScript',
  translateType: TranslateType.none,
  baseClassName: 'ApiClient',
  baseClassPath: './src/services/client.ts'
}

export default doc2tsConfig
