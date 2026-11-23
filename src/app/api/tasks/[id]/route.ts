import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseTaskInput } from "@/lib/task-validation";
import { authorizedWorkspaceUser } from "@/lib/reviewers";

export const runtime = "nodejs";
const workspaceId = "clark";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const actor = await authorizedWorkspaceUser();
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await context.params;
  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const data = parseTaskInput(body);
  if (!data) return NextResponse.json({ error: "Invalid task fields" }, { status: 400 });
  try {
    const existing = await prisma.task.findFirst({ where: { id, workspaceId } });
    if (!existing) return NextResponse.json({ error: "Task not found" }, { status: 404 });
    if (!actor.isAdmin && existing.createdBy !== actor.userId) return NextResponse.json({ error: "Only the creator or UAT administrator may edit this task" }, { status: 403 });
    if (!actor.isAdmin && existing.approvalStatus === "Approved") return NextResponse.json({ error: "Approved tasks are locked for testers" }, { status: 403 });
    if (!actor.isAdmin && data.reviewerEmail !== "dan.collins@clarkwire.com") return NextResponse.json({ error: "Only the UAT administrator may change the reviewer" }, { status: 403 });
    if (data.status === "Done" && existing.approvalStatus !== "Approved") {
      return NextResponse.json({ error: "Approve the task before marking it complete" }, { status: 409 });
    }
    const resetApproval = existing.approvalStatus === "Changes Requested" || existing.reviewerEmail !== data.reviewerEmail ||
      existing.title !== data.title || existing.description !== data.description ||
      existing.expectedResult !== data.expectedResult ||
      existing.acceptanceCriteria !== data.acceptanceCriteria;
    const updated = await prisma.task.updateMany({
      where: { id, workspaceId, updatedAt: existing.updatedAt },
      data: {
        ...data,
        reviewerEmail: actor.isAdmin ? data.reviewerEmail : "dan.collins@clarkwire.com",
        ...(resetApproval ? {
          approvalStatus: "Pending Approval", reviewedBy: "", reviewedAt: null, reviewComment: "", checklistProgress: "[]",
          status: data.status === "Done" ? "To do" : data.status,
        } : {}),
      },
    });
    if (!updated.count) return NextResponse.json({ error: "Task changed; refresh and retry" }, { status: 409 });
    return NextResponse.json(await prisma.task.findFirst({ where: { id, workspaceId } }));
  } catch {
    return NextResponse.json({ error: "Unable to update task" }, { status: 500 });
  }
}
