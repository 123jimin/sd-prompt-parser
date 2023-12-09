// @ts-check

import { assert } from 'chai';
import { parse, stringify } from "../src/index.js";

/**
 * @param {string} prompt
 * @returns {string}
 */
function roundtrip(prompt) {
    return stringify(parse(prompt));
}

/**
 * @param {string} prompt 
 * @param {string} expected 
 */
function assertRoundtrip(prompt, expected) {
    assert.strictEqual(roundtrip(prompt), expected);
}

/**
 * @param {string} prompt 
 */
function assertIdempotent(prompt) {
    const once = roundtrip(prompt);
    const twice = roundtrip(prompt);
    assert.strictEqual(twice, once, `Roundtrip on "${prompt}"`);
}

describe("stringify", function() {
    it("should able to handle simple cases", function() {
        assertRoundtrip("tag1, tag2, tag3", "tag1, tag2, tag3");
        assertRoundtrip("(tag1), [tag2], (tag3:1.5)", "(tag1), [tag2], (tag3:1.5)");
        assertRoundtrip("-tag1, -(tag2, -tag3)", "-tag1, -(tag2, -tag3)");
    });

    it("should able to remove whitespaces", function() {
        assertRoundtrip(" tag1  , tag2    , tag3  ", "tag1, tag2, tag3");
        assertRoundtrip(" (  tag1 ) , [ tag2 ] , ( tag3 : 1.5 )", "(tag1), [tag2], (tag3:1.5)");
        assertRoundtrip(" - tag1 ,  -  ( tag2 , - tag3 ) ", "-tag1, -(tag2, -tag3)");
    });
});