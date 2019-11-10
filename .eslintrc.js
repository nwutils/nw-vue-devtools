module.exports = {
    'parserOptions': {
        'parser': 'babel-eslint',
        'ecmaVersion': 8,
        'sourceType': 'module'
    },
    'env': {
        'browser': true,
        'node': true
    },
    'globals': {
        'Promise': true
    },
    'extends': 'eslint:recommended',
    'rules': {
        'brace-style':                 ['error', '1tbs', { 'allowSingleLine': true }],
        'comma-dangle':                ['error', 'never'],
        'comma-spacing':               ['error', { 'before': false, 'after': true }],
        'comma-style':                 ['error', 'last'],
        'curly':                       ['error'],
        'indent':                      ['error', 2, { 'SwitchCase': 1 }],
        'keyword-spacing':             ['error', { 'before': true, 'after': true }],
        'no-multi-spaces':             ['error'],
        'no-restricted-syntax':        ['error',
                                          {
                                            'selector': 'ArrowFunctionExpression',
                                            'message': 'Do not use Arrow Functions'
                                          },
                                          {
                                            'selector': 'ClassBody',
                                            'message': 'Do not use classes.'
                                          },
                                          {
                                            'selector': 'ClassDeclaration',
                                            'message': 'Do not use classes.'
                                          },
                                          {
                                            'selector': 'TemplateLiteral',
                                            'message': 'Do not use template literals.'
                                          }
                                       ],
        'no-ternary':                  ['error'],
        'no-unused-vars':              ['error', { 'args': 'all' }],
        'object-shorthand':            ['error', 'never'],
        'one-var':                     ['error', 'never'],
        'quotes':                      ['error', 'single'],
        'semi':                        ['error', 'always'],
        'space-before-blocks':         ['error', 'always'],
        'space-before-function-paren': ['error', 'always'],
        'space-in-parens':             ['error', 'never'],
        'space-infix-ops':             ['error'],
        'spaced-comment':              ['error', 'always']
    }
};

