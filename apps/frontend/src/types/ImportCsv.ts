import { type Gender } from "@live24hisere/types";
import { type ImportCsvColumn } from "../constants/importCsv";

export type RunnersCsvMapping = Record<ImportCsvColumn, number | null>;

export interface RunnerFromCsv {
    id: number;
    firstname: string;
    lastname: string;
    birthYear: string;
    gender: Gender;
}
