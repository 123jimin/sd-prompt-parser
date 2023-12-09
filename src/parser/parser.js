// @ts-check

import nearley from 'nearley';
import grammar from "./grammar.cjs";

/**
 * @typedef {Object} GroupMore
 * @property {'group_more'} type
 * @property {Prompt} body
 * @property {number} [weight]
 */

/**
 * @typedef {Object} GroupLess
 * @property {'group_less'} type
 * @property {Prompt} body
 */

/**
 * @typedef {Object} Modifier
 * @property {'modifier'} type
 * @property {string[]} args
 */

/**
 * @typedef {Object} Negate
 * @property {'negate'} type
 * @property {PromptElem} body
 */

/**
 * @typedef {Object} Comma
 * @property {'comma'} type
 */

/**
 * @typedef {GroupMore|GroupLess|Modifier|Negate|Comma|string} PromptElem
 */

/**
 * @typedef {PromptElem[]} Prompt
 */

/**
 * Parses a given prompt into an AST.
 * 
 * @param {string} s The prompt to be parsed.
 * @returns {Prompt}
 */
export const parse = (s) => {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    parser.feed(s);

    return parser.results[0];
};