import love from "eslint-config-love";
import eslintConfigPrettier from "eslint-config-prettier";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";

const ext = "{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}";

export default [
  {
    ignores: ["**/dist", "**/lib", "eslint.config.js"],
  },
  {
    files: [`**/*.${ext}`],
    ...love,
  },
  {
    files: [`apps/backend/**/*.${ext}`],
    rules: {
      // Type import of NestJS module dependencies break dependency injection
      "@typescript-eslint/consistent-type-imports": ["error", { prefer: "no-type-imports" }],
    },
  },
  {
    files: [`apps/backend/src/commands/**/*.${ext}`],
    rules: {
      "no-console": "off",
    },
  },
  {
    files: [`apps/**/test/**/*.${ext}`],
    rules: {
      "max-nested-callbacks": "off",
      "@typescript-eslint/init-declarations": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
    },
  },
  {
    files: [`apps/frontend/**/*.${ext}`],
    plugins: {
      ...reactPlugin.configs.flat.recommended.plugins,
    },
    rules: {
      ...reactPlugin.configs.flat.recommended.rules,
      ...reactPlugin.configs.flat["jsx-runtime"].rules,
    },
    languageOptions: reactPlugin.configs.flat["jsx-runtime"].languageOptions,
  },
  {
    files: [`apps/frontend/**/*.${ext}`],
    plugins: {
      "react-hooks": reactHooksPlugin,
    },
    rules: {
      ...reactHooksPlugin.configs.recommended.rules,
    },
  },
  {
    files: [`apps/frontend/src/hooks/api/requests/**/*.${ext}`],
    rules: {
      "@typescript-eslint/explicit-function-return-type": "off",
    },
  },
  eslintConfigPrettier,
  {
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "react-router-dom",
              importNames: ["Link"],
            },
          ],
        },
      ],

      // Custom overrides
      complexity: "off",
      "@eslint-community/eslint-comments/require-description": "off",
      "guard-for-in": "off", // TODO enable ?
      "max-lines": "off",
      "no-alert": "off",
      "no-await-in-loop": "off",
      "no-negated-condition": "off",
      "no-octal-escape": "off", // Only octal escape works with tailwind
      "prefer-named-capture-group": "off",
      "promise/avoid-new": "off",
      radix: "off",
      "react/no-unescaped-entities": "off",
      "require-unicode-regexp": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/class-methods-use-this": "off",
      "@typescript-eslint/max-params": "off",
      "@typescript-eslint/naming-convention": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-magic-numbers": "off",
      "@typescript-eslint/no-unsafe-enum-comparison": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-type-assertion": "off",
      "@typescript-eslint/prefer-destructuring": "off",
      "@typescript-eslint/prefer-optional-chain": "off",
      "@typescript-eslint/strict-boolean-expressions": "off",
    },
  },
];
