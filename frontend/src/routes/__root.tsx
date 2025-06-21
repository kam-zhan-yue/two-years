import Main from "@/components/main";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import React from "react";

const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: () => (
    <React.Fragment>
      <QueryClientProvider client={queryClient}>
        <Main />
        <Outlet />
      </QueryClientProvider>
    </React.Fragment>
  ),
});
