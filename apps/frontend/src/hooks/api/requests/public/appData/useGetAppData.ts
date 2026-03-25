import { useQuery } from "@tanstack/react-query";
import { FETCH_INTERVAL } from "../../../../../constants/api";
import { getAppData } from "../../../../../services/api/appDataService";

export const QUERY_KEY_GET_APP_DATA = "getAppData";

export function useGetAppData() {
  return useQuery({
    queryKey: [QUERY_KEY_GET_APP_DATA],
    queryFn: getAppData,
    refetchInterval: FETCH_INTERVAL,
    retry: false,
  });
}
