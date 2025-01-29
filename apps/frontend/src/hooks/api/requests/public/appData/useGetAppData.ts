import { useQuery } from "@tanstack/react-query";
import { FETCH_INTERVAL } from "../../../../../constants/api";
import { getAppData } from "../../../../../services/api/appDataService";

export function useGetAppData() {
  return useQuery({
    queryKey: ["getAppData"],
    queryFn: getAppData,
    refetchInterval: FETCH_INTERVAL,
    retry: false,
  });
}
