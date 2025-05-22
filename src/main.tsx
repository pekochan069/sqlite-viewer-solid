import { createRouter, RouterProvider } from "@tanstack/solid-router";
import { render } from "solid-js/web";
import { routeTree } from "./routeTree.gen";
import "./styles.css";
import { MermaidProvider } from "./components/contexts/mermaid.context";
import { SqliteModuleProvider, SqliteProvider } from "./components/contexts/sqlite.context";

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultPreloadStaleTime: 0,
});

declare module "@tanstack/solid-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <>
      <SqliteModuleProvider>
        <SqliteProvider uri=":memory:">
          <MermaidProvider>
            <RouterProvider router={router} />
          </MermaidProvider>
        </SqliteProvider>
      </SqliteModuleProvider>
    </>
  );
}

const rootElement = document.getElementById("app");
if (rootElement) {
  render(() => <App />, rootElement);
}
