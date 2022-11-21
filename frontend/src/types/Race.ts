export default interface Race {
    id: number,
    name: string,
    isPublic: boolean,
    startTime: string,
    duration: number,
    initialDistance: number,
    lapDistance: number,
    runnerCount: number,
}
