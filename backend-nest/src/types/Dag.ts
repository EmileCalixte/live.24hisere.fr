export type DagDetectionType = "E" | "M";

export interface DagFileLineData {
    detectionId: number;
    detectionType: DagDetectionType;
    runnerId: number;
    passageDateTime: Date;
}
