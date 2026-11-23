import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizedWorkspaceUser } from "@/lib/reviewers";
import { checklistLines, readProgress } from "@/lib/checklist";

export const runtime = "nodejs";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const actor = await authorizedWorkspaceUser();
  if (!actor?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await context.params;
  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid decision" }, { status: 400 });
  }
  const { decision, comment, criteriaReviewed } = body as Record<string, unknown>;
  if (!["Approved", "Changes Requested"].includes(String(decision)) || typeof comment !== "string" || comment.length > 2000) {
    return NextResponse.json({ error: "Invalid review fields" }, { status: 400 });
  }
  if (decision === "Approved" && criteriaReviewed !== true) {
    return NextResponse.json({ error: "Confirm you reviewed the task details and acceptance criteria" }, { status: 400 });
  }
  if (decision === "Changes Requested" && !comment.trim()) {
    return NextResponse.json({ error: "Please explain the requested changes" }, { status: 400 });
  }
  const task = await prisma.task.findFirst({ where: { id, workspaceId: "clark", reviewerEmail: actor.email, approvalStatus: "Pending Approval", archivedAt: null } });
  if (!task) return NextResponse.json({ error: "Task is not pending your review" }, { status: 409 });
  if (decision === "Approved") {
    const items = checklistLines(task.acceptanceCriteria);
    const verified = new Set(readProgress(task.checklistProgress).filter((item) => item.by === actor.email).map((item) => item.index));
    if (!items.length || items.some((_, index) => !verified.has(index))) {
      return NextResponse.json({ error: "Verify every acceptance criterion before approving" }, { status: 409 });
    }
  }
  const updated = await prisma.task.updateMany({
    where: { id, workspaceId: "clark", reviewerEmail: actor.email, approvalStatus: "Pending Approval", archivedAt: null, updatedAt: task.updatedAt },
    data: { approvalStatus: decision as string, reviewedBy: actor.email, reviewedAt: new Date(), reviewComment: comment.trim() },
  });
  if (!updated.count) return NextResponse.json({ error: "Task is not pending your review" }, { status: 409 });
  return NextResponse.json(await prisma.task.findFirst({ where: { id, workspaceId: "clark" } }));
}
