# sd-prompt-parser

![npm](https://img.shields.io/npm/v/@jiminp/sd-prompt-parser?style=flat-square)
![GitHub Workflow Status (with branch)](https://img.shields.io/github/actions/workflow/status/123jimin/sd-prompt-parser/build.yaml?branch=main&style=flat-square)

`sd-prompt-parser` is a simple JS library for parsing Stable Diffusion prompts with custom syntax.

The syntax is designed to be used on frontends with one text input.

## API

```js
import { parse, split, stringify } from 'sd-prompt-parser';

const prompt = "tag1, -tag2, -(tag3, -tag4) <lora:lora1> <custom:modifiers>";

// AST of the prompt above
// IMPORTANT: `parse` may throw.
const parsed_prompt = parse(prompt);

// AST of positive and negative prompts
const [parsed_pos, parsed_neg] = split(parsed_prompt);

// "tag1, (tag4)<lora:lora1><custom:modifiers>"
console.log(stringify(parsed_pos));

// "tag2, (tag3)<lora:lora1><custom:modifiers>"
console.log(stringify(parsed_neg));

// "tag1, (tag4)<lora:lora1>(custom modifier: custom, modifiers)"
console.log(stringify(parsed_pos, {
    modifierHandler(args) {
        // Supported return types:
        // - `string[]`: the arguments of the modifier is substituted.
        // - `string`: the modifier is substituted to the string.
        // - `null` and `undefined`: removed.
        if(args[0] === 'lora') return args;
        return `(custom modifier: ${args.join(', ')})`;
    }
}));
```

## Syntax

### Simple tags

```text
tag1, tag2, -tag3, -tag4, tag5
```

This translates to:

- Positive: `tag1, tag2, tag5`
- Negative: `tag3, tag4`

### Attentions

```text
(tag1, -tag2), -(tag3, -tag4), (tag5, -tag6, (tag7): 2)
```

This translates to:

- Positive: `(tag1), (tag4), (tag5, (tag7):2)`
- Negative: `(tag2), (tag3), (tag6:2)`

### Modifiers

```text
<lora:name1:weight1> -<custom:name2:weight2>
```

This translates to:

- Positive: `<lora:name1:weight1>`
- Negative: `<custom:name2:weight2>`
