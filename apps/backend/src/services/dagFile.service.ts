import { Injectable } from "@nestjs/common";
import { DagDetectionType, DagFileLineData } from "src/types/Dag";
import { dateUtils } from "@live24hisere/utils";

@Injectable()
export class DagFileService {
    getDataFromDagFileLine(line: string): DagFileLineData {
        const lineItems = line.trim().split(/\s+/);

        if (lineItems.length !== 7) {
            throw new Error(`Unexpected line format: ${line}`);
        }

        const dateString = lineItems[6].split("/").reverse().join("-");
        const timeString = lineItems[4].split(".")[0]; // 'convert' hh:mm:ss.cc to hh:mm:ss (ignore hundredths)

        const data: DagFileLineData = {
            detectionId: parseInt(lineItems[0]),
            detectionType: lineItems[5] as DagDetectionType,
            runnerId: parseInt(lineItems[2]),
            passageDateTime: new Date(`${dateString}T${timeString}`),
        };

        if (!dateUtils.isDateValid(data.passageDateTime)) {
            throw new Error(`Unable to get a valid date from line: ${line}`);
        }

        return data;
    }
}
