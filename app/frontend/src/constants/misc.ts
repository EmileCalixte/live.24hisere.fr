export const HOUR_IN_MS = 60 * 60 * 1000;

export const NO_VALUE_PLACEHOLDER = "–";

export const NUMERIC_REGEX = /^\d*$/;

// 31-01-1970
export const DD_MM_YYYY_REGEX = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;
export const DD_MM_YYYY_NON_STRICT_REGEX = /^\d{2}-\d{2}-\d{4}$/;

// 31/01/1970
export const DD_SLASH_MM_SLASH_YYYY_REGEX = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
export const DD_SLASH_MM_SLASH_YYYY_NON_STRICT_REGEX = /^\d{2}\/\d{2}\/\d{4}$/;

// 1970-01-31
export const YYYY_MM_DD_REGEX = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
export const YYYY_MM_DD_NON_STRICT_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export const YYYY_REGEX = /^\d{4}$/;
