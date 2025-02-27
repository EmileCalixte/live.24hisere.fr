import { describe, expect, it } from "vitest";
import type { RaceRunnerWithPassages, RaceRunnerWithProcessedData } from "@live24hisere/core/types";
import type { RankingRunnerGap } from "../../src/types/Ranking";
import { formatGap, FormatGapMode, spaceshipRunners } from "../../src/utils/runnerUtils";

describe("Format gap", () => {
  it("Should return null if gap is null", () => {
    expect(formatGap(null, { mode: FormatGapMode.LAPS_OR_TIME })).toBe(null);
    expect(formatGap(null, { mode: FormatGapMode.LAPS_AND_TIME })).toBe(null);
    expect(formatGap(null, { mode: FormatGapMode.LAPS_OR_DISTANCE })).toBe(null);
  });

  const gapLapGreater0TimeGreater0DistanceGreater0: RankingRunnerGap = {
    laps: 12,
    time: 1234000,
    distance: 567,
  };

  const gapLapGreater0TimeLower0DistanceGreater0: RankingRunnerGap = {
    laps: 12,
    time: -2345000,
    distance: 567,
  };

  const gapLap0TimeGreater0DistanceGreater0: RankingRunnerGap = {
    laps: 0,
    time: 1234000,
    distance: 567,
  };

  const gapLap0TimeLower0DistanceGreater0: RankingRunnerGap = {
    laps: 0,
    time: -2345000,
    distance: 567,
  };

  // I don't know if this case could really happen but I want my function to handle this case too
  const gapLapGreater0Time0DistanceGreater0: RankingRunnerGap = {
    laps: 12,
    time: 0,
    distance: 567,
  };

  const gapLap0Time0DistanceGreater0: RankingRunnerGap = {
    laps: 0,
    time: 0,
    distance: 567,
  };

  const gapLap0TimeGreater0Distance0: RankingRunnerGap = {
    laps: 0,
    time: 1234000,
    distance: 0,
  };

  const gapLap0TimeGreater0DistanceGreater1000: RankingRunnerGap = {
    laps: 0,
    time: 1234000,
    distance: 5678,
  };

  describe("Mode Laps Or Time", () => {
    const mode = FormatGapMode.LAPS_OR_TIME;

    it("Should show only laps if lap gap is greater than 0", () => {
      expect(formatGap(gapLapGreater0TimeGreater0DistanceGreater0, { mode })).toBe("+12\xa0tours");
    });

    it("Should show only time if lap gap is 0", () => {
      expect(formatGap(gapLap0TimeGreater0DistanceGreater0, { mode })).toBe("+20m\xa034s");
    });

    it("Should show '=' if time and lap gap are 0", () => {
      expect(formatGap(gapLap0Time0DistanceGreater0, { mode })).toBe("=");
    });

    it("Should show '=' if lap gap is 0 and time gap is lower than 0", () => {
      expect(formatGap(gapLap0TimeLower0DistanceGreater0, { mode })).toBe("=");
    });
  });

  describe("Mode Laps And Time", () => {
    const mode = FormatGapMode.LAPS_AND_TIME;

    it("Should show laps and time if both are greater than 0", () => {
      expect(formatGap(gapLapGreater0TimeGreater0DistanceGreater0, { mode })).toBe("+12\xa0tours (+20m\xa034s)");
    });

    it("Should show only time if lap gap is 0", () => {
      expect(formatGap(gapLap0TimeGreater0Distance0, { mode })).toBe("+20m\xa034s");
    });

    it("Should show only laps if time gap is 0", () => {
      expect(formatGap(gapLapGreater0Time0DistanceGreater0, { mode })).toBe("+12\xa0tours");
    });

    it("Should show only laps if time gap lower than 0", () => {
      expect(formatGap(gapLapGreater0TimeLower0DistanceGreater0, { mode })).toBe("+12\xa0tours");
    });

    it("Should show '=' if time and lap gap are 0", () => {
      expect(formatGap(gapLap0Time0DistanceGreater0, { mode })).toBe("=");
    });

    it("Should show '=' if lap gap is 0 and time gap is lower than 0", () => {
      expect(formatGap(gapLap0TimeLower0DistanceGreater0, { mode })).toBe("=");
    });
  });

  describe("Mode Laps Or Distance", () => {
    const mode = FormatGapMode.LAPS_OR_DISTANCE;

    it("Should show only laps if lap gap is greater than 0", () => {
      expect(formatGap(gapLapGreater0TimeGreater0DistanceGreater0, { mode })).toBe("+12\xa0tours");
    });

    it("Should show only distance in meters if lap gap is 0 and distance is between 1 and 1000", () => {
      expect(formatGap(gapLap0TimeGreater0DistanceGreater0, { mode })).toBe("+567\xa0m");
    });

    it("Should show only distance in km if lap gap is 0 and distance is at least 1000", () => {
      expect(formatGap(gapLap0TimeGreater0DistanceGreater1000, { mode })).toBe("+5.68\xa0km");
    });

    it("Should show '=' if distance and lap gap are 0", () => {
      expect(formatGap(gapLap0TimeGreater0Distance0, { mode })).toBe("=");
    });
  });
});

describe("Spaceship runners", () => {
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
    const runner1: SpaceshipableRunner = { ...baseRunner, totalDistance: 123456 };
    const runner2: SpaceshipableRunner = { ...baseRunner, totalDistance: 123457 }; // Faster than runner1 because greater distance covered during the race

    expect(spaceshipRunners(runner1, runner2, true, false)).toBe(1);
    expect(spaceshipRunners(runner2, runner1, true, false)).toBe(-1);

    const runner3: SpaceshipableRunner = { ...baseRunner, totalDistance: 123456 };

    expect(spaceshipRunners(runner1, runner3, true, false)).toBe(0);

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

    expect(spaceshipRunners(runner4, runner5, true, false)).toBe(1);
  });

  describe("Detailed ranking", () => {
    describe("Race finished", () => {
      it("Should sort runners by total distance if different", () => {
        const runner1: SpaceshipableRunner = { ...baseRunner, totalDistance: 123456 };
        const runner2: SpaceshipableRunner = { ...baseRunner, totalDistance: 123457 }; // Faster than runner1 because greater distance covered during the race

        expect(spaceshipRunners(runner1, runner2, false, true)).toBe(1);
        expect(spaceshipRunners(runner2, runner1, false, true)).toBe(-1);
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

        expect(spaceshipRunners(runner1, runner2, false, true)).toBe(0);
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

        expect(spaceshipRunners(runner1, runner2, false, true)).toBe(1);
        expect(spaceshipRunners(runner2, runner1, false, true)).toBe(-1);
      });
    });

    describe("Race not finished", () => {
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

        expect(spaceshipRunners(runner1, runner2, false, false)).toBe(-1);
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

        expect(spaceshipRunners(runner1, runner2, false, false)).toBe(1);
      });
    });
  });
});
