module.exports = {
  // env: {
  //   browser: true,
  //   jest: true,
  // },
  // parserOptions: { ecmaVersion: 8 },
  // // extends: ['airbnb', 'react-app'],
  extends: ['airbnb-typescript-prettier'], // if you're using typescript,
  "parserOptions": {
    "project": "./tsconfig.json",
    // "ecmaVersion": 12,
    // "sourceType": "module"
  },
  "rules": {
    // I prefer to use named export
    // See: https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-named-as-default.md#importno-named-as-default
    "import/prefer-default-export": 0,
    "import/no-named-as-default": 0,
    
    // See: https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-non-null-assertion.md
    "@typescript-eslint/no-non-null-assertion": 0,

    // See: https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/explicit-function-return-type.md
    "@typescript-eslint/explicit-function-return-type": 0,

    // First import is the React package, just to follow the standard convention.
    // See: https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/order.md
    "import/order": [
      "error",
      {
        "groups": ["builtin", "external", "internal"],
        "pathGroups": [
          {
            "pattern": "react",
            "group": "external",
            "position": "before"
          }
        ],
        "pathGroupsExcludedImportTypes": ["react"],
        "newlines-between": "always",
        "alphabetize": {
          "order": "asc",
          "caseInsensitive": true
        }
      }
    ],
  },
  // plugins: ['prettier'],
};