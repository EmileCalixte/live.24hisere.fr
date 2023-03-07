// eslint-disable-next-line @typescript-eslint/no-var-requires
const XLSX = require("xlsx/xlsx");

class ExcelUtil {
    static generateXlsxFromData = (data: object[], filename = "Data") => {
        const workSheet = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, workSheet, "Data");

        XLSX.writeFile(wb, filename + ".xlsx");
    };
}

export default ExcelUtil;
