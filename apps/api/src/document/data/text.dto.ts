import { type Static, t } from 'elysia';

export type Text = Static<typeof TextDTO>;

export const TextDTO = t.Recursive(
  (This) => {
    const Strikethrough = t.Tuple([t.Literal('s'), This]);
    const Underlined = t.Tuple([t.Literal('u'), This]);
    const Italic = t.Tuple([t.Literal('i'), This]);
    const Bold = t.Tuple([t.Literal('b'), This]);
    const Code = t.Tuple([t.Literal('c'), This]);
    const Link = t.Tuple([t.Literal('l'), This, t.String()]);

    return t.Array(
      t.Union([
        t.String(),
        Strikethrough,
        Underlined,
        Italic,
        Bold,
        Code,
        Link,
      ]),
    );
  },
  { $id: 'Text' },
);
