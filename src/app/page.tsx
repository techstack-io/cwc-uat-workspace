
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ClipboardCheck,
  Layers3,
  ShieldCheck,
  Sparkles,
  TicketCheck,
  Users,
} from "lucide-react";

const features = [
  {
    Icon: Sparkles,
    title: "Use natural language",
    text: "Paste observations—no special format required.",
  },
  {
    Icon: Layers3,
    title: "AI-powered extraction",
    text: "Organize observations into proposed defects.",
  },
  {
    Icon: Users,
    title: "Review and refine",
    text: "Edit, merge, or reject proposed issues.",
  },
  {
    Icon: TicketCheck,
    title: "Create Jira tickets",
    text: "Send approved issues to Jira once integrated.",
  },
];

const proposedIssues = [
  "Banner rotation not active",
  "Banner text formatting is inconsistent",
  "Banner image is too dark and cropped",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Header and Hero */}
      <div className="relative isolate overflow-hidden bg-gradient-to-br from-white via-teal-50/60 to-emerald-100/70">
        {/* Decorative background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 top-20 -z-10 h-[500px] w-[500px] rounded-full bg-teal-200/30 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-44 -left-24 -z-10 h-[380px] w-[700px] rounded-[50%] bg-emerald-200/40 blur-3xl"
        />

        {/* Navigation */}
        <header className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-6">
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-700 text-white shadow-md shadow-teal-900/10">
              <ClipboardCheck size={24} />
            </span>

            <span>
              <strong className="block text-xl font-bold tracking-tight">
                UAT Workspace
              </strong>

              <small className="block text-xs text-slate-500">
                Clark Wire & Cable
              </small>
            </span>
          </Link>

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-8 text-sm font-semibold text-slate-700 md:flex"
          >
            <a
              href="#features"
              className="transition-colors hover:text-teal-700"
            >
              Features
            </a>

            <a
              href="#how"
              className="transition-colors hover:text-teal-700"
            >
              How It Works
            </a>

            <a
              href="#security"
              className="transition-colors hover:text-teal-700"
            >
              Security
            </a>
          </nav>

          <Link
            href="/workspace"
            className="rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-800"
          >
            Open demo
          </Link>
        </header>

        {/* Hero */}
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-28 pt-16 lg:grid-cols-2 lg:gap-16 lg:pt-24">
          {/* Hero content */}
          <div>
            <p className="mb-7 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
              <Sparkles size={15} />
              AI-powered UAT
            </p>

            <h1
              className="max-w-2xl text-5xl text-[#D97706] font-bold leading-[1.08] tracking-tight text-slate-950 md:text-6xl"
              style={{
                fontFamily: "var(--font-space-grotesk)",
              }}
            >
              Turn UAT feedback
              <span className="block text-teal-700">
                into Jira tickets.
              </span>
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-relaxed text-slate-600 md:text-xl">
              Describe what you found in plain English.
              AI extracts, organizes, and prepares software
              defects for review and Jira submission.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/workspace"
                className="inline-flex items-center gap-3 rounded-xl bg-teal-700 px-7 py-4 font-semibold text-white shadow-lg shadow-teal-900/10 transition-all hover:-translate-y-0.5 hover:bg-teal-800"
              >
                Try workspace
                <ArrowRight size={18} />
              </Link>

              <a
                href="#how"
                className="inline-flex items-center rounded-xl border border-teal-100 bg-white px-7 py-4 font-semibold text-slate-800 shadow-sm transition-colors hover:bg-teal-50"
              >
                See how it works
              </a>
            </div>

            <div className="mt-10 flex items-center gap-2 text-sm text-slate-500">
              <ShieldCheck
                size={18}
                className="text-teal-700"
              />
              Human-reviewed issue creation
            </div>
          </div>

          {/* Submission preview */}
          <div className="rounded-3xl border border-teal-100 bg-white/95 p-5 shadow-2xl shadow-teal-900/10 backdrop-blur-sm sm:p-7">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-teal-700">
                  Workspace preview
                </p>

                <h2 className="text-xl font-bold text-slate-900">
                  New UAT Submission
                </h2>
              </div>

              <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                Demo
              </span>
            </div>

            {/* Original feedback */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700">
              <p>
                Banner All – Rotation not active.
                Click and slide not active.
              </p>

              <p className="mt-3">
                Banner 1 – Letters don&apos;t match,
                Bold vs Non. Underline added.
                Image is too dark. Picture cut at bottom.
              </p>
            </div>

            {/* Extraction preview */}
            <div className="my-6 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-teal-900/10">
                <Sparkles size={17} />
                Extract Issues with AI
              </div>
            </div>

            {/* Proposed issues */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="font-bold text-slate-900">
                  Proposed Issues (3)
                </h3>

                <span className="text-xs font-medium text-teal-700">
                  Ready for review
                </span>
              </div>

              <div>
                {proposedIssues.map((issue) => (
                  <div
                    key={issue}
                    className="flex items-start gap-3 border-t border-slate-100 py-3 text-sm"
                  >
                    <span className="mt-0.5 text-teal-600">
                      <Check size={17} strokeWidth={2.5} />
                    </span>

                    <span className="rounded-md bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
                      Bug
                    </span>

                    <span className="flex-1 text-slate-700">
                      {issue}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-4 text-right text-xs text-slate-400">
              Illustrative preview
            </p>
          </div>
        </section>

        {/* Bottom decorative accent */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 right-0 -z-10 h-20 bg-gradient-to-r from-teal-100/50 via-emerald-50/30 to-teal-200/40"
        />
      </div>

      {/* Features */}
      <section
        id="features"
        className="mx-auto max-w-7xl px-6 py-24"
      >
        <div className="mb-12">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
            Capabilities
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            A simpler way to manage UAT
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map(({ Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <Icon size={25} />
              </div>

              <h3 className="mb-3 text-lg font-bold text-slate-900">
                {title}
              </h3>

              <p className="text-sm leading-relaxed text-slate-600">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how"
        className="bg-teal-50/70 px-6 py-24"
      >
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
            Workflow
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            From observations to actionable defects
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-slate-600">
            Turn unstructured testing feedback into organized,
            reviewable issues through a straightforward workflow.
          </p>

          <div className="mt-12 grid gap-4 md:grid-cols-4">
            {[
              "Submit feedback",
              "Extract issues",
              "Review",
              "Create Jira tickets",
            ].map((step, index) => (
              <div
                key={step}
                className="rounded-2xl border border-teal-100 bg-white p-6 shadow-sm"
              >
                <span className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-teal-700 text-sm font-bold text-white">
                  {index + 1}
                </span>

                <p className="font-semibold text-slate-800">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section
        id="security"
        className="mx-auto max-w-5xl px-6 py-20"
      >
        <div className="flex items-start gap-5 rounded-2xl border border-teal-100 bg-teal-50/40 p-6 sm:p-8">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
            <ShieldCheck size={26} />
          </div>

          <div>
            <h2 className="mb-2 text-lg font-bold text-slate-900">
              Human oversight by design
            </h2>

            <p className="leading-relaxed text-slate-600">
              Human approval is required in the planned
              production workflow. Authentication and
              integrations are not yet enabled in this starter.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
