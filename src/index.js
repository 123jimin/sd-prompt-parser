// @ts-check

import { parse } from "./parser/index.js";
export { parse } from "./parser/index.js";

/** @typedef {import("./parser/index.js").PromptElem} PromptElem */
/** @typedef {PromptElem|PromptElem[]} ParsedPrompt */
/** @typedef {(modifier_args: string[]) => string[]|string|null|undefined } ModifierHandler */

/**
 * @param {PromptElem} parsed
 * @returns {parsed is import("./parser/index.js").Comma}
 */
function isComma(parsed) {
    return typeof parsed === 'object' && parsed.type === 'comma';
}

/**
 * @param {ParsedPrompt} parsed
 * @returns {boolean} Whether `parsed` is a null prompt.
 */
export function isNull(parsed) {
    if(typeof parsed === 'string') return parsed === '';
    if(Array.isArray(parsed)) return parsed.every(isNull);

    switch(parsed.type) {
        case 'negate':
        case 'group_more':
        case 'group_less':
            return isNull(parsed.body);
        default:
            return false;
    }
}

/**
 * Cleans up stray commas, non-recursively.
 * 
 * @param {PromptElem[]} parsed
 * @returns {PromptElem[]}
 */
function cleanCommas(parsed) {
    if(parsed.length === 0) return parsed;

    /** @type {PromptElem[]} */
    const cleaned = [];
    let is_prev_comma = true;
    for(let i=0; i<parsed.length; ++i) {
        const parsed_child = parsed[i];

        if(isComma(parsed_child)) {
            if(is_prev_comma) continue;
            is_prev_comma = true;
        } else {
            is_prev_comma = false;
        }
        
        cleaned.push(parsed_child);
    }

    while(cleaned.length > 0) {
        const last_cleaned = cleaned[cleaned.length-1];
        if(!isComma(last_cleaned)) break;

        cleaned.pop();
    }

    return cleaned;
}

/** @typedef {{modifierHandler: ModifierHandler}} StringifyArgs */

/**
 * 
 * @param {ParsedPrompt} parsed
 * @param {Partial<StringifyArgs>|undefined} args
 * @returns {string}
 */
export function stringify(parsed, args = void 0) {
    if(typeof parsed === 'string') return parsed.trim().replace(/[,\\<>()\[\]:|-]/g, "\\$&");
    if(Array.isArray(parsed)) return cleanCommas(parsed).map((child) => stringify(child, args)).join('');

    switch(parsed.type) {
        case 'comma': return ", ";
        case 'negate': return '-' + stringify(parsed.body, args);
        case 'group_more':
            if(parsed.weight != null) return `(${stringify(parsed.body, args)}:${parsed.weight})`;
            else return `(${stringify(parsed.body, args)})`;
        case 'group_less':
            return `[${stringify(parsed.body, args)}]`;
        case 'modifier': {
            const modifierHandler = args?.modifierHandler;
            if(modifierHandler) {
                const handled = modifierHandler(parsed.args);
                if(handled == null) return '';
                if(Array.isArray(handled)) return `<${handled.join(':')}>`;
                return handled;
            } else {
                return `<${parsed.args.join(':')}>`;
            }
        }
    }
}

/**
 * Splits the given prompt into a positive prompt and a negative prompt.
 * Each split prompt will not contain a `negate` node.
 * 
 * @param {ParsedPrompt} parsed 
 * @returns {[pos: ParsedPrompt, neg: ParsedPrompt]}
 */
export function split(parsed) {
    if(typeof parsed === 'string') return [parsed, ''];
    if(Array.isArray(parsed)) {
        /** @type {PromptElem[]} */
        const pos = [];
        
        /** @type {PromptElem[]} */
        const neg = [];

        for(const child of parsed) {
            const [child_pos, child_neg] = split(child);
            // @ts-ignore
            if(!isNull(child_pos)) pos.push(child_pos);
            // @ts-ignore
            if(!isNull(child_neg)) neg.push(child_neg);
        }

        return [pos, neg];
    }
    
    switch(parsed.type) {
        case 'comma':
        case 'modifier':
            return [parsed, parsed];
        case 'negate': {
            const [pos, neg] = split(parsed.body);
            return [neg, pos];
        }
        case 'group_more': {
            /** @ts-ignore @type {[PromptElem[], PromptElem[]]} */
            const [pos, neg] = split(parsed.body);
            return [
                isNull(pos) ? '' : {type: 'group_more', body: pos, weight: parsed.weight},
                isNull(neg) ? '' : {type: 'group_more', body: neg, weight: parsed.weight},
            ];
        }
        case 'group_less': {
            /** @ts-ignore @type {[PromptElem[], PromptElem[]]} */
            const [pos, neg] = split(parsed.body);
            return [
                isNull(pos) ? '' : {type: 'group_less', body: pos},
                isNull(neg) ? '' : {type: 'group_less', body: neg},
            ];
        }
    }
}