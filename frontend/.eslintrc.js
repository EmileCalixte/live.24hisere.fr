module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        "plugin:react/recommended",
        "standard-with-typescript",
    ],
    overrides: [
    ],
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
        "**/lib/**",
    ],
    rules: {
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
        "@typescript-eslint/quotes": ["error", "double"],

        semi: ["error", "always"],
        "@typescript-eslint/semi": ["error", "always"],

        "comma-dangle": ["error", "always-multiline"],
        "@typescript-eslint/comma-dangle": ["error", "always-multiline"],

        "object-curly-spacing": ["error", "never"],
        "@typescript-eslint/object-curly-spacing": ["error", "never"],

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

        "@typescript-eslint/explicit-function-return-type": "off",
    },
};
