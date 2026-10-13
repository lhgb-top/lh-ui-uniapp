import eslint from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import globals from 'globals'
import eslintPluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/coverage/**',
      '**/dist/**',
      '**/unpackage/**',
      // 构建产物：禁止 lint 自动生成的 CSS / iconfont
      'src/theme/index.css',
      'src/icon/iconfont.css',
      'components/**/style.css',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginVue.configs['flat/recommended'],
  eslintConfigPrettier,
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx,vue}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        // uni-app 注入的全局对象（各端运行时提供，不在任何 import 里）
        uni: 'readonly',
        wx: 'readonly',
        plus: 'readonly',
        getCurrentPages: 'readonly',
        getApp: 'readonly',
      },
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'vue/multi-word-component-names': 'off',
    },
  },
  {
    // 测试文件里定义本地 Consumer 辅助组件是合法模式，不属于「一文件多组件」坏味道
    files: ['tests/**/*.spec.ts'],
    rules: {
      'vue/one-component-per-file': 'off',
    },
  },
)
