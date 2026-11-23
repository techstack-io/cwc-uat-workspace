import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseTaskInput } from "@/lib/task-validation";
import { authorizedWorkspaceUser } from "@/lib/reviewers";

export const runtime = "nodejs";
const workspaceId = "clark";

export async function GET() {
  const actor = await authorizedWorkspaceUser();
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const tasks = await prisma.task.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(tasks, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Unable to load tasks" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const actor = await authorizedWorkspaceUser();
  if (!actor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const data = parseTaskInput(body);
  if (!data) return NextResponse.json({ error: "Invalid task fields" }, { status: 400 });
  try {
    const task = await prisma.task.create({ data: { ...data, reviewerEmail: actor.isAdmin ? data.reviewerEmail : "dan.collins@clarkwire.com", workspaceId, createdBy: actor.userId, createdByEmail: actor.email } });
    return NextResponse.json(task, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to create task" }, { status: 500 });
  }
}
