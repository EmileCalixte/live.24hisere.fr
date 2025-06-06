import { Injectable } from "@nestjs/common";
import { fromZonedTime } from "date-fns-tz";
import { dateUtils } from "@live24hisere/utils";
import { DagDetectionType, DagFileLineData } from "../types/Dag";

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
      bibNumber: parseInt(lineItems[2]),
      passageDateTime: fromZonedTime(new Date(`${dateString}T${timeString}`), "Europe/Paris"),
    };

    if (!dateUtils.isDateValid(data.passageDateTime)) {
      throw new Error(`Unable to get a valid date from line: ${line}`);
    }

    return data;
  }
}
