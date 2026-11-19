"use client";

import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import { useState } from "react";
import { ArrowLeft, ClipboardCheck, Copy, Sparkles } from "lucide-react";

const sample = `Banner All –
- Rotation not active
- Click and slide not active

Banner 1 –
- Letters don’t match, Bold vs Non
- Underline added
- Links font different
- Symbols missing from links
- Image is too dark
- Picture cut at bottom`;

export default function NewSubmission() {
  const [input, setInput] = useState(sample);
  const [issues, setIssues] = useState<string[]>([]);
  return (
    <main className="min-h-screen bg-[#F5F7F8] text-[#244855]">
      <header className="border-b border-[#DCE5E6] bg-white px-6 py-5">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <Link href="/workspace" className="flex items-center gap-2 font-bold"><ClipboardCheck className="text-[#E64833]"/> UAT Workspace</Link>
          <div className="flex items-center gap-4">
            <Link href="/workspace" className="inline-flex items-center gap-2 text-sm font-semibold"><ArrowLeft size={16}/> Dashboard</Link>
            <SignOutButton redirectUrl="/"><button type="button" className="rounded-lg border px-3 py-2 text-sm font-semibold">Log Out</button></SignOutButton>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-4xl space-y-7 px-6 py-12">
        <p className="text-xs font-bold uppercase tracking-widest text-[#874F41]">Clark UAT · Submission workspace</p>
        <h1 className="text-3xl font-semibold">New UAT Submission</h1>
        <p className="text-[#64748B]">Enter your findings. This initial version extracts bullet points locally; AI extraction, saved submissions, and Jira formatting will be added later.</p>
        <div className="rounded-2xl border border-[#DCE5E6] bg-white p-6">
          <label className="mb-3 block font-bold" htmlFor="feedback">Describe what you found</label>
          <textarea id="feedback" className="h-72 w-full rounded-xl border border-[#DCE5E6] p-4" value={input} onChange={e => setInput(e.target.value)}/>
          <button type="button" onClick={() => setIssues(input.split("\n").map(s => s.trim()).filter(s => s.startsWith("-")).map(s => s.replace(/^-\s*/, "")))} className="mt-4 flex items-center gap-2 rounded-xl bg-[#E64833] px-6 py-3 font-bold text-white hover:bg-[#C83B29]"><Sparkles size={18}/> Preview extracted issues</button>
        </div>
        {issues.length > 0 && (
          <div className="rounded-2xl border border-[#DCE5E6] bg-white p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-bold">Proposed issues ({issues.length})</h2>
              <button type="button" onClick={() => navigator.clipboard.writeText(JSON.stringify(issues, null, 2))} className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"><Copy size={16}/> Copy JSON</button>
            </div>
            {issues.map((issue, i) => (
              <div key={i} className="mb-3 rounded-xl border p-4">
                <label htmlFor={`issue-${i}`} className="mb-1 block text-xs font-bold text-[#64748B]">ISSUE {i + 1}</label>
                <input id={`issue-${i}`} className="w-full rounded-lg border px-3 py-2" value={issue} onChange={e => setIssues(current => current.map((value, index) => index === i ? e.target.value : value))}/>
              </div>
            ))}
            <p className="text-sm text-[#64748B]">Preview only. Issues are not saved or submitted to Jira.</p>
          </div>
        )}
      </div>
    </main>
  );
}
