import { describe, expect, it } from "vitest";
import type { PublicRace, RaceRunnerWithPassages, RaceRunnerWithProcessedData } from "@live24hisere/core/types";
import { spaceshipRunners } from "../../src/utils/runnerUtils";

describe("Spaceship runners", () => {
  const baseRace: PublicRace = {
    id: 0,
    name: "Any race",
    startTime: new Date().toISOString(),
    duration: 0,
    initialDistance: "0",
    lapDistance: "0",
    isBasicRanking: false,
  };

  const baseRunner: SpaceshipableRunner = {
    id: 1,
    firstname: "Any",
    lastname: "Runner",
    gender: "M",
    birthYear: "0",
    countryCode: "FRA",
    raceId: 0,
    bibNumber: 123,
    stopped: false,
    finalDistance: "0",
    passages: [],
    totalDistance: 0,
    distanceToLastPassage: 0,
    averageSpeedToLastPassage: 0,
    averagePaceToLastPassage: 0,
    totalAverageSpeed: 0,
    totalAveragePace: 0,
    lastPassageTime: {
      raceTime: 0,
      time: new Date(0),
    },
  };

  type SpaceshipableRunner = RaceRunnerWithPassages & RaceRunnerWithProcessedData;

  it("Basic ranking: Should sort runners by total distance only", () => {
    const race: PublicRace = {
      ...baseRace,
      isBasicRanking: true,
    };

    const runner1: SpaceshipableRunner = { ...baseRunner, totalDistance: 123456 };
    const runner2: SpaceshipableRunner = { ...baseRunner, totalDistance: 123457 }; // Faster than runner1 because greater distance covered during the race

    expect(spaceshipRunners(runner1, runner2, race)).toBe(1);
    expect(spaceshipRunners(runner2, runner1, race)).toBe(-1);

    const runner3: SpaceshipableRunner = { ...baseRunner, totalDistance: 123456 };

    expect(spaceshipRunners(runner1, runner3, race)).toBe(0);

    const runner4: SpaceshipableRunner = {
      ...baseRunner,
      totalDistance: 123456,
      passages: [
        { id: 123, time: "2024-04-06T10:00:00Z" },
        { id: 456, time: "2024-04-06T11:00:00Z" },
      ],
    };

    // Faster than runner 4 even if it has less passages: in basic ranking mode, we don't care about passage count
    const runner5: SpaceshipableRunner = {
      ...baseRunner,
      totalDistance: 123457,
      passages: [{ id: 234, time: "2024-04-06T10:30:00Z" }],
    };

    expect(spaceshipRunners(runner4, runner5, race)).toBe(1);
  });

  describe("Detailed ranking", () => {
    describe("Race finished", () => {
      const race: PublicRace = {
        ...baseRace,
        duration: 86400,
        startTime: new Date("2022-01-01T09:00:00Z").toISOString(),
      };

      it("Should sort runners by total distance if different", () => {
        const runner1: SpaceshipableRunner = { ...baseRunner, totalDistance: 123456 };
        const runner2: SpaceshipableRunner = { ...baseRunner, totalDistance: 123457 }; // Faster than runner1 because greater distance covered during the race

        expect(spaceshipRunners(runner1, runner2, race)).toBe(1);
        expect(spaceshipRunners(runner2, runner1, race)).toBe(-1);
      });

      it("Should sort runners by total distance if equal with non-zero final distance", () => {
        const runner1: SpaceshipableRunner = {
          ...baseRunner,
          totalDistance: 20000,
          finalDistance: "123",
          lastPassageTime: { time: new Date(), raceTime: 60000 },
        };
        const runner2: SpaceshipableRunner = {
          ...baseRunner,
          totalDistance: 20000,
          lastPassageTime: { time: new Date(), raceTime: 38000 },
        };

        expect(spaceshipRunners(runner1, runner2, race)).toBe(0);
      });

      it("Should sort runners by last passage race time if total distance are equal with zero final distances", () => {
        const runner1: SpaceshipableRunner = {
          ...baseRunner,
          totalDistance: 123456,
          lastPassageTime: { time: new Date(), raceTime: 50000 },
        };

        // Faster than runner 1 because total distance are equal but last passage is earlier
        const runner2: SpaceshipableRunner = {
          ...baseRunner,
          totalDistance: 123456,
          lastPassageTime: { time: new Date(), raceTime: 48000 },
        };

        expect(spaceshipRunners(runner1, runner2, race)).toBe(1);
        expect(spaceshipRunners(runner2, runner1, race)).toBe(-1);
      });
    });

    describe("Race not finished", () => {
      const race: PublicRace = {
        ...baseRace,
        duration: 86400,
      };

      it("Should sort runners by passage count if different", () => {
        const runner1: SpaceshipableRunner = {
          ...baseRunner,
          lastPassageTime: {
            time: new Date(),
            raceTime: 10000,
          },
          passages: [
            { id: 123, time: "2024-04-06T10:00:00Z" },
            { id: 456, time: "2024-04-06T11:00:00Z" },
          ],
        };

        const runner2: SpaceshipableRunner = {
          ...baseRunner,
          lastPassageTime: {
            time: new Date(),
            raceTime: 8000,
          },
          passages: [{ id: 234, time: "2024-04-06T10:30:00Z" }],
        };

        expect(spaceshipRunners(runner1, runner2, race)).toBe(-1);
      });

      it("Should sort runners by last passage race time if passage count are equal", () => {
        const runner1: SpaceshipableRunner = {
          ...baseRunner,
          lastPassageTime: {
            time: new Date(),
            raceTime: 10000,
          },
          passages: [
            { id: 123, time: "2024-04-06T10:00:00Z" },
            { id: 456, time: "2024-04-06T11:00:00Z" },
          ],
        };

        const runner2: SpaceshipableRunner = {
          ...baseRunner,
          lastPassageTime: {
            time: new Date(),
            raceTime: 8000,
          },
          passages: [
            { id: 234, time: "2024-04-06T10:30:00Z" },
            { id: 345, time: "2024-04-06T10:45:00Z" },
          ],
        };

        expect(spaceshipRunners(runner1, runner2, race)).toBe(1);
      });
    });
  });
});
