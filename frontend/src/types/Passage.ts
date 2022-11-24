export default interface Passage {
    id: number,
    time: string,
}

export interface PassageProcessedData {
    lapDistance: number,
    lapDuration: number,
    lapNumber: number | null,
    lapStartTime: Date,
    lapStartRaceTime: number,
    lapEndTime: Date,
    lapEndRaceTime: number,
    lapPace: number,
    lapSpeed: number,
    totalDistance: number,
    averagePaceSinceRaceStart: number,
    averageSpeedSinceRaceStart: number,
}

export interface ProcessedPassage extends Passage {
    processed: PassageProcessedData,
}
