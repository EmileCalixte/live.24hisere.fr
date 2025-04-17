import { Injectable } from "@nestjs/common";
import { fromZonedTime } from "date-fns-tz";
import fs from "fs";
import { Command, CommandRunner, Option } from "nest-commander";
import Papa from "papaparse";
import path from "path";
import { AdminRace } from "@live24hisere/core/types";
import { typeUtils } from "@live24hisere/utils";
import { RaceService } from "../../services/database/entities/race.service";
import { InvalidArgumentError } from "./../../errors/commands/InvalidArgumentError";
import { InvalidCsvDataError } from "./../../errors/csv/InvalidCsvDataError";
import { PassageService } from "./../../services/database/entities/passage.service";

interface CommandOptions {
  input: string;
  race: number;
  bibColumnName: string;
  timeColumnName: string;
}

interface CsvColumnIndexes {
  bibColumnIndex: number;
  timeColumnIndex: number;
}

interface CsvLineData {
  bib: number;
  time: Date;
}

@Injectable()
@Command({
  name: "import-passages-csv",
  description: "Command created to import a passage list exported from wiclax for the 7th edition",
})
export class ImportPassagesCsvCommand extends CommandRunner {
  constructor(
    private readonly passageService: PassageService,
    private readonly raceService: RaceService,
  ) {
    super();
  }

  async run(_params: string[], options: CommandOptions): Promise<void> {
    const race = await this.raceService.getAdminRaceById(options.race);

    if (!race) {
      throw new InvalidArgumentError(`Race with ID ${options.race} does not exist`);
    }

    const csvContent = this.getCsvContent(options.input);

    const parseResult = Papa.parse(csvContent);

    const columnIndexes = this.findColumnIndexes(
      parseResult.data[0] as string[],
      options.timeColumnName,
      options.bibColumnName,
    );

    await this.handleData(parseResult.data.slice(1), columnIndexes, race);
  }

  @Option({
    flags: "-i, --input [csvFilePath]",
    description: "The path to the CSV file to import",
    required: true,
  })
  parseCsvFilePath(value: string): string {
    return value;
  }

  @Option({
    flags: "-r, --race [race]",
    description: "The ID of the race for which the passages are to be imported",
    required: true,
  })
  parseRaceIds(value: string): number {
    const id = Number(value);

    if (isNaN(id)) {
      throw new InvalidArgumentError("Race ID must be a number");
    }

    return id;
  }

  @Option({
    flags: "-t, --timeColumnName [timeColumnName]",
    description: "The name of the time column in CSV file",
    required: true,
  })
  parseTimeColumnName(value: string): string {
    return value;
  }

  @Option({
    flags: "-b --bibColumnName [bibColumnName]",
    description: "The name of the bib column in CSV file",
    required: true,
  })
  parseBibColumnName(value: string): string {
    return value;
  }

  private getCsvContent(filePath: string): string {
    const absolutePath = path.resolve(filePath);

    if (!fs.existsSync(absolutePath)) {
      throw new InvalidArgumentError(`${absolutePath} does not exist`);
    }

    const stat = fs.statSync(absolutePath);

    if (!stat.isFile()) {
      throw new InvalidArgumentError(`${absolutePath} is not a file`);
    }

    return fs.readFileSync(absolutePath).toString();
  }

  private findColumnIndexes(csvHeader: string[], timeColumnName: string, bibColumnName: string): CsvColumnIndexes {
    const timeColumnIndex = csvHeader.findIndex((column) => column === timeColumnName);
    const bibColumnIndex = csvHeader.findIndex((column) => column === bibColumnName);

    if (timeColumnIndex === -1) {
      throw new InvalidArgumentError(`Column ${timeColumnName} does not exist in CSV file`);
    }

    if (bibColumnIndex === -1) {
      throw new InvalidArgumentError(`Column ${bibColumnName} does not exist in CSV file`);
    }

    return { timeColumnIndex, bibColumnIndex };
  }

