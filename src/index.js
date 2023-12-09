// @ts-check

import { parse } from "./parser/index.js";
export { parse } from "./parser/index.js";


/** @type {(parsed: import("./parser/index.js").PromptElem|import("./parser/index.js").Prompt) => string} */
export function stringify(parsed) {
    if(typeof parsed === 'string') return parsed;
    if(Array.isArray(parsed)) return parsed.map(stringify).join('');

    switch(parsed.type) {
        case 'comma': return ", ";
        case 'negate': return '-' + stringify(parsed.body);
        case 'group_more':
            if(parsed.weight != null) return `(${stringify(parsed.body)}:${parsed.weight})`;
            else return `(${stringify(parsed.body)})`;
        case 'group_less':
            return `[${stringify(parsed.body)}]`;
        case 'modifier':
            return `<${parsed.args.join(':')}>`;
    }
}