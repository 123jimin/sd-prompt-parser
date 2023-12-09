@{%
    const {lexer} = require("./lexer.cjs");
%}

@lexer lexer

prompt -> (
    group_more {% id %} |
    group_less {% id %} |
    modifier {% id %} |
    %TEXT {% ([{value}]) => value %} |
    %STRAY {% ([{value}]) => value %} |
    %MINUS {% ([{value}]) => ({type: 'minus', value}) %} |
    %COMMA {% ([{value}]) => ({type: 'comma'}) %}
):+ {%
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
%}

group_more -> %PAREN_L prompt %PAREN_R {% ([_1, prompt, _2]) => ({type: 'group_more', body: prompt}) %}
    | %PAREN_L prompt %COLON %TEXT %PAREN_R {% ([_1, prompt, _2, weight, _3]) => ({type: 'group_more', body: prompt, weight: parseFloat(weight)}) %}

group_less -> %BRACKET_L prompt %BRACKET_R {% ([_1, prompt, _2]) => ({type: 'group_less', body: prompt}) %}

modifier -> %ANGLE_L %TEXT ( %COLON %TEXT {% ([_, {value}]) => value %} ):* %ANGLE_R {% ([_, {value: arg0}, args]) => ({type: 'modifier', args: [arg0, ...args]}) %}