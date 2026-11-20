ALTER TABLE "Task"
  ADD COLUMN "reviewerEmail" TEXT NOT NULL DEFAULT 'dan.collins@clarkwire.com',
  ADD COLUMN "approvalStatus" TEXT NOT NULL DEFAULT 'Pending Approval',
  ADD COLUMN "reviewedBy" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "reviewedAt" TIMESTAMP(3),
  ADD COLUMN "reviewComment" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "rootCause" TEXT NOT NULL DEFAULT '';

CREATE INDEX "Task_reviewerEmail_idx" ON "Task"("reviewerEmail");
CREATE INDEX "Task_approvalStatus_idx" ON "Task"("approvalStatus");
