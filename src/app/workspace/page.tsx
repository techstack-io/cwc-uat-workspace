"use client";

import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import Image from "next/image";
import {
  ArrowRight, ClipboardCheck, FilePlus2, LayoutDashboard,
  ListChecks, Ticket, Clock3, CheckCircle2, LogOut,
  Database, ShieldCheck, Inbox, Settings2, Plug,
} from "lucide-react";

const nav = [
  { label: "Overview", href: "/workspace", Icon: LayoutDashboard, active: true },
  { label: "New Submission", href: "/workspace/new", Icon: FilePlus2, active: false },
];
const metrics = [
  { label: "Submissions", Icon: ClipboardCheck },
  { label: "Pending Review", Icon: Clock3 },
  { label: "Approved Issues", Icon: CheckCircle2 },
  { label: "Jira Tickets", Icon: Ticket },
];

export default function WorkspaceDashboard() {
  return (
    <main className="min-h-screen bg-[#F5F7F8] text-[#244855]">
      <header className="border-b border-[#DCE5E6] bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5">
                    <Link href="/" className="flex items-center">
          <Image
            src="/uat-logo.png"
            alt="UAT Workspace"
            width={280}
            height={80}
            className="h-auto w-[220px] sm:w-[300px] xl:w-[350px]"
            priority
          />
        </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-xs font-semibold uppercase tracking-widest text-[#64748B] sm:inline">Administrator workspace</span>
            <SignOutButton redirectUrl="/">
              <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-[#DCE5E6] px-4 py-2 text-sm font-semibold hover:bg-[#F5F7F8]"><LogOut size={16}/> Log Out</button>
            </SignOutButton>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-[220px_minmax(0,1fr)]">
        <aside
          className="self-start md:sticky md:top-6"
          aria-label="Workspace navigation"
        >
          <div className="rounded-2xl border border-[#DCE5E6] bg-white p-3 shadow-sm">

            {/* Project identity */}
            <div className="flex items-center gap-3 px-3 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#244855] text-white">
                <ClipboardCheck size={20} />
              </div>

              <div>
                <p className="text-sm font-bold">Clark UAT</p>
                <p className="text-xs text-[#64748B]">
                  Znode 10 Upgrade
                </p>
              </div>
            </div>

            <div className="my-3 border-t border-[#E5ECEE]" />

            {/* Workspace navigation */}
            <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#874F41]">
              Workspace
            </p>

            {nav.map(({ label, href, Icon, active }) => (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-[#E5EEEE] text-[#244855]"
                    : "text-[#64748B] hover:bg-[#F5F7F8] hover:text-[#244855]"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}

            <div className="my-4 border-t border-[#E5ECEE]" />

            {/* Future issue management */}
            <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#874F41]">
              Issue Management
            </p>

            {[
              { label: "Submissions", Icon: Inbox },
              { label: "Review Queue", Icon: ListChecks },
              { label: "Support Tickets", Icon: Ticket },
            ].map(({ label, Icon }) => (
              <div
                key={label}
                aria-disabled="true"
                className="flex items-center justify-between gap-2 rounded-xl px-3 py-3 text-sm text-[#94A3B8]"
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} />
                  <span>{label}</span>
                </div>
                <span className="text-[10px]">Soon</span>
              </div>
            ))}

            <div className="my-4 border-t border-[#E5ECEE]" />

            {/* Administration */}
            <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#874F41]">
              Administration
            </p>

            {[
              { label: "Settings", Icon: Settings2 },
              { label: "Integrations", Icon: Plug },
            ].map(({ label, Icon }) => (
              <div
                key={label}
                aria-disabled="true"
                className="flex items-center justify-between gap-2 rounded-xl px-3 py-3 text-sm text-[#94A3B8]"
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} />
                  <span>{label}</span>
                </div>
                <span className="text-[10px]">Soon</span>
              </div>
            ))}

          </div>
        </aside>

        <section className="min-w-0 space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#874F41]">Znode 10 upgrade · UAT</p>
              <h1 className="text-3xl font-light tracking-tight md:text-[30px]">Dashboard Overview</h1>
              <p className="mt-3 text-[#64748B]">Organize findings and prepare structured issues for Jira review.</p>
            </div>
            <Link href="/workspace/new" className="inline-flex items-center gap-2 rounded-xl bg-[#E64833] px-5 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#C83B29]">
              <FilePlus2 size={18}/> New UAT Submission
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map(({label,Icon}) => (
              <div key={label} className="rounded-2xl border border-[#DCE5E6] bg-white p-5 shadow-sm">
                <Icon size={23} className="mb-5 text-[#E64833]"/>
                <p className="text-sm font-medium text-[#64748B]">{label}</p>
                <p className="mt-2 text-3xl font-semibold">—</p>
                <p className="mt-2 text-xs text-[#94A3B8]">Not connected</p>
              </div>
            ))}
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
            <div className="rounded-2xl border border-[#DCE5E6] bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-[#874F41]">Quick action</p>
              <h2 className="mt-3 text-xl font-semibold">Start a new UAT submission</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#64748B]">Describe issues in plain English. For now, the submission screen provides an editable local preview; the Jira-ready field format will be defined separately.</p>
              <Link href="/workspace/new" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#E64833] px-5 py-3 text-sm font-bold text-white hover:bg-[#C83B29]">New UAT Submission <ArrowRight size={17}/></Link>
            </div>
            <div className="rounded-2xl border border-[#DCE5E6] bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Workflow</h2>
              <div className="mt-5 space-y-4">
                {[["1","Describe findings"],["2","Review extracted issues"],["3","Prepare Jira-ready output"]].map(([step,label]) => (
                  <div key={step} className="flex items-center gap-3 text-sm"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FBE9D0] font-bold text-[#874F41]">{step}</span>{label}</div>
                ))}
              </div>
              <p className="mt-5 text-xs text-[#64748B]">Structured extraction and Jira export are planned, not yet active.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#DCE5E6] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3"><Database size={20} className="text-[#90AEAD]"/><h2 className="text-lg font-semibold">Recent Submissions</h2></div>
            <div className="mt-6 flex flex-col items-center rounded-xl border border-dashed border-[#DCE5E6] px-6 py-10 text-center">
              <ListChecks size={30} className="text-[#90AEAD]"/>
              <p className="mt-3 font-semibold">No saved submissions yet</p>
              <p className="mt-2 max-w-md text-sm text-[#64748B]">Submission history will appear here after database persistence is implemented. The current preview is not saved.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
