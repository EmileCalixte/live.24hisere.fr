// @ts-expect-error
import * as XLSX from "xlsx/xlsx";

export function generateXlsxFromData(data: object[], filename = "Data"): void {
    const workSheet = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, workSheet, "Data");

    XLSX.writeFile(wb, filename + ".xlsx");
}
