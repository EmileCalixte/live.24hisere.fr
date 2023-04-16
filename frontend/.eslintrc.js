module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        "plugin:react/recommended",
        "standard-with-typescript",
        "plugin:react-hooks/recommended",
    ],
    overrides: [
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: [
            "./tsconfig.json",
        ],
        ecmaVersion: "latest",
        sourceType: "module",
    },
    plugins: [
        "react",
    ],
    ignorePatterns: [
        "src/config/config.ts",
        "**/lib/**",
    ],
    rules: {
        "react/react-in-jsx-scope": "off",
        "react/no-unescaped-entities": "off",
        "react/prop-types": "off",

        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",

        indent: "off",
        "@typescript-eslint/indent": ["error", 4, {
            SwitchCase: 1,
            ignoredNodes: [
                "JSXAttribute",
            ],
        }],
        "react/jsx-indent": ["error", 4, {
            checkAttributes: false,
            indentLogicalExpressions: true,
        }],
        "react/jsx-indent-props": ["error", "first"],

        quotes: ["error", "double"],
        "jsx-quotes": ["error", "prefer-double"],
        "@typescript-eslint/quotes": ["error", "double"],

        semi: ["error", "always"],
        "@typescript-eslint/semi": ["error", "always"],

        "no-extra-semi": "error",

        "comma-dangle": ["error", "always-multiline"],
        "@typescript-eslint/comma-dangle": ["error", "always-multiline"],

        "object-curly-spacing": ["error", "never"],
        "@typescript-eslint/object-curly-spacing": ["error", "never"],

        "@typescript-eslint/naming-convention": [
            "error",
            {
                selector: "variable",
                format: ["camelCase", "UPPER_CASE", "PascalCase"],
            },
            {
                selector: "parameter",
                format: ["camelCase", "PascalCase"],
                leadingUnderscore: "allow",
            },
            {
                selector: "memberLike",
                modifiers: ["private"],
                format: ["camelCase", "PascalCase"],
            },
            {
                selector: "typeLike",
                format: ["PascalCase"],
            },
        ],

        "@typescript-eslint/member-delimiter-style": ["error", {
            multiline: {
                delimiter: "semi",
                requireLast: true,
            },
            singleline: {
                delimiter: "semi",
                requireLast: false,
            },
            multilineDetection: "brackets",
        }],

        "@typescript-eslint/no-empty-function": ["error", {allow: ["arrowFunctions"]}],

        "@typescript-eslint/space-before-function-paren": ["error", {
            anonymous: "always",
            named: "never",
            asyncArrow: "always",
        }],

        "multiline-ternary": "off",

        "@typescript-eslint/array-type": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-confusing-void-expression": "off",
        "@typescript-eslint/no-dynamic-delete": "off",
        "@typescript-eslint/no-floating-promises": "off",
        "@typescript-eslint/no-misused-promises": "off",
        "@typescript-eslint/restrict-template-expressions": "off",
        "@typescript-eslint/strict-boolean-expressions": "off",

        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/prefer-ts-expect-error": "off",

        eqeqeq: ["error", "always"],

        "prefer-arrow-callback": "error",
        "brace-style": ["error", "1tbs", {allowSingleLine: true}],
    },
};
