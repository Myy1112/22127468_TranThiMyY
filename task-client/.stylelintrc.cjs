/**
 * Stylelint config to ignore Tailwind CSS at-rules so stylelint (or
 * extensions that use it) won't flag `@tailwind`, `@apply`, etc. as unknown.
 * If you don't have stylelint installed, this file is harmless; to enable
 * stylelint install: npm i -D stylelint
 */
module.exports = {
  // Use the standard config and then override the at-rule rule for Tailwind
  extends: ['stylelint-config-standard'],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind', 'apply', 'variants', 'responsive', 'screen'],
      },
    ],
  },
  ignoreFiles: ['**/node_modules/**', 'dist/**'],
};
