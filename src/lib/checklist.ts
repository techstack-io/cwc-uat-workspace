export type Verification = { index: number; by: string; at: string };
export function checklistLines(criteria: string) {
  return criteria.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}
export function readProgress(raw: string): Verification[] {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is Verification =>
      item !== null && typeof item === "object" &&
      Number.isInteger(item.index) && typeof item.by === "string" && typeof item.at === "string");
  } catch { return []; }
}
