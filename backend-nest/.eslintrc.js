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
    ],
    root: true,
    env: {
        node: true,
        jest: true,
    },
    ignorePatterns: [],
    rules: {
        "comma-dangle": "off",
        "@typescript-eslint/comma-dangle": ["error", {
            arrays: "always-multiline",
            objects: "always-multiline",
            imports: "always-multiline",
            exports: "always-multiline",
            functions: "always-multiline",
        }],

        indent: "off",
        "@typescript-eslint/indent": ["error", 4, {
            SwitchCase: 1,
            ignoredNodes: [
                "FunctionExpression > .params[decorators.length > 0]",
                "FunctionExpression > .params > :matches(Decorator, :not(:first-child))",
                "ClassBody.body > PropertyDefinition[decorators.length > 0] > .key",
            ],
        }],

        quotes: "off",
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

        "@typescript-eslint/no-empty-function": ["error"],

        "@typescript-eslint/space-before-function-paren": ["error", {
            anonymous: "always",
            named: "never",
            asyncArrow: "always",
        }],

        eqeqeq: ["error", "always"],

        "brace-style": ["error", "1tbs", { allowSingleLine: true }],

        "@typescript-eslint/strict-boolean-expressions": "off",
    },
};
