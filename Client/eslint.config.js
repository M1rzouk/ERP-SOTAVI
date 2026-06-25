import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  
  // --- React / Browser files (your existing config) ---
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },

  // --- Electron / Node.js files (NEW) ---
  {
    files: ['electron/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,      // adds process, __dirname, require, etc.
        ...globals.es2021,    // optional, adds modern JS globals
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      // You can add Node-specific rules here if needed
    },
  },
])