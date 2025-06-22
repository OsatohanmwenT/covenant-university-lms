// hooks/useResources.ts
import { useQuery } from "@tanstack/react-query";

interface Params {
  query?: string;
  format?: string;
  page?: number;
  limit?: number;
}

export const useResources = ({ query = "", format = "", page = 1, limit = 8 }: Params) => {
  return useQuery({
    queryKey: ["resources", query, format, page],
    queryFn: async () => {
      const res = await fetch(`/api/resources?query=${query}&format=${format}&page=${page}&limit=${limit}`);
      const data = await res.json();
      return data;
    },
  });
};
