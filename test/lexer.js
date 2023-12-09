// @ts-check

import { assert } from 'chai';
import { tokenize } from "../src/parser/index.js";

describe("Lexer", function() {
    it("should be able to handle a simple list of tags", function() {
        const tokenized = tokenize("tag1, tag2, tag3, tag4");
        assert.strictEqual(tokenized.length, 7);
        assert.deepStrictEqual(tokenized.map(({type}) => type), ['TEXT', 'COMMA', 'TEXT', 'COMMA', 'TEXT', 'COMMA', 'TEXT']);
        assert.deepStrictEqual(tokenized.map(({text}) => text.trim()), "tag1 , tag2 , tag3 , tag4".split(' '));
    });

    it("should be able to handle an empty string", function() {
        assert.strictEqual(tokenize("").length, 0);
    });

    it("should be able to handle escaped commas and brackets", function() {
        const tokenized = tokenize("a\\, b\\, c, d \\: e \\( f \\> g")

        assert.strictEqual(tokenized.length, 3);
        assert.deepStrictEqual(tokenized.map(({type}) => type), ['TEXT', 'COMMA', 'TEXT']);
        assert.deepStrictEqual(tokenized.map(({text}) => text.trim()), "a\\, b\\, c/,/d \\: e \\( f \\> g".split('/'));
    });

    it("should be able to handle special characters", function() {
        const tokenized = tokenize("()<>[]|:-");

        assert.strictEqual(tokenized.length, 9);
        assert.deepStrictEqual(tokenized.map(({type}) => type), ['PAREN_L', 'PAREN_R', 'ANGLE_L', 'ANGLE_R', 'BRACKET_L', 'BRACKET_R', 'PIPE', 'COLON', 'MINUS']);
        assert.deepStrictEqual(tokenized.map(({text}) => text.trim()), "()<>[]|:-".split(''));
    });

    it("should be able to split special characters mid-text", function() {
        const tokenized = tokenize("tag1(tag2)tag3<tag4>tag5[tag6]tag7|tag8:tag9");

        assert.strictEqual(tokenized.length, 17);
        assert.deepStrictEqual(tokenized.filter((_, i) => i%2 == 1).map(({type}) => type), ['PAREN_L', 'PAREN_R', 'ANGLE_L', 'ANGLE_R', 'BRACKET_L', 'BRACKET_R', 'PIPE', 'COLON']);
    });

    it("should be able to handle malformed inputs", function() {
        const tokenized = tokenize("\\");

        assert.strictEqual(tokenized.length, 1);
    });

    it("should be able to handle dashes", function() {
        const tokenized = tokenize("tag1, -tag2, dashed-tag");
        
        assert.strictEqual(tokenized.length, 6);
        assert.deepStrictEqual(tokenized.map(({type}) => type), ['TEXT', 'COMMA', 'MINUS', 'TEXT', 'COMMA', 'TEXT']);
        assert.deepStrictEqual(tokenized.map(({text}) => text.trim()), "tag1 , - tag2 , dashed-tag".split(' '));
    });

    it("should be able to handle dashes with spaces", function() {
        const tokenized = tokenize(" - tag1 ,  -  ( tag2 , - tag3 ) ");
        assert.strictEqual(tokenized.length, 10);
        assert.deepStrictEqual(tokenized.map(({type}) => type), ['MINUS', 'TEXT', 'COMMA', 'MINUS', 'PAREN_L', 'TEXT', 'COMMA', 'MINUS', 'TEXT', 'PAREN_R']);
        assert.deepStrictEqual(tokenized.map(({text}) => text.trim()), "- tag1 , - ( tag2 , - tag3 )".split(' '));
    })
});