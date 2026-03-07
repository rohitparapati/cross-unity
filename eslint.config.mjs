import next from '@next/eslint-plugin-next';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  {
    plugins: {
      '@next/next': next,
    },
    rules: {
      ...next.configs.recommended.rules,
      ...next.configs['core-web-vitals'].rules,
    },
  },
  eslintConfigPrettier,
];