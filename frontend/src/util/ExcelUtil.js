import * as XLSX from 'xlsx/xlsx.mjs';

class ExcelUtil {
    static generateXlsxFromData = (data, filename = "Data") => {
        if (!Array.isArray(data)) {
            throw new Error('data must be an array of objects');
        }

        const workSheet = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, workSheet, 'Data');

        XLSX.writeFile(wb, filename + ".xlsx");
    }
}

export default ExcelUtil;
