module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    '@nuxtjs/eslint-config-typescript',
    'plugin:prettier/recommended', // Integrate Prettier into ESLint
    'prettier', // Disable unnecessary ESLint rules in the presence of Prettier
  ],
  rules: {
    'no-console': 'off',
    'vue/no-v-html': 'off',
    'vue/multi-word-component-names': 'off',
  },
}
