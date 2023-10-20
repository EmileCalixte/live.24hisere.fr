module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "tsconfig.json",
        ecmaVersion: 2022,
        tsconfigRootDir: __dirname,
        sourceType: "module",
    },
    extends: [
        "standard",
        "standard-with-typescript",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
    ],
    env: {
        browser: true,
        es2021: true,
    },
    plugins: [
        "react",
    ],
    ignorePatterns: [
        "src/config/config.ts",
        "dist/**",
        "**/lib/**",
    ],
    rules: {
        "react/react-in-jsx-scope": "off",
        "react/no-unescaped-entities": "off",
        "react/prop-types": "off",

        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",

        "comma-dangle": "off",
        "@typescript-eslint/comma-dangle": ["error", {
            arrays: "always-multiline",
            objects: "always-multiline",
            imports: "always-multiline",
            exports: "always-multiline",
            functions: "always-multiline",
            enums: "always-multiline",
        }],

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

        quotes: "off",
        "jsx-quotes": ["error", "prefer-double"],
        "@typescript-eslint/quotes": ["error", "double"],

        semi: "off",
        "@typescript-eslint/semi": ["error", "always"],

        "no-extra-semi": "error",

        "no-return-await": "error",
        "@typescript-eslint/return-await": "off",

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

        "@typescript-eslint/no-empty-function": ["error", { allow: ["arrowFunctions"] }],

        "react/jsx-curly-brace-presence": ["error", {
            props: "never",
            children: "never",
            propElementValues: "always",
        }],

        "react/jsx-tag-spacing": ["error", {
            closingSlash: "never",
            beforeSelfClosing: "always",
            afterOpening: "never",
            beforeClosing: "never",
        }],

        "@typescript-eslint/space-before-function-paren": ["error", {
            anonymous: "always",
            named: "never",
            asyncArrow: "always",
        }],

        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/prefer-ts-expect-error": "off",

        eqeqeq: ["error", "always"],

        "brace-style": ["error", "1tbs", { allowSingleLine: true }],

        "prefer-arrow-callback": "error",

        "@typescript-eslint/strict-boolean-expressions": "off",
    },
};
