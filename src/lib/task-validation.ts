export const taskStatuses = ["To do", "In progress", "Blocked", "Done"] as const;
export const taskPriorities = ["Low", "Medium", "High", "Critical"] as const;
export const taskAreas = [
  "Content & Forms", "Product Search", "Product Catalog", "Customer Accounts",
  "Ordering", "Integrations", "SEO", "Parking Lot",
] as const;

export type TaskInput = {
  title: string;
  description: string;
  expectedResult: string;
  area: string;
  priority: string;
  status: string;
  assignee: string;
  dueDate: string;
  jiraKey: string;
  platform: string;
  browser: string;
  reviewerEmail: string;
  rootCause: string;
};

export function parseTaskInput(value: unknown): TaskInput | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const raw = value as Record<string, unknown>;
  const keys = [
    "title", "description", "expectedResult", "area", "priority",
    "status", "assignee", "dueDate", "jiraKey", "platform", "browser",
    "reviewerEmail", "rootCause",
  ] as const;
  if (keys.some((key) => typeof raw[key] !== "string")) return null;
  const data = Object.fromEntries(keys.map((key) => [key, raw[key]])) as TaskInput;
  data.title = data.title.trim();
  data.jiraKey = data.jiraKey.trim().toUpperCase();
  if (!data.title || data.title.length > 160 || data.expectedResult.length > 255) return null;
  if (!taskAreas.includes(data.area as typeof taskAreas[number])) return null;
  if (!taskPriorities.includes(data.priority as typeof taskPriorities[number])) return null;
  if (!taskStatuses.includes(data.status as typeof taskStatuses[number])) return null;
  if (!["dan.collins@clarkwire.com", "shane.collins@clarkwire.com"].includes(data.reviewerEmail)) return null;
  if (data.rootCause.length > 10000) return null;
  if (data.dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(data.dueDate)) return null;
  if (data.jiraKey && !/^[A-Z][A-Z0-9]+-[0-9]+$/.test(data.jiraKey)) return null;
  if (["description", "assignee", "platform", "browser"].some((key) => (data[key as keyof TaskInput] as string).length > 10000)) return null;
  return data;
}
