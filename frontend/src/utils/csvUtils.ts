import Papa from "papaparse";
import { ImportCsvColumn } from "../constants/importCsv";
import {
    DD_MM_YYYY_NON_STRICT_REGEX,
    DD_SLASH_MM_SLASH_YYYY_NON_STRICT_REGEX,
    NUMERIC_REGEX,
    YYYY_REGEX,
} from "../constants/misc";
import { type RunnerFromCsv, type RunnersCsvMapping } from "../types/ImportCsv";
import { isValidGender } from "./genderUtils";

export async function parseCsv(file: File, config?: Papa.ParseLocalConfig): Promise<Papa.ParseResult<string[]>> {
    console.log(file instanceof File);
    return new Promise<Papa.ParseResult<string[]>>((resolve, reject) => {
        Papa.parse<string[], File>(file, {
            ...config,
            complete(results) {
                resolve(results);
            },
            error(error) {
                reject(error);
            },
        });
    });
}

export function getRunnerFromCsv(csvRow: string[], mapping: RunnersCsvMapping): Partial<RunnerFromCsv> {
    let id: number | string | undefined = mapping[ImportCsvColumn.ID] !== null ? csvRow[mapping[ImportCsvColumn.ID]]?.trim() : undefined;
    const firstname = mapping[ImportCsvColumn.FIRSTNAME] !== null ? csvRow[mapping[ImportCsvColumn.FIRSTNAME]]?.trim() : undefined;
    const lastname = mapping[ImportCsvColumn.LASTNAME] !== null ? csvRow[mapping[ImportCsvColumn.LASTNAME]]?.trim() : undefined;
    let birthYear = mapping[ImportCsvColumn.BIRTH_YEAR] !== null ? csvRow[mapping[ImportCsvColumn.BIRTH_YEAR]]?.trim() : undefined;
    let gender = mapping[ImportCsvColumn.GENDER] !== null ? csvRow[mapping[ImportCsvColumn.GENDER]]?.trim() : undefined;

    if (id?.match(NUMERIC_REGEX)) {
        id = parseInt(id);
    } else {
        id = undefined;
    }

    if (birthYear?.match(DD_MM_YYYY_NON_STRICT_REGEX)) {
        birthYear = birthYear.split("-")[2];
    } else if (birthYear?.match(DD_SLASH_MM_SLASH_YYYY_NON_STRICT_REGEX)) {
        birthYear = birthYear.split("/")[2];
    }

    if (!birthYear?.match(YYYY_REGEX)) {
        birthYear = undefined;
    }

    if (!isValidGender(gender)) {
        gender = undefined;
    }

    return {
        id,
        firstname,
        lastname,
        birthYear,
        gender,
    };
}
