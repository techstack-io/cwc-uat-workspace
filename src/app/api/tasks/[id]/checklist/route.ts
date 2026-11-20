import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizedReviewer } from "@/lib/reviewers";

export const runtime = "nodejs";

type Verification = { index: number; by: string; at: string };
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

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const actor = await authorizedReviewer();
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await context.params;
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "Invalid verification" }, { status: 400 });
  const { index, verified } = body as Record<string, unknown>;
  if (!Number.isInteger(index) || typeof verified !== "boolean") return NextResponse.json({ error: "Invalid verification" }, { status: 400 });
  const task = await prisma.task.findFirst({ where: { id, workspaceId: "clark" } });
  if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });
  if (task.reviewerEmail !== actor.email || task.approvalStatus !== "Pending Approval") {
    return NextResponse.json({ error: "Task is not pending your review" }, { status: 403 });
  }
  const lines = checklistLines(task.acceptanceCriteria);
  const itemIndex = index as number;
  if (itemIndex < 0 || itemIndex >= lines.length) return NextResponse.json({ error: "Invalid checklist item" }, { status: 400 });
  const current = readProgress(task.checklistProgress);
  const next = current.filter((entry) => entry.index !== itemIndex);
  if (verified) next.push({ index: itemIndex, by: actor.email, at: new Date().toISOString() });
  const changed = await prisma.task.updateMany({
    where: { id, workspaceId: "clark", reviewerEmail: actor.email, approvalStatus: "Pending Approval", updatedAt: task.updatedAt },
    data: { checklistProgress: JSON.stringify(next) },
  });
  if (!changed.count) return NextResponse.json({ error: "Task changed; refresh and retry" }, { status: 409 });
  return NextResponse.json(await prisma.task.findFirst({ where: { id, workspaceId: "clark" } }));
}
