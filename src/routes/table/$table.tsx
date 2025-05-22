import { createFileRoute } from "@tanstack/solid-router";
import { createMemo, createSignal, For, onMount } from "solid-js";
import { useSchema, useSqlite } from "~/components/contexts/sqlite.context";
import { TableList } from "~/components/table/table-list";

export const Route = createFileRoute("/table/$table")({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams()();
  const { sqlite } = useSqlite();
  const { tables } = useSchema();

  const [select, setSelect] = createSignal<string[]>([]);
  const [filter, setFilter] = createSignal("");

  const query = () => {
    let sql = "select ";

    if (select().length === 0) {
      sql += "*";
    } else {
      sql += select().join(", ");
    }

    sql += ` from ${params.table}`;

    if (filter() !== "") {
      sql += ` where ${filter()}`;
    }

    return sql;
  };

  const rows = () => sqlite().selectObjects(query());

  return (
    <div class="px-4 py-2">
      <TableList />
      <div>{params.table}</div>
      <div>
        <For each={rows()}>{(row) => <div>{row.id?.toString()}</div>}</For>
      </div>
    </div>
  );
}
