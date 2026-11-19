"use client";

import Link from "next/link";
import { SignedIn, SignedOut, SignOutButton } from "@clerk/nextjs";

export default function AuthNavigation() {
  return (
    <div className="flex items-center gap-3">
      <SignedOut>
        <Link href="/sign-in" className="rounded-xl bg-[#E64833] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#C83B29]">
          Log In
        </Link>
      </SignedOut>
      <SignedIn>
        <Link href="/workspace" className="rounded-xl bg-[#E64833] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#C83B29]">
          Open Workspace
        </Link>
        <SignOutButton redirectUrl="/">
          <button type="button" className="rounded-xl border border-[#90AEAD]/60 px-4 py-3 text-sm font-semibold text-[#244855] hover:bg-[#FBE9D0]/40">
            Log Out
          </button>
        </SignOutButton>
      </SignedIn>
    </div>
  );
}
