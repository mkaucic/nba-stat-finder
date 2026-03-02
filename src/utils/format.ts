import type { ColumnType } from "../types/stats";

export function formatVal(val: unknown, type: ColumnType): string {
  if (val === null || val === undefined || val === "") return "—";

  if (type === "percent") {
    const n = parseFloat(String(val));
    if (isNaN(n)) return String(val);
    return (n <= 1 ? n * 100 : n).toFixed(1) + "%";
  }

  if (type === "date") return String(val).slice(0, 10);

  if (type === "number") {
    const n = parseFloat(String(val));
    if (isNaN(n)) return String(val);
    return n % 1 === 0 ? String(n) : n.toFixed(1);
  }

  return String(val);
}

export function passesFilter(
  rowVal: unknown,
  filterVal: string,
  type: ColumnType,
  mode: "gte" | "lte" | "exact"
): boolean {
  if (filterVal === "" || filterVal == null) return true;

  if (type === "text") {
    return String(rowVal ?? "").toLowerCase().includes(filterVal.toLowerCase());
  }

  const rv = parseFloat(String(rowVal));
  const fv = parseFloat(filterVal);
  if (isNaN(rv) || isNaN(fv)) return false;

  // percent columns: user enters 0–100, data stored 0–1
  const adjFv = type === "percent" && fv > 1 ? fv / 100 : fv;

  if (mode === "exact") return Math.abs(rv - adjFv) <= 0.001;
  if (mode === "gte")   return rv >= adjFv;
  if (mode === "lte")   return rv <= adjFv;
  return true;
}