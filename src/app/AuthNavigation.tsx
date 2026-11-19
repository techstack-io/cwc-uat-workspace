
"use client";

import Link from "next/link";
import { Show, SignOutButton } from "@clerk/nextjs";

export default function AuthNavigation() {
  return (
    <div className="flex items-center gap-3">
      <Show when="signed-out">
        <Link
          href="/sign-in"
          className="rounded-xl bg-[#E64833] px-5 py-3 text-sm font-semibold text-white"
        >
          Log In
        </Link>
      </Show>

      <Show when="signed-in">
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
      </Show>
    </div>
  );
}

