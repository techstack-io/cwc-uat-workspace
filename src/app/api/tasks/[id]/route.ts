import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseTaskInput } from "@/lib/task-validation";

export const runtime = "nodejs";
const workspaceId = "clark";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const data = parseTaskInput(body);
  if (!data) return NextResponse.json({ error: "Invalid task fields" }, { status: 400 });
  try {
    const result = await prisma.task.updateMany({
      where: { id, workspaceId, createdBy: userId },
      data,
    });
    if (!result.count) return NextResponse.json({ error: "Task not found" }, { status: 404 });
    const task = await prisma.task.findFirst({ where: { id, workspaceId, createdBy: userId } });
    return NextResponse.json(task);
  } catch {
    return NextResponse.json({ error: "Unable to update task" }, { status: 500 });
  }
}
