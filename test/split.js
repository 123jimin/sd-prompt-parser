// @ts-check

import { assert } from 'chai';
import { parse, split, stringify } from "../src/index.js";


describe("split", function() {
    it("should able to split simple cases", function() {
        const [pos, neg] = split(parse("tag1, -tag2, tag3")).map((parsed) => stringify(parsed));
        assert.strictEqual(pos, "tag1, tag3");
        assert.strictEqual(neg, "tag2");
    });
});