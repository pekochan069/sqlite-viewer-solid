import type { CellContext, ColumnDef, Row } from "@tanstack/solid-table";
import type { FieldType, ForeignKey, Table } from "~/types/sqlite";
import { createSolidTable, flexRender, getCoreRowModel } from "@tanstack/solid-table";
import { createSignal, For } from "solid-js";
import {
  GridBody,
  GridCaption,
  GridCell,
  GridFooter,
  GridHead,
  GridHeader,
  Grid as GridRoot,
  GridRow,
} from "../ui/grid";

type Reference = Omit<ForeignKey, "field">;

type TableField = {
  type: FieldType;
  name: string;
  isPrimary: boolean;
  isForeign: boolean;
  isUnique: boolean;
  isNullable: boolean;
  defaultValue: string;
  autoIncrement: boolean;
  reference: Reference;
};

type CellInfo<T> = CellContext<TableField, T>;

const columns: ColumnDef<TableField>[] = [
  {
    accessorFn: (row) => row.type,
    accessorKey: "type",
    cell: (info: CellInfo<FieldType>) => info.getValue(),
    footer: (info) => info.column.id,
  },
  {
    accessorFn: (row) => row.name,
    accessorKey: "name",
    cell: (info: CellInfo<string>) => info.getValue(),
    footer: (info) => info.column.id,
  },
  {
    accessorFn: (row) => row.isPrimary,
    accessorKey: "isPrimary",
    cell: (info: CellInfo<boolean>) => info.getValue(),
    footer: (info) => info.column.id,
  },
  {
    accessorFn: (row) => row.isForeign,
    accessorKey: "isForeign",
    cell: (info: CellInfo<boolean>) => info.getValue(),
    footer: (info) => info.column.id,
  },
  {
    accessorFn: (row) => row.isUnique,
    accessorKey: "isUnique",
    cell: (info: CellInfo<boolean>) => info.getValue(),
    footer: (info) => info.column.id,
  },
  {
    accessorFn: (row) => row.isNullable,
    accessorKey: "isNullable",
    cell: (info: CellInfo<boolean>) => (info.getValue() ? "Yes" : "No"),
    footer: (info) => info.column.id,
  },
  {
    accessorFn: (row) => row.defaultValue,
    accessorKey: "defaultValue",
    cell: (info: CellInfo<string>) => info.getValue(),
    footer: (info) => info.column.id,
  },
  {
    accessorFn: (row) => row.autoIncrement,
    accessorKey: "autoIncrement",
    cell: (info: CellInfo<boolean>) => (info.getValue() ? "Yes" : "No"),
    footer: (info) => info.column.id,
  },
  {
    accessorFn: (row) => row.reference,
    accessorKey: "reference",
    cell: (info: CellInfo<Reference>) => info.getValue(),
    footer: (info) => info.column.id,
  },
];

function TableGridRow(props: { row: Row<TableField> }) {
  const reference = () => {
    const ref = props.row.getValue<Reference>("reference");
    return `${ref.to}(${ref.toField})`;
  };

  return (
    <GridRow>
      {/* <GridCell>{props.field.type}</GridCell>
      <GridCell>{props.field.name}</GridCell>
      <GridCell>{props.field.isPrimary ? "Yes" : "No"}</GridCell>
      <GridCell>{props.field.isForeign ? "Yes" : "No"}</GridCell>
      <GridCell>{props.field.isUnique ? "Yes" : "No"}</GridCell>
      <GridCell>{props.field.isNullable ? "Yes" : "No"}</GridCell>
      <GridCell>{props.field.defaultValue}</GridCell>
      <GridCell>{props.field.autoIncrement ? "Yes" : "No"}</GridCell>
      <GridCell>
        {props.field.reference.to}({props.field.reference.toField})
      </GridCell> */}
      {/* <For each={props.row.getVisibleCells()}>
        {(cell) => <GridCell>{flexRender(cell.column.columnDef.cell, cell.getContext())}</GridCell>}
      </For> */}
      <GridCell>{props.row.getValue("type")}</GridCell>
      <GridCell>{props.row.getValue("name")}</GridCell>
      <GridCell>{props.row.getValue("isPrimary") ? "Yes" : "No"}</GridCell>
      <GridCell>{props.row.getValue("isForeign") ? "Yes" : "No"}</GridCell>
      <GridCell>{props.row.getValue("isUnique") ? "Yes" : "No"}</GridCell>
      <GridCell>{props.row.getValue("isNullable") ? "Yes" : "No"}</GridCell>
      <GridCell>{props.row.getValue("defaultValue")}</GridCell>
      <GridCell>{props.row.getValue("autoIncrement") ? "Yes" : "No"}</GridCell>
      <GridCell>{reference()}</GridCell>
    </GridRow>
  );
}

type TableGridProps = {
  table: Table;
};

export function TableGrid(props: TableGridProps) {
  const [fields, setFields] = createSignal<TableField[]>([
    {
      autoIncrement: false,
      defaultValue: "",
      isForeign: false,
      isNullable: true,
      isPrimary: true,
      isUnique: false,
      name: "id",
      reference: {
        mandatory: false,
        multiple: false,
        relationName: "",
        to: "users",
        toField: "id",
        toMandatory: false,
      },
      type: "INTEGER",
    },
  ]);
  const table = createSolidTable({
    columns,
    get data() {
      return fields();
    },
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <GridRoot>
      <GridHeader>
        <GridRow>
          <GridHead>Type</GridHead>
          <GridHead>Name</GridHead>
          <GridHead>Primary Key</GridHead>
          <GridHead>Foreign Key</GridHead>
          <GridHead>Unique</GridHead>
          <GridHead>Not Null</GridHead>
          <GridHead>Default</GridHead>
          <GridHead>Auto Increment</GridHead>
          <GridHead>References</GridHead>
        </GridRow>
      </GridHeader>
      <GridBody>
        <For each={table.getRowModel().rows}>{(row) => <TableGridRow row={row} />}</For>
      </GridBody>
    </GridRoot>
  );
}
