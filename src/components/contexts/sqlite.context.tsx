import type { Database, Sqlite3Static } from "@sqlite.org/sqlite-wasm";
import type { Field, ForeignKey, Table } from "~/types/sqlite";
import type { Accessor, ParentProps, Setter } from "solid-js";
import {
  createContext,
  createEffect,
  createMemo,
  createResource,
  createSignal,
  Match,
  onMount,
  Suspense,
  Switch,
  useContext,
} from "solid-js";
import { createSQLiteInstance, initializeSQLiteModule } from "~/lib/db/sqlite";
import { getSqliteType } from "../../lib/utils";

type SqliteModuleContextType = {
  sqliteModule: Sqlite3Static;
};

const SqliteModuleContext = createContext<SqliteModuleContextType>();

export function useSqliteModule() {
  const context = useContext(SqliteModuleContext);

  if (!context) {
    throw new Error("useSqliteModule must be used inside SqliteProvider");
  }

  return context;
}

export function SqliteModuleProvider(props: ParentProps) {
  const [sqliteModule] = createResource(initializeSQLiteModule);

  return (
    <Suspense>
      <Switch>
        <Match when={sqliteModule.error}>
          <div></div>
        </Match>
        <Match when={sqliteModule() === null}>
          <div></div>
        </Match>
        <Match when={sqliteModule()}>
          <SqliteModuleContext.Provider value={{ sqliteModule: sqliteModule()! }}>
            {props.children}
          </SqliteModuleContext.Provider>
        </Match>
      </Switch>
    </Suspense>
  );
}

type SqliteContextType = {
  sqlite: Accessor<Database>;
  uri: Accessor<string>;
  setUri: (uri: string) => void;
};

const SqliteContext = createContext<SqliteContextType>();

export function useSqlite() {
  const context = useContext(SqliteContext);

  if (!context) {
    throw new Error("useSqlite must be used inside SqliteProvider");
  }

  return context;
}

type SchemaContextType = {
  tables: Accessor<Table[]>;
  setTables: Setter<Table[]>;
  tableNames: () => string[];
  updateTables: () => void;
};

const SchemaContext = createContext<SchemaContextType>();

export function useSchema() {
  const context = useContext(SchemaContext);

  if (!context) {
    throw new Error("useSchema must be used inside SqliteProvider");
  }

  return context;
}

export function SqliteProvider(
  props: ParentProps<{
    uri: string;
  }>,
) {
  const sqliteModuleContext = useSqliteModule();
  const [uri, setUri] = createSignal(props.uri);
  const sqlite = createMemo(() => createSQLiteInstance(uri(), sqliteModuleContext.sqliteModule));

  const [tables, setTables] = createSignal<Table[]>([]);
  const tableNames = () => tables().map((table) => table.name);

  const changeUri = (uri: string) => {
    if (sqlite().isOpen()) {
      sqlite().close();
    }

    setUri(uri);
  };

  onMount(() => {
    sqlite()
      .exec("CREATE TABLE users (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL)")
      .exec(
        "CREATE TABLE posts (id INTEGER PRIMARY KEY NOT NULL, user_id INTEGER NOT NULL, title TEXT NOT NULL, contents TEXT, FOREIGN KEY (user_id) references users(id))",
      )
      .exec(
        "create table hello (id integer primary key not null, user_id integer not null, foreign key (user_id) references users(id) on delete cascade)",
      )
      .exec("insert into users (id, name) values (1, 'John Doe'), (2, 'Jane Doe'), (3, 'Jack Doe')")
      .exec(
        "insert into posts (id, user_id, title, contents) values (1, 1, 'Hello World', 'Hello World'), (2, 2, 'Hello World', 'Hello World'), (3, 3, 'Hello World', 'Hello World')",
      )
      .exec("insert into hello (id, user_id) values (1, 1), (2, 2), (3, 3)");

    updateTables();
  });

  createEffect(() => {
    console.log(tableNames());
  });

  function updateTables() {
    const db = sqlite();

    const newTables = db
      .selectObjects("SELECT * FROM sqlite_master WHERE TYPE='table'")
      .map((item) => ({
        sql: item.sql as string,
        name: item.name as string,
      }))
      .map((newTable) => {
        const newFields = db.selectObjects(`PRAGMA table_info(${newTable.name})`);

        const newForeignKeys = db.selectObjects(`PRAGMA foreign_key_list(${newTable.name})`);
        const newForeignKeyNames = newForeignKeys.map((key) => key.from as string);

        const fields: Field[] = newFields.map((field) => ({
          name: field.name as string,
          type: getSqliteType(field.type as string),
          isPrimary: field.pk === 1,
          isForeign: !!newForeignKeyNames.find((item) => item === field.name),
        }));

        const foreignKeys: ForeignKey[] = newForeignKeys.map((key) => ({
          field: key.from as string,
          mandatory: true,
          to: key.table as string,
          toField: key.to as string,
          toMandatory: false,
          relationName: "has",
          multiple: true,
        }));

        const table: Table = {
          name: newTable.name,
          sql: newTable.sql,
          fields,
          foreignKeys,
        };

        return table;
      });

    setTables(newTables);
  }

  return (
    <SqliteContext.Provider
      value={{
        uri,
        setUri: changeUri,
        sqlite,
      }}
    >
      <SchemaContext.Provider
        value={{
          tables,
          setTables,
          tableNames,
          updateTables,
        }}
      >
        {props.children}
      </SchemaContext.Provider>
    </SqliteContext.Provider>
  );
}
