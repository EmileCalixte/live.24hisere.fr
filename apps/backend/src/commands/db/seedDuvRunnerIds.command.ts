import { Injectable } from "@nestjs/common";
import { Command, CommandRunner, InquirerService } from "nest-commander";
import { FAKE_DATA_MAX_DUV_RUNNER_ID, FAKE_DATA_MIN_DUV_RUNNER_ID } from "../../constants/fakeData.constants";
import { RunnerService } from "../../services/database/entities/runner.service";
import { askConfirmation } from "../../utils/command-utils";

const DUV_RUNNER_ID_ASSIGNMENT_PROBABILITY = 0.9;

@Injectable()
@Command({
  name: "seed-duv-runner-ids",
  description: `Assigns a random DUV runner ID to ${DUV_RUNNER_ID_ASSIGNMENT_PROBABILITY * 100}% of runners`,
})
export class SeedDuvRunnerIdsCommand extends CommandRunner {
  constructor(
    private readonly inquirerService: InquirerService,
    private readonly runnerService: RunnerService,
  ) {
    super();
  }

  async run(): Promise<void> {
    const runners = await this.runnerService.getAdminRunners();

    if (
      !(await askConfirmation(
        this.inquirerService,
        `This will assign a random DUV runner ID to ~90% of the ${runners.length} runners. Do you want to continue?`,
        { default: false },
      ))
    ) {
      return;
    }

    for (const runner of runners) {
      if (Math.random() >= DUV_RUNNER_ID_ASSIGNMENT_PROBABILITY) {
        console.log(`${runner.firstname} ${runner.lastname}: skipped`);
        continue;
      }

      const duvRunnerId = Math.floor(
        Math.random() * (FAKE_DATA_MAX_DUV_RUNNER_ID - FAKE_DATA_MIN_DUV_RUNNER_ID + 1) + FAKE_DATA_MIN_DUV_RUNNER_ID,
      ).toString();

      await this.runnerService.updateRunner(runner.id, { duvRunnerId });

      console.log(`${runner.firstname} ${runner.lastname}: duvRunnerId = ${duvRunnerId}`);
    }

    console.log("Done");
  }
}
