// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

    const {lexer} = require("./lexer.cjs");
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "prompt$ebnf$1$subexpression$1", "symbols": ["group_more"], "postprocess": id},
    {"name": "prompt$ebnf$1$subexpression$1", "symbols": ["group_less"], "postprocess": id},
    {"name": "prompt$ebnf$1$subexpression$1", "symbols": ["modifier"], "postprocess": id},
    {"name": "prompt$ebnf$1$subexpression$1", "symbols": [(lexer.has("TEXT") ? {type: "TEXT"} : TEXT)], "postprocess": ([{value}]) => value},
    {"name": "prompt$ebnf$1$subexpression$1", "symbols": [(lexer.has("STRAY") ? {type: "STRAY"} : STRAY)], "postprocess": ([{value}]) => value},
    {"name": "prompt$ebnf$1$subexpression$1", "symbols": [(lexer.has("MINUS") ? {type: "MINUS"} : MINUS)], "postprocess": ([{value}]) => ({type: 'minus', value})},
    {"name": "prompt$ebnf$1$subexpression$1", "symbols": [(lexer.has("COMMA") ? {type: "COMMA"} : COMMA)], "postprocess": ([{value}]) => ({type: 'comma'})},
    {"name": "prompt$ebnf$1", "symbols": ["prompt$ebnf$1$subexpression$1"]},
    {"name": "prompt$ebnf$1$subexpression$2", "symbols": ["group_more"], "postprocess": id},
    {"name": "prompt$ebnf$1$subexpression$2", "symbols": ["group_less"], "postprocess": id},
    {"name": "prompt$ebnf$1$subexpression$2", "symbols": ["modifier"], "postprocess": id},
    {"name": "prompt$ebnf$1$subexpression$2", "symbols": [(lexer.has("TEXT") ? {type: "TEXT"} : TEXT)], "postprocess": ([{value}]) => value},
    {"name": "prompt$ebnf$1$subexpression$2", "symbols": [(lexer.has("STRAY") ? {type: "STRAY"} : STRAY)], "postprocess": ([{value}]) => value},
    {"name": "prompt$ebnf$1$subexpression$2", "symbols": [(lexer.has("MINUS") ? {type: "MINUS"} : MINUS)], "postprocess": ([{value}]) => ({type: 'minus', value})},
    {"name": "prompt$ebnf$1$subexpression$2", "symbols": [(lexer.has("COMMA") ? {type: "COMMA"} : COMMA)], "postprocess": ([{value}]) => ({type: 'comma'})},
    {"name": "prompt$ebnf$1", "symbols": ["prompt$ebnf$1", "prompt$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "prompt", "symbols": ["prompt$ebnf$1"], "postprocess": 
        ([seq]) => {
            return [...(function*(){
                let curr_str = "";
                let curr_str_minus = false;
                let curr_minus = false;
                for(const content of seq) {
                    if(typeof content === 'string') {
                        if(curr_minus) {
                            curr_minus = false;
                            curr_str_minus = true;
                        }
        
                        curr_str += content;
                        continue;
                    }
        
                    curr_str = curr_str.trim();
                    if(curr_str) {
                        if(curr_str_minus) {
                            yield {type: 'negate', body: curr_str};
                        } else {
                            yield curr_str;
                        }
        
                        curr_str = '';
                    }
        
                    curr_str_minus = false;
        
                    switch(content.type) {
                    case 'minus':
                        if(curr_minus) {
                            curr_minus = false;
                            curr_str_minus = true;
        
                            curr_str += content.value;
                        } else if(curr_str) {
                            curr_str += content.value;
                        } else {
                            curr_minus = true;
                        }
                        break;
                    default:
                        if(curr_minus) {
                            yield {type: 'negate', body: content};
                        } else {
                            yield content;
                        }
                        curr_minus = false;
                    }
                }
        
                curr_str = curr_str.trim();
                if(curr_str) {
                    if(curr_str_minus) {
                        yield {type: 'negate', body: curr_str};
                    } else {
                        yield curr_str;
                    }
                }
            })()];
        }
        },
    {"name": "group_more", "symbols": [(lexer.has("PAREN_L") ? {type: "PAREN_L"} : PAREN_L), "prompt", (lexer.has("PAREN_R") ? {type: "PAREN_R"} : PAREN_R)], "postprocess": ([_1, prompt, _2]) => ({type: 'group_more', body: prompt})},
    {"name": "group_more", "symbols": [(lexer.has("PAREN_L") ? {type: "PAREN_L"} : PAREN_L), "prompt", (lexer.has("COLON") ? {type: "COLON"} : COLON), (lexer.has("TEXT") ? {type: "TEXT"} : TEXT), (lexer.has("PAREN_R") ? {type: "PAREN_R"} : PAREN_R)], "postprocess": ([_1, prompt, _2, weight, _3]) => ({type: 'group_more', body: prompt, weight: parseFloat(weight)})},
    {"name": "group_less", "symbols": [(lexer.has("BRACKET_L") ? {type: "BRACKET_L"} : BRACKET_L), "prompt", (lexer.has("BRACKET_R") ? {type: "BRACKET_R"} : BRACKET_R)], "postprocess": ([_1, prompt, _2]) => ({type: 'group_less', body: prompt})},
    {"name": "modifier$ebnf$1", "symbols": []},
    {"name": "modifier$ebnf$1$subexpression$1", "symbols": [(lexer.has("COLON") ? {type: "COLON"} : COLON), (lexer.has("TEXT") ? {type: "TEXT"} : TEXT)], "postprocess": ([_, {value}]) => value},
    {"name": "modifier$ebnf$1", "symbols": ["modifier$ebnf$1", "modifier$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "modifier", "symbols": [(lexer.has("ANGLE_L") ? {type: "ANGLE_L"} : ANGLE_L), (lexer.has("TEXT") ? {type: "TEXT"} : TEXT), "modifier$ebnf$1", (lexer.has("ANGLE_R") ? {type: "ANGLE_R"} : ANGLE_R)], "postprocess": ([_, {value: arg0}, args]) => ({type: 'modifier', args: [arg0, ...args]})}
]
  , ParserStart: "prompt"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
