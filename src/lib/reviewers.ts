import { auth, currentUser } from "@clerk/nextjs/server";

export const reviewers = [
  { name: "Dan", email: "dan.collins@clarkwire.com" },
  { name: "Shane", email: "shane.collins@clarkwire.com" },
] as const;

export async function authorizedReviewer() {
  const { userId } = await auth();
  if (!userId) return null;
  const user = await currentUser();
  const email = user?.emailAddresses.find((item) =>
    item.verification?.status === "verified" &&
    reviewers.some((reviewer) => reviewer.email === item.emailAddress.toLowerCase())
  )?.emailAddress.toLowerCase();
  return email ? { userId, email } : null;
}
