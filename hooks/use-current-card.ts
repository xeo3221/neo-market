import { useQuery } from "@tanstack/react-query";
import { getCardData } from "@/app/(dashboard)/data";

export function useCurrentCard(cardId: string | undefined) {
  return useQuery({
    queryKey: ["card", cardId],
    queryFn: () => {
      if (!cardId) return null;
      return getCardData(cardId);
    },
    enabled: !!cardId,
  });
}
