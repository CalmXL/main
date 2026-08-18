module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser', // 解析器
    ecmaVersion: 2020, // ECMAScript 版本
    sourceType: 'module', // 模块
    jsxPragma: 'React', // 支持 ReactJSX 语法
    ecmaFeatures: {
      jsx: true // 启用 JSX
    }
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    '@vue/airbnb',
    './types/.eslintrc-auto-import.json'
  ],
  rules: {
    semi: ['error', 'never'],
    camelcase: 'off',
    'no-plusplus': 'off',
    'no-continue': 'off',
    'global-require': 'off',
    'linebreak-style': 'off',
    'vue/comma-dangle': 'off',
    'no-param-reassign': 'off',
    'consistent-return': 'off',
    'import/extensions': 'off',
    'no-restricted-syntax': 'off',
    'import/no-unresolved': 'off',
    'object-curly-newline': 'off',
    'no-use-before-define': 'off',
    'no-unused-expressions': 'off',
    'class-methods-use-this': 'off',
    'vue/require-default-prop': 'off',
    'no-async-promise-executor': 'off',
    'vuejs-accessibility/alt-text': 'off',
    'vue/no-template-target-blank': 'off',
    'import/prefer-default-export': 'off',
    'vue/no-multiple-template-root': 'off',
    'vue/multi-word-component-names': 'off',
    'import/no-extraneous-dependencies': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vuejs-accessibility/click-events-have-key-events': 'off',
    'comma-dangle': ['error', 'never'],
    'arrow-parens': ['error', 'as-needed'],
    'max-len': ['error', { code: 180 }],
    'vue/max-len': ['error', { code: 180 }],
    'no-console':
      process.env.NODE_ENV === 'production'
        ? ['error', { allow: ['warn', 'error'] }]
        : ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  },
  globals: {}
}
