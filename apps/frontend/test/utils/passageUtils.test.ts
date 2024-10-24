import { describe, expect, it } from "vitest";
import { type ProcessedPassage } from "@live24hisere/types";
import {
    getFastestLapPassage,
    getSlowestLapPassage,
} from "../../src/utils/passageUtils";

describe("Get fastest and slowest lap passages", () => {
    const emptyPassageArray: ProcessedPassage[] = [];

    const onlyOnePassageWithoutLapNumberArray: [ProcessedPassage] = [
        {
            id: 125,
            time: "2024-04-06T07:02:32.000Z",
            processed: {
                lapNumber: null,
                lapDistance: 523.123,
                lapDuration: 149000,
                lapStartTime: new Date("2024-04-06T07:00:03.000Z"),
                lapStartRaceTime: 0,
                lapEndTime: new Date("2024-04-06T07:02:32.000Z"),
                lapEndRaceTime: 149000,
                lapPace: 284827.8511936963,
                lapSpeed: 12.639213422818793,
                totalDistance: 523.123,
                averagePaceSinceRaceStart: 284827.8511936963,
                averageSpeedSinceRaceStart: 12.639213422818793,
            },
        },
    ];

    // Should never happen, but we want to test this case anyway
    const twoPassagesWithoutLapNumberArray: ProcessedPassage[] = [
        ...onlyOnePassageWithoutLapNumberArray,
        {
            id: 144,
            time: "2024-04-06T07:03:21.000Z",
            processed: {
                lapNumber: null,
                lapDistance: 523.123,
                lapDuration: 198000,
                lapStartTime: new Date("2024-04-06T07:00:03.000Z"),
                lapStartRaceTime: 0,
                lapEndTime: new Date("2024-04-06T07:03:21.000Z"),
                lapEndRaceTime: 198000,
                lapPace: 378496.0707137709,
                lapSpeed: 9.511327272727273,
                totalDistance: 523.123,
                averagePaceSinceRaceStart: 378496.0707137709,
                averageSpeedSinceRaceStart: 9.511327272727273,
            },
        },
    ];

    const fourPassagesWithLapNumberArray: ProcessedPassage[] = [
        {
            id: 518,
            time: "2024-04-06T07:27:20.000Z",
            processed: {
                lapNumber: 5,
                lapDistance: 1001.234,
                lapDuration: 305000,
                lapStartTime: new Date("2024-04-06T07:22:15.000Z"),
                lapStartRaceTime: 1332000,
                lapEndTime: new Date("2024-04-06T07:27:20.000Z"),
                lapEndRaceTime: 1637000,
                lapPace: 304624.0938681667,
                lapSpeed: 11.81784393442623,
                totalDistance: 5529.293000000001,
                averagePaceSinceRaceStart: 296059.55047055735,
                averageSpeedSinceRaceStart: 12.159715821624925,
            },
        },
        {
            id: 582,
            time: "2024-04-06T07:32:14.000Z",
            processed: {
                lapNumber: 6,
                lapDistance: 1001.234,
                lapDuration: 294000,
                lapStartTime: new Date("2024-04-06T07:27:20.000Z"),
                lapStartRaceTime: 1637000,
                lapEndTime: new Date("2024-04-06T07:32:14.000Z"),
                lapEndRaceTime: 1931000,
                lapPace: 293637.6511384951,
                lapSpeed: 12.260008163265306,
                totalDistance: 6530.527000000001,
                averagePaceSinceRaceStart: 295688.23465548793,
                averageSpeedSinceRaceStart: 12.174985603314346,
            },
        },
        {
            id: 661,
            time: "2024-04-06T07:37:41.000Z",
            processed: {
                lapNumber: 7,
                lapDistance: 1001.234,
                lapDuration: 327000,
                lapStartTime: new Date("2024-04-06T07:32:14.000Z"),
                lapStartRaceTime: 1931000,
                lapEndTime: new Date("2024-04-06T07:37:41.000Z"),
                lapEndRaceTime: 2258000,
                lapPace: 326596.9793275098,
                lapSpeed: 11.022759633027524,
                totalDistance: 7531.761000000001,
                averagePaceSinceRaceStart: 299797.08596701344,
                averageSpeedSinceRaceStart: 12.008122054915859,
            },
        },
        {
            id: 731,
            time: "2024-04-06T07:42:37.000Z",
            processed: {
                lapNumber: 8,
                lapDistance: 1001.234,
                lapDuration: 296000,
                lapStartTime: new Date("2024-04-06T07:37:41.000Z"),
                lapStartRaceTime: 2258000,
                lapEndTime: new Date("2024-04-06T07:42:37.000Z"),
                lapEndRaceTime: 2554000,
                lapPace: 295635.1861802535,
                lapSpeed: 12.177170270270272,
                totalDistance: 8532.995,
                averagePaceSinceRaceStart: 299308.74212395534,
                averageSpeedSinceRaceStart: 12.02771417384495,
            },
        },
    ];

    const onlyOnePassageWithLapNumberArray: [ProcessedPassage] = [
        fourPassagesWithLapNumberArray[0],
    ];

    const fastestLapPassage = fourPassagesWithLapNumberArray[1];
    const slowestLapPassage = fourPassagesWithLapNumberArray[2];

    describe("Get fastest lap passage", () => {
        it("should return null if passage array is empty", () => {
            expect(getFastestLapPassage(emptyPassageArray)).toEqual(null);
        });

        it("should return null if passage array does not contain any passage with a lap number", () => {
            expect(
                getFastestLapPassage(onlyOnePassageWithoutLapNumberArray),
            ).toEqual(null);
            expect(
                getFastestLapPassage(twoPassagesWithoutLapNumberArray),
            ).toEqual(null);
        });

        it("should return the passage if passage array contains only one passage with a lap number", () => {
            expect(
                getFastestLapPassage(onlyOnePassageWithLapNumberArray),
            ).toEqual(onlyOnePassageWithLapNumberArray[0]);
        });

        it("should return the fastest lap passage if passage array contains multiple passages with a lap number", () => {
            expect(
                getFastestLapPassage(fourPassagesWithLapNumberArray),
            ).toEqual(fastestLapPassage);
        });
    });

    describe("Get slowest lap passage", () => {
        it("should return null if passage array is empty", () => {
            expect(getSlowestLapPassage(emptyPassageArray)).toEqual(null);
        });

        it("should return null if passage array does not contain any passage with a lap number", () => {
            expect(
                getSlowestLapPassage(onlyOnePassageWithoutLapNumberArray),
            ).toEqual(null);
            expect(
                getSlowestLapPassage(twoPassagesWithoutLapNumberArray),
            ).toEqual(null);
        });

        it("should return the passage if passage array contains only one passage with a lap number", () => {
            expect(
                getSlowestLapPassage(onlyOnePassageWithLapNumberArray),
            ).toEqual(onlyOnePassageWithLapNumberArray[0]);
        });

        it("should return the slowest lap passage if passage array contains multiple passages with a lap number", () => {
            expect(
                getSlowestLapPassage(fourPassagesWithLapNumberArray),
            ).toEqual(slowestLapPassage);
        });
    });
});
