import {
  Faker,
  fakerDE,
  fakerDE_CH,
  fakerEN_GB,
  fakerEN_IE,
  fakerEN_ZA,
  fakerFR,
  fakerIT,
  fakerNL_BE,
  fakerRO,
} from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { Command, CommandRunner, InquirerService } from "nest-commander";
import { Gender } from "@live24hisere/core/types";
import { RunnerService } from "../../services/database/entities/runner.service";
import { askConfirmation } from "../../utils/command-utils";

const COUNTRY_CODE_TO_FAKER = {
  BEL: fakerNL_BE,
  CHE: fakerDE_CH,
  DEU: fakerDE,
  FRA: fakerFR,
  GBR: fakerEN_GB,
  IRL: fakerEN_IE,
  ITA: fakerIT,
  ROU: fakerRO,
  ZAF: fakerEN_ZA,
} as const;

const GENDER_TO_FAKER_SEX = {
  M: "male",
  F: "female",
} as const;

type CountryCode = keyof typeof COUNTRY_CODE_TO_FAKER;

function getFaker(countryCode: CountryCode): Faker {
  return COUNTRY_CODE_TO_FAKER[countryCode];
}

const COUNTRY_PROBABILITIES: Array<[number, CountryCode]> = [
  [0.01, "BEL"],
  [0.02, "GBR"],
  [0.03, "IRL"],
  [0.04, "ROU"],
  [0.05, "ZAF"],
  [0.065, "DEU"],
  [0.1, "CHE"],
  [0.15, "ITA"],
];

function getRandomCountryCode(): CountryCode {
  const random = Math.random();

  for (const [probability, countryCode] of COUNTRY_PROBABILITIES) {
    if (random < probability) {
      return countryCode;
    }
  }

  return "FRA";
}

function getRandomGender(): Gender {
  const random = Math.random();

  return random < 0.25 ? "F" : "M";
}

@Injectable()
@Command({
  name: "anonymize-runners",
  description: "Replaces the names, years of birth and genders of all runners with random data",
})
export class AnonymizeRunnersCommand extends CommandRunner {
  constructor(
    private readonly inquirerService: InquirerService,
    private readonly runnerService: RunnerService,
  ) {
    super();
  }

  async run(): Promise<void> {
    if (
      !(await askConfirmation(
        this.inquirerService,
        "Warning: The data of ALL runners will be overwritten by random data. Do you want to continue?",
        { default: false },
      ))
    ) {
      return;
    }

    const runners = await this.runnerService.getAdminRunners();

    if (
      !(await askConfirmation(
        this.inquirerService,
        `Do you REALLY want to continue? Data of ${runners.length} runners WILL BE LOST!`,
        { default: false },
      ))
    ) {
      return;
    }

    for (const runner of runners) {
      const countryCode = getRandomCountryCode();
      const gender = getRandomGender();
      const sex = GENDER_TO_FAKER_SEX[gender];

      const faker = getFaker(countryCode);

      const birthYear = faker.number.int({ min: 1940, max: 1997 }).toString();
      const firstname = faker.person.firstName(sex);
      const lastname = faker.person.lastName(sex);

      const newRunner = await this.runnerService.updateRunner(runner.id, {
        countryCode,
        gender,
        birthYear,
        firstname,
        lastname,
      });

      console.log(
        `${runner.firstname} ${runner.lastname} (${runner.gender}) (${runner.countryCode}), ${runner.birthYear} => ${newRunner.firstname} ${newRunner.lastname} (${newRunner.gender}) (${newRunner.countryCode}), ${newRunner.birthYear}`,
      );
    }

    console.log("Done");
  }
}
