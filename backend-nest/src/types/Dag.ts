/**
 * Type of passage detection
 */
export type DagDetectionType = "E" | "M";

/**
 * An object representing a data line in a dag file
 */
export interface DagFileLineData {
    /**
     * The ID of the detection in the timing system
     */
    detectionId: number;

    /**
     * The type of passage detection
     */
    detectionType: DagDetectionType;

    /**
     * The ID of the runner
     */
    runnerId: number;

    /**
     * The date and time of the passage
     */
    passageDateTime: Date;
}
