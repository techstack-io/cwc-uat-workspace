ALTER TABLE "Task" ADD COLUMN "archivedAt" TIMESTAMP(3);
ALTER TABLE "Task" ADD COLUMN "archivedBy" TEXT NOT NULL DEFAULT '';
CREATE INDEX "Task_workspaceId_archivedAt_idx" ON "Task"("workspaceId", "archivedAt");
