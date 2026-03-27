import tseslint from 'typescript-eslint';

export default tseslint.config(
  // Archivos y carpetas a ignorar
  {
    ignores: ['node_modules/**', '.next/**', 'out/**', 'coverage/**'],
  },

  // Reglas recomendadas de TypeScript
  ...tseslint.configs.recommended,

  // Ajustes personalizados
  {
    rules: {
      // Permite usar `any` con advertencia en vez de error (útil durante desarrollo)
      '@typescript-eslint/no-explicit-any': 'warn',
      // Permite variables sin usar con prefijo _
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
);
