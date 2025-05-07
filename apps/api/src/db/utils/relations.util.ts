/**
 * A patched Drizzle relations function that enables the following:
 * - defining a one-to-one relation using non-nullable columns that is still nullable via
 *   `config.optional`: resolves https://github.com/drizzle-team/drizzle-orm/issues/1066
 * - defining a one-to-one relation without fields which includes a relation name: resolves
 *   https://github.com/drizzle-team/drizzle-orm/issues/3763
 *
 * Usage: import `relations` from this file rather than `drizzle-orm/relations` and use as normal.
 * `one()` now accepts a config object where the fields and references are optional, to enable use
 * with relation name, and also has a new key `optional` which when set to true marks this as an
 * optional relation, even if the fields are non-nullable.
 */

import {
  type AnyColumn,
  type AnyTable,
  type ColumnsWithTable,
  entityKind,
  type Table,
} from 'drizzle-orm';
import {
  createMany,
  One as OneBase,
  Relation,
  type RelationConfig as RelationConfigBase,
} from 'drizzle-orm/relations';

type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
    ? true
    : false;

type And<A extends boolean, B extends boolean> = [A, B][number] extends true
  ? true
  : true extends [Equal<A, false>, Equal<B, false>][number]
    ? false
    : never;

interface RelationFieldsReferencesConfig<
  TTableName extends string,
  TForeignTableName extends string,
  TColumns extends AnyColumn<{ tableName: TTableName }>[],
> {
  fields: TColumns;
  references: ColumnsWithTable<TTableName, TForeignTableName, TColumns>;
}

type RelationConfig<
  TTableName extends string,
  TForeignTableName extends string,
  TColumns extends AnyColumn<{ tableName: TTableName }>[],
  TOptional extends boolean,
> = { relationName?: string; optional?: TOptional } & (
  | RelationFieldsReferencesConfig<TTableName, TForeignTableName, TColumns>
  | { fields?: undefined; references?: undefined }
);

/**
 * Monkey patched Relations class that ignores the provided table relations helpers, and substitutes
 * our own.
 */
class Relations<
  TTableName extends string = string,
  TConfig extends Record<string, Relation> = Record<string, Relation>,
> {
  static readonly [entityKind]: string = 'Relations';

  declare readonly $brand: 'Relations';

  constructor(
    readonly table: AnyTable<{ name: TTableName }>,
    readonly inputConfig: (
      helpers: TableRelationsHelpers<TTableName>,
    ) => TConfig,
  ) {}

  config(): TConfig {
    return this.inputConfig(createTableRelationsHelpers(this.table));
  }
}

/**
 * Monkey patched One class to enable the use of `relationName` without field definitions (by adding
 * it as an input rather than in the config). The usage of this checks to see if the config is
 * present and uses its fields if so, so we need to have an empty config with a relation name to
 * integrate.
 *
 * See `createOne` below.
 */
class One<
  TTableName extends string = string,
  TIsNullable extends boolean = boolean,
> extends Relation<TTableName> {
  static override readonly [entityKind]: string = 'One';

  declare protected $relationBrand: 'One';

  constructor(
    sourceTable: Table,
    referencedTable: AnyTable<{ name: TTableName }>,
    readonly config:
      | RelationConfigBase<
          TTableName,
          string,
          AnyColumn<{ tableName: TTableName }>[]
        >
      | undefined,
    readonly isNullable: TIsNullable,
    relationName: string | undefined,
  ) {
    super(sourceTable, referencedTable, relationName);
  }

  withFieldName(fieldName: string): One<TTableName> {
    const relation = new One(
      this.sourceTable,
      this.referencedTable,
      this.config,
      this.isNullable,
      this.relationName,
    );
    relation.fieldName = fieldName;
    return relation;
  }
}

function createOne<TTableName extends string>(sourceTable: Table) {
  return function one<
    TForeignTable extends Table,
    TColumns extends [
      AnyColumn<{ tableName: TTableName }>,
      ...AnyColumn<{ tableName: TTableName }>[],
    ],
    TOptional extends boolean,
  >(
    table: TForeignTable,
    config?: RelationConfig<
      TTableName,
      TForeignTable['_']['name'],
      TColumns,
      TOptional
    >,
  ): OneBase<
    TForeignTable['_']['name'],
    And<
      TOptional extends true ? false : true,
      Equal<TColumns[number]['_']['notNull'], true>
    >
  > {
    // Only generate a new config if fields / references are defined. This avoids an issue where for
    // One, the config's fields are always used if the config is present, even if the fields and
    // references are not defined.
    // See: https://github.com/drizzle-team/drizzle-orm/blob/5dc5b05fb6b4d6b7ba5ac25d99dc8d6bcd833ace/drizzle-orm/src/relations.ts#L564
    const newConfig =
      config?.fields != null && config?.references != null
        ? { fields: config.fields, references: config.references }
        : undefined;

    // we have to return an object of type `One` here in order for the generated type on the
    // relation to be correct, i.e. singular rather than an array, due to the way the type check works

    return new One(
      sourceTable,
      table,
      newConfig,
      (!config?.optional &&
        (config?.fields?.reduce<boolean>((res, f) => res && f.notNull, true) ??
          false)) as And<
        TOptional extends true ? false : true,
        Equal<TColumns[number]['_']['notNull'], true>
      >,
      config?.relationName,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) as any;
  };
}

export function relations<
  TTableName extends string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TRelations extends Record<string, Relation<any>>,
>(
  table: AnyTable<{ name: TTableName }>,
  relations: (helpers: TableRelationsHelpers<TTableName>) => TRelations,
): Relations<TTableName, TRelations> {
  return new Relations<TTableName, TRelations>(
    table,
    (helpers: TableRelationsHelpers<TTableName>) =>
      Object.fromEntries(
        Object.entries(relations(helpers)).map(([key, value]) => [
          key,
          value.withFieldName(key),
        ]),
      ) as TRelations,
  );
}

function createTableRelationsHelpers<TTableName extends string>(
  sourceTable: AnyTable<{ name: TTableName }>,
) {
  return {
    one: createOne<TTableName>(sourceTable),
    many: createMany(sourceTable),
  };
}

type TableRelationsHelpers<TTableName extends string> = ReturnType<
  typeof createTableRelationsHelpers<TTableName>
>;
