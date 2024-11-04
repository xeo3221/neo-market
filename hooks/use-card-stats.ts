import { useQuery } from "@tanstack/react-query";

interface CardStats {
  date: string;
  count: number;
  totalQuantity: number;
  revenue: number;
}

export function useCardStats(cardId: string) {
  return useQuery<CardStats[]>({
    queryKey: ["cardStats", cardId],
    queryFn: async () => {
      const response = await fetch(`/server/api/cards/${cardId}/stats`);
      if (!response.ok) {
        throw new Error("Failed to fetch card stats");
      }
      return response.json();
    },
  });
}
