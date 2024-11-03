import { useQuery } from "@tanstack/react-query";
import { getInventoryData } from "@/app/(dashboard)/data";

export function useInventory() {
  return useQuery({
    queryKey: ["inventory"],
    queryFn: getInventoryData,
  });
}
