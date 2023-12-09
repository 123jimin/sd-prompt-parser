// @ts-check

const moo = require('moo');

const lexer = moo.compile({
    NL: { match: /\r?\n/, lineBreaks: true },
    COMMA: /,\s*/,
    PAREN_L: /\(\s*/,
    PAREN_R: /\)\s*/,
    ANGLE_L: /<\s*/,
    ANGLE_R: />\s*/,
    BRACKET_L: /\[\s*/,
    BRACKET_R: /\]\s*/,
    PIPE: /\|\s*/,
    COLON: /:\s*/,
    MINUS: /-\s*/,
    TEXT: { match: /(?![\-\s])(?:[^\n,\\<>()\[\]:|]|\\.)+/, value: (s) => s.replace(/\\(.)/g, "$1")},
    STRAY: /./,
});

/** @type {(s: string) => Array<import('moo').Token> } */
const tokenize = (s) => {
    /** @type {Array<import('moo').Token>} */
    const tokens = [];

    lexer.reset(s.trim());

    /** @type {import('moo').Token | undefined} */
    let next;

    while((next = lexer.next())) {
        tokens.push(next);
    }

    return tokens;
};

module.exports = { lexer, tokenize };