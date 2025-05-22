import type { Sqlite3Static } from "@sqlite.org/sqlite-wasm";
import sqlite3InitModule from "@sqlite.org/sqlite-wasm";

async function initializeSQLiteModule() {
  try {
    const sqlite3 = await sqlite3InitModule({
      print: console.log,
      printErr: console.error,
    });

    return sqlite3;
  } catch {
    console.error("Cannot initialize SQLite Module");
    return null;
  }
}

function createSQLiteInstance(uri: string, sqlite3: Sqlite3Static) {
  return new sqlite3.oo1.DB(uri, "cwrt");
}

export { initializeSQLiteModule, createSQLiteInstance };
