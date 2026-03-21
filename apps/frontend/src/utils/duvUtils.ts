/**
 * @param id The ID of the runner on DUV
 */
export function getDuvRunnerUrl(id: string): string {
  return `https://statistik.d-u-v.org/getresultperson.php?runner=${id}`;
}
