import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      '.astro/**',
      '.vercel/**',
      'node_modules/**',
      'playwright-report/**',
      'test-results/**',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  // ADR-0006: eslint-plugin-astro cubre el archivo .astro COMPLETO, incluido el
  // template — que es donde Biome se queda corto y el motivo de esta elección.
  ...astro.configs.recommended,
  ...astro.configs['jsx-a11y-recommended'],

  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: { ...globals.browser },
    },
    plugins: { 'jsx-a11y': jsxA11y },
    rules: {
      ...jsxA11y.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // 07-conventions.md: un `any` explícito requiere justificación por
      // comentario, así que se avisa pero no se bloquea.
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  {
    // Archivos de configuración: se ejecutan en Node, no en el navegador.
    files: ['*.config.{js,mjs,ts}', 'vitest.config.ts', 'playwright.config.ts'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },

  {
    files: ['tests/**/*.ts'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
);
