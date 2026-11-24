import { auth, currentUser } from "@clerk/nextjs/server";

import { adminEmail, mikeEmail, shaneEmail } from "./reviewer-roles";

// Configure additional testers in UAT_TESTER_EMAILS (comma-separated).
// Never authorize a user based on a client-supplied email or display name.
export async function authorizedWorkspaceUser() {
  const { userId } = await auth();
  if (!userId) return null;
  const user = await currentUser();
  const allowed = new Set([
    adminEmail,
    shaneEmail,
    mikeEmail,
    ...(process.env.UAT_TESTER_EMAILS || "").split(",").map((email) => email.trim().toLowerCase()).filter(Boolean),
  ]);
  const email = user?.emailAddresses.find((item) =>
    item.verification?.status === "verified" && allowed.has(item.emailAddress.toLowerCase())
  )?.emailAddress.toLowerCase();
  if (!email) return null;
  return { userId, email, isAdmin: email === adminEmail };
}

// Legacy export for any remaining callers; authorization is shared with the workspace.
export const authorizedReviewer = authorizedWorkspaceUser;
