import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import type { AppRouter } from "@/server/routers";
import { getApiBaseUrl } from "@/constants/oauth";

/**
 * tRPC React client for type-safe API calls.
 */
export const trpc = createTRPCReact<AppRouter>();

/**
 * Creates the tRPC client with simplified configuration for better connectivity.
 */
export function createTRPCClient() {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: `${getApiBaseUrl()}/api/trpc`,
        transformer: superjson,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    ],
  });
}
