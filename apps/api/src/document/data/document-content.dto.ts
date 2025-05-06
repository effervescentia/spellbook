import { type Static, t, type TSchema } from 'elysia';

import { BlockType } from './block-type.enum';
import { TextDTO } from './text.dto';

const BlockDTO = <
  Type extends BlockType,
  Props extends Record<string, TSchema>,
>(
  type: Type,
  props: Props,
) =>
  t.Object({
    id: t.String(),
    type: t.Literal(type),
    ...props,
  });

const CodeBlockDTO = BlockDTO(BlockType.CODE, {
  code: t.String(),
});

const TextBlockDTO = BlockDTO(BlockType.TEXT, {
  text: TextDTO,
});

const BlockquoteBlockDTO = BlockDTO(BlockType.BLOCKQUOTE, {
  text: TextDTO,
});

const OrderedListBlockDTO = <Type extends TSchema>(Block: Type) =>
  BlockDTO(BlockType.ORDERED_LIST, {
    blocks: t.Array(Block),
  });

const UnorderedListBlockDTO = <Type extends TSchema>(Block: Type) =>
  BlockDTO(BlockType.UNORDERED_LIST, {
    blocks: t.Array(Block),
  });

export const AnyBlockDTO = t.Recursive((This) =>
  t.Union([
    CodeBlockDTO,
    TextBlockDTO,
    BlockquoteBlockDTO,
    OrderedListBlockDTO(This),
    UnorderedListBlockDTO(This),
  ]),
);

export type DocumentContent = Static<typeof DocumentContentDTO>;

export const DocumentContentDTO = t.Object({
  blocks: t.Array(AnyBlockDTO),
});
