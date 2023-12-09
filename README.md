# sd-prompt-parser

`sd-prompt-parser` is a simple JS library for parsing Stable Diffusion prompts with custom syntax.

The syntax is designed to be used on frontends with one text input.

## API

```js
import { parse, split, stringify } from 'sd-prompt-parser';
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

### LoRA

```text
<lora:name1:weight1> -<lora:name2:weight2>
```

This translates to:

- Positive: `<lora:name1:weight1>`
- Negative: `<lora:name2:weight2>`
