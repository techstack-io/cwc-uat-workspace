"use client";

import Link from "next/link";
import { SignOutButton, useAuth } from "@clerk/nextjs";

export default function AuthNavigation() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return (
      <Link
        href="/sign-in"
        className="rounded-xl bg-[#E64833] px-5 py-3 text-sm font-semibold text-white"
      >
        Log In
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/workspace"
        className="rounded-xl bg-[#E64833] px-5 py-3 text-sm font-semibold text-white"
      >
        Open Workspace
      </Link>

      <SignOutButton redirectUrl="/">
        <button
          type="button"
          className="rounded-xl border px-4 py-3 text-sm font-semibold"
        >
          Log Out
        </button>
      </SignOutButton>
    </div>
  );
}
