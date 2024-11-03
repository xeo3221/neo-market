import { useQuery } from "@tanstack/react-query";
import { getTransactionsData } from "@/app/(dashboard)/data";

export function useTransactions() {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactionsData,
  });
}
