import { createFileRoute } from "@tanstack/solid-router";
import { createSignal } from "solid-js";
import { useSchema } from "~/components/contexts/sqlite.context";
import { TableGrid } from "~/components/table/grid";
import { TextField, TextFieldInput, TextFieldLabel } from "~/components/ui/text-field";

export const Route = createFileRoute("/create-table")({
  component: RouteComponent,
});

function RouteComponent() {
  const { tables } = useSchema();
  const [title, setTitle] = createSignal("");

  return (
    <div>
      <h2>Create Table</h2>
      <div>
        <TextField value={title()} onChange={setTitle}>
          <TextFieldLabel>Table Name</TextFieldLabel>
          <TextFieldInput />
        </TextField>
      </div>
      <div>
        <TableGrid />
      </div>
    </div>
  );
}
