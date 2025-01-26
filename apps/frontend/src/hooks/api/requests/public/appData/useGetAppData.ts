import { useQuery } from "@tanstack/react-query";
import { getAppData } from "../../../../../services/api/appDataService";

// Fetch app data every 20 seconds
const FETCH_APP_DATA_INTERVAL_TIME = 20 * 1000;

export function useGetAppData() {
  return useQuery({
    queryKey: ["getAppData"],
    queryFn: getAppData,
    refetchInterval: FETCH_APP_DATA_INTERVAL_TIME,
    retry: false,
  });
}
