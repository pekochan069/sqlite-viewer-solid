import { useSchema, useSqlite, useSqliteModule } from "./contexts/sqlite.context";
import { Button } from "./ui/button";

export function Control() {
  const { sqlite } = useSqlite();
  const { updateTables } = useSchema();

  function reset() {
    sqlite().exec(`PRAGMA writable_schema = 1;
delete from sqlite_master where type in ('table', 'index', 'trigger');
PRAGMA writable_schema = 0;VACUUM;`);
    updateTables();
  }

  return (
    <div>
      <Button onClick={reset} variant="destructive">
        Reset
      </Button>
    </div>
  );
}
