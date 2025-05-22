export type FieldType = "INTEGER" | "TEXT" | "REAL" | "BLOB" | "NUMERIC";

export type Field = {
  name: string;
  type: FieldType;
  isPrimary: boolean;
  isForeign: boolean;
};

export type ForeignKey = {
  field: string;
  mandatory: boolean;
  to: string;
  toField: string;
  toMandatory: boolean;
  relationName: string;
  multiple: boolean;
};

export type Table = {
  name: string;
  fields: Field[];
  foreignKeys: ForeignKey[];
  sql: string;
};
