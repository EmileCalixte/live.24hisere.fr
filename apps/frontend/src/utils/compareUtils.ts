import {typeUtils} from "@live24hisere/utils";

type Comparable = string | number | bigint | boolean | Date | null | undefined;

type SpaceshipResult = -1 | 0 | 1;

/**
 * Performs a three-way comparison between two values
 * @param a
 * @param b
 * @return {SpaceshipResult} -1 if `a` is greater than `b`, 1 if `b` is greater than `a`, 0 in other cases
 */
export function spaceship(a: Comparable, b: Comparable): SpaceshipResult {
    if (typeUtils.isNullOrUndefined(a) && typeUtils.isNullOrUndefined(b)) {
        return 0;
    }

    if (typeUtils.isNullOrUndefined(a)) {
        return -1;
    }

    if (typeUtils.isNullOrUndefined(b)) {
        return 1;
    }

    if (a > b) {
        return 1;
    }

    if (a < b) {
        return -1;
    }

    return 0;
}
