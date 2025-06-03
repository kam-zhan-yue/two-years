import Game from '@/components/game'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <Game />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})
