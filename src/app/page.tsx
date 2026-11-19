
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

const steps = [
  "Submit feedback",
  "Extract issues",
  "Review",
  "Create Jira tickets",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-[#244855]">
      {/* Header and hero */}
      <div className="bg-[linear-gradient(115deg,#FFFCF8_0%,#FFFFFF_55%,#FFFFFF_100%)]">
        {/* Navigation */}
        <header className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#244855] text-white shadow-sm">
              <ClipboardCheck size={24} />
            </span>

            <span>
              <strong className="block text-xl font-bold tracking-tight">
                UAT Workspace
              </strong>

              <small className="block text-xs text-[#874F41]">
                Clark Wire & Cable
              </small>
            </span>
          </Link>

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-8 text-sm font-semibold md:flex"
          >
            <a
              href="#features"
              className="transition-colors hover:text-[#E64833]"
            >
              Features
            </a>

            <a
              href="#how"
              className="transition-colors hover:text-[#E64833]"
            >
              How It Works
            </a>

            <a
              href="#security"
              className="transition-colors hover:text-[#E64833]"
            >
              Security
            </a>
          </nav>

          <Link
            href="/workspace"
            className="rounded-xl bg-[#E64833] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#C83B29]"
          >
            Open demo
          </Link>
        </header>

        {/* Hero */}
        <section className="mx-auto grid max-w-7xl items-start gap-12 px-6 pb-24 pt-10 lg:grid-cols-2 lg:gap-16 lg:pt-16">
          {/* Hero copy */}
          <div>
            <p className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#FBE9D0] bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#244855]">
              <Sparkles size={15} className="text-[#E64833]" />
              AI-powered UAT
            </p>
     
            <h1
              className="max-w-2xl text-4xl font-normal tracking-tight md:text-5xl"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                lineHeight: 1.13,
              }}
            >
              Turn UAT feedback
              <span className="mt-4 block text-[#E64833]">
                into Jira tickets.
              </span>
            </h1>


            <p className="mt-8 max-w-xl text-lg leading-relaxed text-[#244855]/80 md:text-xl">
              Describe what you found in plain English.
              AI extracts, organizes, and prepares software
              defects for review and Jira submission.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/workspace"
                className="inline-flex items-center gap-3 rounded-xl bg-[#E64833] px-7 py-4 font-semibold text-white shadow-lg shadow-[#E64833]/15 transition-all hover:-translate-y-0.5 hover:bg-[#C83B29]"
              >
                Try workspace
                <ArrowRight size={18} />
              </Link>

              <a
                href="#how"
                className="inline-flex items-center rounded-xl border border-[#90AEAD]/60 bg-white px-7 py-4 font-semibold text-[#244855] shadow-sm transition-colors hover:bg-[#FBE9D0]/40"
              >
                See how it works
              </a>
            </div>

            <div className="mt-10 flex items-center gap-2 text-sm text-[#244855]/70">
              <ShieldCheck size={18} className="text-[#90AEAD]" />
              Human-reviewed issue creation
            </div>
          </div>

          {/* Workspace preview */}
          <div className="rounded-3xl border border-[#90AEAD]/35 bg-white p-5 shadow-xl shadow-[#244855]/10 sm:p-7">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-[#874F41]">
                  Workspace preview
                </p>

                <h2 className="text-xl font-bold">
                  New UAT Submission
                </h2>
              </div>

              <span className="rounded-full bg-[#FBE9D0] px-3 py-1 text-xs font-semibold text-[#874F41]">
                Demo
              </span>
            </div>

            {/* Original feedback */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-[#244855]">
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

            {/* Illustrative extraction action */}
            <div className="my-6 flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-xl bg-[#E64833] px-6 py-3 text-sm font-semibold text-white shadow-sm">
                <Sparkles size={17} />
                Extract Issues with AI
              </span>
            </div>

            {/* Proposed issues */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="font-bold">
                  Proposed Issues (3)
                </h3>

                <span className="text-xs font-medium text-[#244855]">
                  Ready for review
                </span>
              </div>

              {proposedIssues.map((issue) => (
                <div
                  key={issue}
                  className="flex items-start gap-3 border-t border-slate-100 py-3 text-sm"
                >
                  <span className="mt-0.5 text-[#90AEAD]">
                    <Check size={17} strokeWidth={2.5} />
                  </span>

                  <span className="rounded-md bg-[#FBE9D0] px-2 py-0.5 text-xs font-medium text-[#874F41]">
                    Bug
                  </span>

                  <span className="flex-1 text-[#244855]">
                    {issue}
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-4 text-right text-xs text-slate-400">
              Illustrative preview
            </p>
          </div>
        </section>
      </div>

      {/* Features */}
      <section
        id="features"
        className="mx-auto max-w-7xl px-6 py-24"
      >
        <div className="mb-12">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#874F41]">
            Capabilities
          </p>

          <h2 className="text-3xl font-bold tracking-tight">
            A simpler way to manage UAT
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map(({ Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl border border-[#90AEAD]/30 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FBE9D0]/70 text-[#874F41]">
                <Icon size={25} />
              </div>

              <h3 className="mb-3 text-lg font-bold">
                {title}
              </h3>

              <p className="text-sm leading-relaxed text-[#244855]/75">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how"
        className="bg-[linear-gradient(110deg,#FFF8EF_0%,#FFFFFF_75%)] px-6 py-24"
      >
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#874F41]">
            Workflow
          </p>

          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            From observations to actionable defects
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-[#244855]/75">
            Turn unstructured testing feedback into organized,
            reviewable issues through a straightforward workflow.
          </p>

          <div className="mt-12 grid gap-4 md:grid-cols-4">
            {steps.map((step, index) => (
              <div
                key={step}
                className="rounded-2xl border border-[#90AEAD]/35 bg-white p-6 shadow-sm"
              >
                <span
                  className={`mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white ${
                    index % 2 === 0
                      ? "bg-[#244855]"
                      : "bg-[#E64833]"
                  }`}
                >
                  {index + 1}
                </span>

                <p className="font-semibold">
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
        <div className="flex items-start gap-5 rounded-2xl border border-[#90AEAD]/35 bg-[#FBE9D0]/30 p-6 sm:p-8">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#244855]">
            <ShieldCheck size={26} />
          </div>

          <div>
            <h2 className="mb-2 text-lg font-bold">
              Human oversight by design
            </h2>

            <p className="leading-relaxed text-[#244855]/75">
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
