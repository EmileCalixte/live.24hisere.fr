import { objectUtils } from "@live24hisere/utils";
import { prefixNumber } from "./utils";

const formatMsAsDurationDefaultOptions = {
  forceDisplayHours: true,
  hoursSuffix: ":",
  minutesSuffix: ":",
  secondsSuffix: "",
};

const LAP_DURATION_SUFFIXES = {
  hoursSuffix: "h\xa0",
  minutesSuffix: "m\xa0",
  secondsSuffix: "s",
};

export function formatMsAsDuration(ms: number, options: Partial<typeof formatMsAsDurationDefaultOptions> = {}): string {
  const opt = objectUtils.assignDefined(formatMsAsDurationDefaultOptions, options);

  if (ms < 0) {
    return "−" + formatMsAsDuration((ms - 1000) * -1, opt);
  }

  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor(ms / (1000 * 60 * 60));

  const stringSeconds = prefixNumber(seconds, 2);
  const stringMinutes = prefixNumber(minutes, 2);
  const stringHours = prefixNumber(hours, 2);

  const minutesSeconds = `${stringMinutes}${opt.minutesSuffix}${stringSeconds}${opt.secondsSuffix}`;

  if (!opt.forceDisplayHours && hours === 0) {
    return minutesSeconds.trim();
  }

  return `${stringHours}${opt.hoursSuffix}${minutesSeconds}`.trim();
}

export function formatMsDurationHms(ms: number): string {
  return formatMsAsDuration(ms, { forceDisplayHours: false, ...LAP_DURATION_SUFFIXES });
}
