import Papa from "papaparse";

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
