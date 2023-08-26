export function isNullOrUndefinedOrString(
  value: any
): value is null | undefined | string {
  return (
    value === null || typeof value === "undefined" || typeof value === "string"
  );
}

export function isStringOrUndefined(value: any): value is undefined | string {
  return typeof value === "undefined" || typeof value === "string";
}

export function isBooleanOrUndefined(value: any): value is undefined | boolean {
  return typeof value === "undefined" || typeof value === "boolean";
}

export function isDateStringOrUndefined(
  value: any
): value is string | undefined {
  return (
    typeof value === "undefined" ||
    (typeof value === "string" && !isNaN(Date.parse(value)))
  );
}
