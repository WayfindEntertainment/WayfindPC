module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    extends: ['airbnb-base', 'plugin:prettier/recommended', 'prettier'],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    plugins: ['prettier'],
    rules: {
        'prettier/prettier': ['error'],
        indent: ['error', 4, { SwitchCase: 1 }],
        'no-underscore-dangle': ['error', { allowAfterThis: true }],
        'linebreak-style': ['error', 'unix'],
        semi: ['error', 'never'],
        'comma-dangle': ['error', 'never'],
        'no-plusplus': ['error', { allowForLoopAfterthoughts: true }]
    }
}
