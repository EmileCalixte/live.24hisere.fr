import * as XLSX from 'xlsx/xlsx.mjs';

class ExcelUtil {
    static toto = () => {
        const data = [
            {name: "John", age: 27},
            {name: "Emily", age: 22},
            {name: "Tata", age: 31},
        ];

        const workSheet = XLSX.utils.json_to_sheet(data);

        console.log('worksheet', workSheet);

        const wb = XLSX.utils.book_new();

        console.log('workbook', wb);

        XLSX.utils.book_append_sheet(wb, workSheet, 'toto.xls');

        // const bin = XLSX.write(wb, {bookType: "xlsx", type: "binary"});

        XLSX.writeFile(wb, 'toto.xlsx');

        console.log('bin', bin);

        console.log(XLSX.utils);
    }
}

export default ExcelUtil;
