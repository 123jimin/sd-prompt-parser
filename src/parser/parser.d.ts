export interface GroupMore { type: 'group_more', body: Prompt, weight?: number };
export interface GroupLess { type: 'group_less', body: Prompt };
export interface Modifier { type: 'modifier', args: string[] };
export interface Negate { type: 'negate', body: PromptElem };
export interface Comma { type: 'comma' };

export type PromptElem = GroupMore|GroupLess|Modifier|Negate|Comma|string;
export type Prompt = PromptElem[];

export const parse: (s: string) => Prompt;