import { createFileRoute } from "@tanstack/solid-router";
import { onMount } from "solid-js";
import { useSchema, useSqlite } from "~/components/contexts/sqlite.context";
import { Control } from "~/components/control";
import { Mermaid } from "~/components/mermaid";
import logo from "../logo.svg";

export const Route = createFileRoute("/")({
  component: IndexComponent,
});

function IndexComponent() {
  const { sqlite } = useSqlite();
  const { updateTables } = useSchema();

  return (
    <div class="text-center">
      <button
        onClick={() => {
          sqlite().exec(
            "create table bye (id integer primary key not null, hello_id integer not null, foreign key (hello_id) references hello(id) on delete cascade)",
          );
          updateTables();
        }}
      >
        Click
      </button>
      <Control />
      <Mermaid />
    </div>
  );
}
