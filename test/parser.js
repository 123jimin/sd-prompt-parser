// @ts-check

import { assert } from 'chai';
import { parse } from "../src/parser/index.js";

describe("Parser", function() {
    it("should be able to parse a simple list of tags", function() {
        const parsed = parse("tag1, tag2, tag3, tag4\\");
        assert.isArray(parsed);
        assert.strictEqual(parsed.length, 7);
        assert.deepStrictEqual(parsed, [
            'tag1',
            {type: 'comma'},
            'tag2',
            {type: 'comma'},
            'tag3',
            {type: 'comma'},
            "tag4\\"
        ]);
    });

    it("should be able to parse a simple list of tags and negative tags", function() {
        const parsed = parse("tag1, tag2, -tag3, -tag4, tag5");
        assert.isArray(parsed);
        assert.strictEqual(parsed.length, 9);
    });

    it("should be able to parse a parenthesized prompt", function() {
        const parsed_1 = parse("(tag1, -tag2), -(tag3, -tag4)");
        assert.isArray(parsed_1);
        assert.strictEqual(parsed_1.length, 3);

        const parsed_2 = parse("-tag1, -(tag2, -tag3)");
        assert.isArray(parsed_2);
        assert.strictEqual(parsed_2.length, 3);

        assert.deepStrictEqual(parsed_2[0], {type: 'negate', body: 'tag1'});
        assert.deepStrictEqual(parsed_2[1], {type: 'comma'});
        // @ts-ignore
        assert.deepStrictEqual(parsed_2[2], {type: 'negate', body: {type: 'group_more', body: ['tag2', {type: 'comma'}, {type: 'negate', body: 'tag3'}]}});
    });

    it("should be able to parse a prompt with LoRAs", function() {
        const parsed = parse("<lora:name1:weight1> -<lora:name2:weight2>");
        assert.deepStrictEqual(parsed, [
            {type: 'modifier', args: ['lora', 'name1', 'weight1']},
            {type: 'negate', body: {type: 'modifier', args: ['lora', 'name2', 'weight2']}},
        ]);
    });
});