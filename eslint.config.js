const eslintPluginTypescript = require('@typescript-eslint/eslint-plugin')
const eslintPluginPrettier = require('eslint-plugin-prettier')
const typescriptParser = require('@typescript-eslint/parser')

module.exports = [
    {
        ignores: ['eslint.config.js', '.prettierrc.js', 'dist', 'build', 'node_modules'],
    },
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                project: ['tsconfig.json'],
                ecmaVersion: 2018,
                sourceType: 'module',
            },
        },
        plugins: {
            '@typescript-eslint': eslintPluginTypescript,
            prettier: eslintPluginPrettier,
        },
        rules: {
            ...eslintPluginTypescript.configs.recommended.rules,
            ...eslintPluginPrettier.configs.recommended.rules,
            'no-console': 'error',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/no-unused-vars': 'error',
            'no-constant-condition': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-empty-interface': 'off',
            '@typescript-eslint/no-empty-object-type' : 'off'
        },
        settings: {
            node: true,
            commonjs: true,
            es6: true,
        },
    },
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: typescriptParser,
            ecmaVersion: 2018,
            sourceType: 'module',
        },
        plugins: {
            '@typescript-eslint': eslintPluginTypescript,
            prettier: eslintPluginPrettier,
        },
        rules: {
            ...eslintPluginTypescript.configs.recommended.rules,
            ...eslintPluginPrettier.configs.recommended.rules,
            'no-console': 'error',
            "@typescript-eslint/no-unused-vars": "error",
            'no-constant-condition': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
        },
        settings: {
            node: true,
            commonjs: true,
            es6: true,
        },
    },
]