  private async handleData(csvData: unknown[], columnIndexes: CsvColumnIndexes, race: AdminRace): Promise<void> {
    const dataToImport = csvData
      .map<CsvLineData | undefined>((dataLine, index) => {
        const realLineIndex = index + 2; // Array.map index starts at 0, and we removed the header line before passing data to this function

        if (!typeUtils.isArray(dataLine)) {
          throw new InvalidCsvDataError(
            `Expected array representing data line, got ${typeof dataLine} at line ${realLineIndex}`,
          );
        }

        if (dataLine.length < 1 || (dataLine.length === 1 && dataLine[0] === "")) {
          return undefined;
        }

        const rawBib = dataLine[columnIndexes.bibColumnIndex];

        if (rawBib === undefined) {
          throw new InvalidCsvDataError(`Cannot find bib number at line ${realLineIndex}`);
        }

        const bib = Number(rawBib);

        if (isNaN(bib)) {
          throw new InvalidCsvDataError(`Bib number is not a number at line ${realLineIndex}`);
        }

        const rawTime = dataLine[columnIndexes.timeColumnIndex];

        if (typeUtils.isNullOrUndefined(rawTime)) {
          throw new InvalidCsvDataError(`Cannot find time at line ${realLineIndex}`);
        }

        if (typeof rawTime !== "string") {
          throw new InvalidCsvDataError(`Time is not a string at line ${realLineIndex}`);
        }

        return {
          bib,
          time: this.parseDateString(rawTime, new Date(race.startTime)),
        };
      })
      .filter((line) => line !== undefined);

    console.log(`Found ${dataToImport.length} lines to import`);

    console.log("Filtering data...");

    const filteredDataToImport = this.removeDuplicates(dataToImport);

    console.log(`${filteredDataToImport.length} passages to import`);

    const importedPassageCount = await this.passageService.importDetections(race.id, filteredDataToImport, new Date());

    console.log(`Imported ${importedPassageCount} passages`);
  }

  private parseDateString(input: string, raceStartDate: Date): Date {
    // Format date and time : "20250406D08h59'50,570"
    const fullDateRegex = /^(\d{4})(\d{2})(\d{2})D(\d{2})h(\d{2})'(\d{2}),?\d*$/;

    // Format time only : "23h11'33,80"
    const timeOnlyRegex = /^(\d{2})h(\d{2})'(\d{2}),?\d*$/;

    if (fullDateRegex.test(input)) {
      const match = fullDateRegex.exec(input);

      if (!match) {
        throw new Error("Cannot extract data from date and time input");
      }

      const year = parseInt(match[1]);
      const month = parseInt(match[2]) - 1; // Month start
      const day = parseInt(match[3]);
      const hour = parseInt(match[4]);
      const minute = parseInt(match[5]);
      const second = parseInt(match[6]);

      return fromZonedTime(new Date(year, month, day, hour, minute, second), "Europe/Paris");
    } else if (timeOnlyRegex.test(input)) {
      const match = timeOnlyRegex.exec(input);

      if (!match) {
        throw new Error("Cannot extract data from time only input");
      }

      const year = raceStartDate.getFullYear();
      const month = raceStartDate.getMonth();
      const day = raceStartDate.getDate();
      const hour = parseInt(match[1]);
      const minute = parseInt(match[2]);
      const second = parseInt(match[3]);

      const date = fromZonedTime(new Date(year, month, day, hour, minute, second), "Europe/Paris");

      if (date < raceStartDate) {
        date.setDate(date.getDate() + 1);
      }

      return date;
    } else {
      throw new Error(`Invalid date or time format: ${input}`);
    }
  }

  private removeDuplicates(data: readonly CsvLineData[]): CsvLineData[] {
    const duplicateInterval = 30000; // 30 seconds

    const runnerPassages = new Map<number, Date[]>();

    const filteredData: CsvLineData[] = [];

    for (const passageData of data) {
      const existingPassages = runnerPassages.get(passageData.bib) ?? [];

      if (
        existingPassages.some((datetime) => {
          const existingPassageTime = datetime.getTime();
          const passageTime = passageData.time.getTime();

          return (
            passageTime > existingPassageTime - duplicateInterval
            && passageTime < existingPassageTime + duplicateInterval
          );
        })
      ) {
        continue;
      }

      filteredData.push(passageData);

      existingPassages.push(passageData.time);
      runnerPassages.set(passageData.bib, existingPassages);
    }

    return filteredData;
  }
}
