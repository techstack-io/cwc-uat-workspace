import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizedWorkspaceUser } from "@/lib/reviewers";

export const runtime = "nodejs";
const workspaceId = "clark";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const actor = await authorizedWorkspaceUser();
  if (!actor?.isAdmin) return NextResponse.json({ error: "Only the administrator can archive or restore tasks" }, { status: 403 });
  const { id } = await context.params;
  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body || typeof body !== "object" || !("action" in body) || !["archive", "restore"].includes(String(body.action))) {
    return NextResponse.json({ error: "Invalid archive action" }, { status: 400 });
  }
  const action = (body as { action: "archive" | "restore" }).action;
  try {
    const existing = await prisma.task.findFirst({ where: { id, workspaceId } });
    if (!existing) return NextResponse.json({ error: "Task not found" }, { status: 404 });
    if (action === "archive" && existing.archivedAt || action === "restore" && !existing.archivedAt) {
      return NextResponse.json({ error: "Task archive state has changed; refresh and retry" }, { status: 409 });
    }
    const changed = await prisma.task.updateMany({
      where: { id, workspaceId, updatedAt: existing.updatedAt },
      data: { archivedAt: action === "archive" ? new Date() : null, archivedBy: action === "archive" ? actor.email : "" },
    });
    if (!changed.count) return NextResponse.json({ error: "Task changed; refresh and retry" }, { status: 409 });
    return NextResponse.json(await prisma.task.findFirst({ where: { id, workspaceId } }), { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Unable to update archive state" }, { status: 500 });
  }
}
