import { QueryClient } from "@tanstack/react-query";
import { getApiErrorMessage } from "@/shared/api/http";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (getApiErrorMessage(error).includes("Network Error")) {
          return failureCount < 2;
        }
        return false;
      },
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
    mutations: {
      retry: false,
    },
  },
});
