import {DateISOString} from "src/types/Date";

export interface AppDataResponse {
    currentTime: DateISOString;
    lastUpdateTime: DateISOString | null;
}
