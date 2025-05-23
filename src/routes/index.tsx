import { createFileRoute, Link } from "@tanstack/solid-router";
import { useSchema, useSqlite } from "~/components/contexts/sqlite.context";
import { Control } from "~/components/control";
import { Mermaid } from "~/components/mermaid";

export const Route = createFileRoute("/")({
  component: IndexComponent,
});

function IndexComponent() {
  const { sqlite } = useSqlite();
  const { updateTables } = useSchema();

  return (
    <div class="text-center">
      <Link from="/" to="/create-table">
        Create Table
      </Link>
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
