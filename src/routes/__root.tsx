import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { Suspense, lazy } from "react";

// Devtools ship only in development builds.
const Devtools = import.meta.env.DEV
  ? lazy(async () => {
      const [{ TanstackDevtools }, { TanStackRouterDevtoolsPanel }] =
        await Promise.all([
          import("@tanstack/react-devtools"),
          import("@tanstack/react-router-devtools"),
        ]);
      return {
        default: () => (
          <TanstackDevtools
            config={{ position: "bottom-left" }}
            plugins={[
              { name: "Tanstack Router", render: <TanStackRouterDevtoolsPanel /> },
            ]}
          />
        ),
      };
    })
  : () => null;

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: () => (
    <>
      <Outlet />
      <Suspense>
        <Devtools />
      </Suspense>
    </>
  ),
});
