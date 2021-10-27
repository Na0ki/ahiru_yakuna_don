module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": "tsconfig.json",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint",
    ],
    "rules": {
        "@typescript-eslint/await-thenable": "error",
        "@typescript-eslint/no-inferrable-types": [
            "error",
            {
                "ignoreParameters": true
            }
        ],
        "@typescript-eslint/prefer-namespace-keyword": "error",
        "@typescript-eslint/type-annotation-spacing": "error",
        "brace-style": [
            "error",
            "1tbs"
        ],
        "curly": "error",
        "eol-last": "error",
        "eqeqeq": [
            "error",
            "always"
        ],
        "no-fallthrough": "error",
        "no-shadow": [
            "error",
            {
                "hoist": "all"
            }
        ],
        "no-trailing-spaces": [
            "error",
            {
                "ignoreComments": true
            }
        ],
        "no-unused-expressions": [
            "error",
            {
                "allowShortCircuit": true
            }
        ],
        "no-var": "error",
        "prefer-const": "error",
        "quotes": [
            "error",
            "single",
            {
                "avoidEscape": true
            }
        ],
        "semi": "error",
        "spaced-comment": [
            "error",
            "always",
            {
                "markers": [
                    "/"
                ]
            }
        ],
        "indent": [
            "error",
            2,
            {"SwitchCase": 1}
        ]
    }
};
