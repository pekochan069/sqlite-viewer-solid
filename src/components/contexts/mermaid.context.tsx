import type { Table } from "~/types/sqlite";
import type { Accessor, ParentProps, Setter } from "solid-js";
import mermaid from "mermaid";
import { createContext, createMemo, createSignal, useContext } from "solid-js";
import { useSchema } from "./sqlite.context";

type MermaidInitializeConfig = Parameters<typeof mermaid.initialize>[0];

type MermaidContextType = {
  config: Accessor<MermaidInitializeConfig>;
  setConfig: Setter<MermaidInitializeConfig>;
  code: () => string;
};

export function generateMermaidCode(tables: Table[]): string {
  let mermaid = `erDiagram\n`;

  for (const table of tables) {
    for (const fk of table.foreignKeys) {
      // mermaid += `  ${fk.table} ||--o{ ${table.name} : has\n`;
      let line = `  ${fk.to} |`;

      if (fk.mandatory) {
        line += "|-";
      } else {
        line += "o-";
      }

      if (fk.toMandatory) {
        line += "-|";
      } else {
        line += "-o";
      }

      if (fk.multiple) {
        line += "{";
      } else {
        line += "|";
      }

      line += `${table.name} : ${fk.relationName}\n`;

      mermaid += line;
    }

    mermaid += `  ${table.name} {\n`;

    for (const field of table.fields) {
      let line = `    ${field.type} ${field.name}`;

      if (field.isPrimary && field.isForeign) {
        line += " PK,FK";
      } else if (field.isPrimary && !field.isForeign) {
        line += " PK";
      } else if (!field.isPrimary && field.isForeign) {
        line += " FK";
      }

      line += "\n";

      mermaid += line;
    }

    mermaid += `  }`;
  }

  return mermaid;
}

const MermaidContext = createContext<MermaidContextType>();

export function useMermaid() {
  const context = useContext(MermaidContext);

  if (!context) {
    throw new Error("useMermaid must be used inside MermaidProvider");
  }

  return context;
}

export function MermaidProvider(props: ParentProps) {
  const { tables } = useSchema();
  const [config, setConfig] = createSignal({});
  const code = createMemo(() => generateMermaidCode(tables()));

  return (
    <MermaidContext.Provider value={{ code, config, setConfig }}>
      {props.children}
    </MermaidContext.Provider>
  );
}
