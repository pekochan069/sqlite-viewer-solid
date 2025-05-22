import { createRootRouteWithContext, Outlet } from "@tanstack/solid-router";
import { TanStackRouterDevtools } from "@tanstack/solid-router-devtools";
import Header from "../components/header";

export const Route = createRootRouteWithContext()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Header />

      <Outlet />
      {/* <TanStackRouterDevtools /> */}
    </>
  );
}
