import { Link, useNavigate } from "@tanstack/solid-router";
import { For } from "solid-js";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useSchema } from "../contexts/sqlite.context";

export function TableList() {
  const navigate = useNavigate({ from: "/table/$table" });
  const { tableNames } = useSchema();

  return (
    <Tabs>
      <TabsList>
        <For each={tableNames()}>
          {(name) => (
            <TabsTrigger
              value={name}
              onClick={() => navigate({ to: "/table/$table", params: { table: name } })}
              class="hover:cursor-pointer"
            >
              {name}
            </TabsTrigger>
          )}
        </For>
      </TabsList>
    </Tabs>
  );
}
