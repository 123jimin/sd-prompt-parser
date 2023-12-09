import nearley from 'nearley';
import grammar from "./grammar.cjs";

export const parse = (s) => {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    parser.feed(s);

    return parser.results[0];
};