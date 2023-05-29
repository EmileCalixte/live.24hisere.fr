module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "tsconfig.json",
        tsconfigRootDir: __dirname,
        sourceType: "module",
    },
    plugins: ["@typescript-eslint/eslint-plugin"],
    extends: [
        "plugin:@typescript-eslint/recommended",
    ],
    root: true,
    env: {
        node: true,
        jest: true,
    },
    ignorePatterns: [],
    rules: {
        "@typescript-eslint/indent": ["error", 4, {
            SwitchCase: 1,
            ignoredNodes: [
                "FunctionExpression > .params[decorators.length > 0]",
                "FunctionExpression > .params > :matches(Decorator, :not(:first-child))",
                "ClassBody.body > PropertyDefinition[decorators.length > 0] > .key",
            ],
        }],

        "@typescript-eslint/quotes": ["error", "double"],

        "@typescript-eslint/semi": ["error", "always"],

        "no-extra-semi": "error",

        "@typescript-eslint/comma-dangle": ["error", {
            "arrays": "always-multiline",
            "objects": "always-multiline",
            "imports": "always-multiline",
            "exports": "always-multiline",
            "functions": "always-multiline",
        }],

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

        eqeqeq: ["error", "always"],

        "brace-style": ["error", "1tbs", {allowSingleLine: true}],

        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
    },
};
