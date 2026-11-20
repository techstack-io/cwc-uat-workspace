"use client";

import { useUser, SignOutButton } from "@clerk/nextjs";
import Image from "next/image";
import { Plus, LogOut, ClipboardCheck, LayoutDashboard, FilePlus2, ListChecks, Inbox, Ticket, Settings2, Plug } from "lucide-react";
import Link from "next/link";
import { type FormEvent, useEffect, useState } from "react";

const statuses = ["To do", "In progress", "Blocked", "Done"] as const;
const priorities = ["Low", "Medium", "High", "Critical"] as const;
const areas = [
  "Content & Forms", "Product Search", "Product Catalog", "Customer Accounts",
  "Ordering", "Integrations", "SEO", "Parking Lot",
] as const;

type TaskFields = {
  title: string;
  description: string;
  expectedResult: string;
  acceptanceCriteria: string;
  area: (typeof areas)[number];
  priority: (typeof priorities)[number];
  status: (typeof statuses)[number];
  assignee: string;
  dueDate: string;
  jiraKey: string;
  platform: string;
  browser: string;
  reviewerEmail: string;
  rootCause: string;
};
type Task = TaskFields & {
  id: string;
  createdBy: string;
  approvalStatus: string;
  reviewedBy: string;
  reviewComment: string;
  reviewedAt: string | null;
};

const blank: TaskFields = {
  title: "", description: "", expectedResult: "", acceptanceCriteria: "", area: "Content & Forms",
  priority: "Medium", status: "To do", assignee: "", dueDate: "", jiraKey: "",
  platform: "", browser: "", reviewerEmail: "dan.collins@clarkwire.com", rootCause: "",
};

const card = "rounded-2xl border border-[#DCE5E6] bg-white p-5 shadow-sm sm:p-6";
const primary = "inline-flex items-center gap-2 rounded-xl bg-[#E64833] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#C83B29]";
const field = "mt-1.5 block w-full rounded-lg border border-[#BFCFD2] bg-white px-3 py-2 text-sm font-normal text-[#1E1B18] focus-visible:outline-[#E64833]";
const textFields = [
  { key: "assignee", label: "Assignee" },
  { key: "platform", label: "Platform" },
  { key: "browser", label: "Web browser" },
] as const;

const navigation = [
  { label: "Overview", href: "/workspace", Icon: LayoutDashboard },
  { label: "New Submission", href: "/workspace/new", Icon: FilePlus2 },
  { label: "Tasks", href: "/workspace/tasks", Icon: ListChecks },
];

export default function TasksPage() {
  const { user } = useUser();

  return (
    <main className="min-h-screen bg-white text-[#1E1B18]">
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
            <span className="hidden text-xs font-semibold uppercase tracking-widest text-[#1E1B18] sm:inline">
              Administrator workspace
            </span>
            <SignOutButton redirectUrl="/">
              <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-[#DCE5E6] px-4 py-2 text-sm font-semibold hover:bg-[#F5F7F8]">
                <LogOut size={16} /> Log Out
              </button>
            </SignOutButton>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="self-start md:sticky md:top-6" aria-label="Workspace navigation">
          <div className="rounded-2xl border border-[#DCE5E6] bg-white p-3 shadow-sm">
            <div className="flex items-center gap-3 px-3 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#244855] text-white">
                <ClipboardCheck size={20} />
              </div>
              <div>
                <p className="text-sm font-bold">Clark UAT</p>
                <p className="text-xs text-[#1E1B18]">Znode 10 Upgrade</p>
              </div>
            </div>
            <div className="my-3 border-t border-[#E5ECEE]" />
            <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#874F41]">Workspace</p>
            {navigation.map(({ label, href, Icon }) => {
              const active = href === "/workspace/tasks";
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${active ? "bg-[#E5EEEE] text-[#1E1B18]" : "text-[#1E1B18] hover:bg-[#F5F7F8] hover:text-[#1E1B18]"}`}
                >
                  <Icon size={18} /> {label}
                </Link>
              );
            })}
            <div className="my-4 border-t border-[#E5ECEE]" />
            <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#874F41]">Issue Management</p>
            {[
              { label: "Submissions", Icon: Inbox },
              { label: "Review Queue", Icon: ListChecks },
              { label: "Support Tickets", Icon: Ticket },
            ].map(({ label, Icon }) => (
              <div key={label} aria-disabled="true" className="flex items-center justify-between gap-2 rounded-xl px-3 py-3 text-sm text-[#94A3B8]">
                <div className="flex items-center gap-3"><Icon size={18} /><span>{label}</span></div>
                <span className="text-[10px]">Soon</span>
              </div>
            ))}
            <div className="my-4 border-t border-[#E5ECEE]" />
            <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#874F41]">Administration</p>
            {[
              { label: "Settings", Icon: Settings2 },
              { label: "Integrations", Icon: Plug },
            ].map(({ label, Icon }) => (
              <div key={label} aria-disabled="true" className="flex items-center justify-between gap-2 rounded-xl px-3 py-3 text-sm text-[#94A3B8]">
                <div className="flex items-center gap-3"><Icon size={18} /><span>{label}</span></div>
                <span className="text-[10px]">Soon</span>
              </div>
            ))}
          </div>
        </aside>

        <section className="min-w-0">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#874F41]">Znode 10 upgrade · UAT</p>
          <h1 className="text-3xl font-light tracking-tight md:text-[30px]">UAT Tasks</h1>
          <p className="mt-3 text-sm text-[#1E1B18]">
            Test on the{" "}
            <a className="font-semibold underline" href="https://webstore-cwac-np.znodecorp.com/" target="_blank" rel="noreferrer">
              Znode 10 staging webstore
            </a>.
          </p>
          {user ? (
            <TaskWorkspace key={user.id} storageKey={`cwc-uat-tasks-v1:${user.id}`} />
          ) : (
            <p role="status" className="mt-6 text-sm">Loading tasks…</p>
          )}
        </section>
      </div>
    </main>
  );
}

function TaskWorkspace({ storageKey }: { storageKey: string }) {
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<TaskFields | null>(null);
  const [filter, setFilter] = useState<"All" | "Open" | "Completed">("All");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const { user } = useUser();
  const myEmail = user?.emailAddresses.find((e) => e.verification?.status === "verified" && ["dan.collins@clarkwire.com", "shane.collins@clarkwire.com"].includes(e.emailAddress.toLowerCase()))?.emailAddress.toLowerCase();
  const [reviewComments, setReviewComments] = useState<Record<string, string>>({});
  const [hasLocalTasks, setHasLocalTasks] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const response = await fetch("/api/tasks", { cache: "no-store" });
        if (!response.ok) throw new Error("Unable to load tasks from Neon.");
        const result: Task[] = await response.json();
        if (!cancelled) {
          setTasks(result);
          setError("");
          try {
            const saved = JSON.parse(window.localStorage.getItem(storageKey) || "[]");
            setHasLocalTasks(Array.isArray(saved) && saved.length > 0);
          } catch { setHasLocalTasks(false); }
        }
      } catch {
        if (!cancelled) setError("Could not load tasks from the database. Please retry.");
      }
    }
    void load();
    return () => { cancelled = true; };
  }, [storageKey]);

  async function writeTask(task: TaskFields & { id: string }, isEditing: boolean) {
    setBusy(true);
    try {
      const response = await fetch(isEditing ? `/api/tasks/${encodeURIComponent(task.id)}` : "/api/tasks", {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });
      if (!response.ok) throw new Error("Unable to save task.");
      const saved: Task = await response.json();
      setTasks((current) => isEditing
        ? (current ?? []).map((item) => item.id === saved.id ? saved : item)
        : [saved, ...(current ?? [])]);
      setError("");
      return true;
    } catch {
      setError("Task could not be saved to the database. Please retry.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function reviewTask(task: Task, decision: "Approved" | "Changes Requested") {
    setBusy(true);
    try {
      const response = await fetch(`/api/tasks/${encodeURIComponent(task.id)}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision, comment: reviewComments[task.id] || "" }),
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Review failed");
      }
      const updated: Task = await response.json();
      setTasks((current) => (current ?? []).map((item) => item.id === task.id ? updated : item));
      setNotice(`Task ${decision.toLowerCase()}.`);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save review.");
    } finally { setBusy(false); }
  }

  async function importLocalTasks() {
    if (!window.confirm("Import tasks from this browser into Neon? Existing database tasks will be kept.")) return;
    let saved: unknown;
    try { saved = JSON.parse(window.localStorage.getItem(storageKey) || "[]"); }
    catch { setError("Browser tasks could not be read."); return; }
    if (!Array.isArray(saved)) return;
    setBusy(true);
    try {
      const imported: Task[] = [];
      for (const item of saved) {
        const response = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...blank, ...item, acceptanceCriteria: "", reviewerEmail: "dan.collins@clarkwire.com", rootCause: "" }),
        });
        if (!response.ok) throw new Error("Import stopped; some tasks may have been imported.");
        imported.push(await response.json());
      }
      setTasks((current) => [...imported, ...(current ?? [])]);
      window.localStorage.removeItem(storageKey);
      setHasLocalTasks(false);
      setNotice(`Imported ${imported.length} task(s) into Neon.`);
      setError("");
    } catch {
      setError("Import stopped. Existing browser tasks were retained. Check for duplicates before retrying.");
    } finally { setBusy(false); }
  }

  function openForm(task?: Task) {
    setEditing(task?.id ?? null);
    setForm(task ?? blank);
    setNotice("");
  }

  function update<K extends keyof TaskFields>(key: K, value: TaskFields[K]) {
    setForm((current) => current && { ...current, [key]: value });
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form || !form.title.trim()) return;
    const task: TaskFields & { id: string } = {
      ...form,
      id: editing ?? crypto.randomUUID(),
      title: form.title.trim(),
      jiraKey: form.jiraKey.trim().toUpperCase(),
    };
    const saved = await writeTask(task, Boolean(editing));
    if (saved) {
      setForm(null);
      setFilter("All");
      setNotice(editing ? "Task updated." : "Task created.");
    }
  }

  const completed = tasks?.filter((task) => task.status === "Done").length ?? 0;
  const visible = tasks?.filter((task) => filter === "All" || (task.status === "Done") === (filter === "Completed"));

  return (
    <div className="mt-7 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">{tasks && `${completed} of ${tasks.length} completed`}</p>
          <p className="text-sm text-[#1E1B18]">Tasks are shared with authorized Clark reviewers.</p>
          {hasLocalTasks && <button type="button" disabled={busy} className="mt-2 text-sm font-semibold text-[#E64833] underline disabled:opacity-50" onClick={() => void importLocalTasks()}>Import tasks saved in this browser</button>}
        </div>
        {tasks && !form && <button type="button" disabled={busy} className={primary} onClick={() => openForm()}><Plus size={17} /> New task</button>}
      </div>

      {error && <p role="alert" className="text-sm font-medium text-red-800">{error}</p>}
      <p role="status" className="sr-only">{notice}</p>

      {form && (
        <form onSubmit={save} aria-labelledby="task-form-heading" className={card}>
          <h2 id="task-form-heading" className="text-xl font-semibold">{editing ? "Edit task" : "New task"}</h2>
          <div className="mt-5 grid gap-6 md:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
            <div className="space-y-4 text-sm font-semibold">
              <label className="block">Task title
                <input autoFocus className={field} required maxLength={160} pattern=".*\S.*" value={form.title} onChange={(event) => update("title", event.target.value)} />
              </label>
              <label className="block">Description
                <textarea className={field} rows={7} value={form.description} onChange={(event) => update("description", event.target.value)} placeholder="Add the objective and what to test." />
              </label>
              <label className="block">Expected result
                <textarea className={field} rows={3} maxLength={255} value={form.expectedResult} onChange={(event) => update("expectedResult", event.target.value)} />
              </label>
              <label className="block">Acceptance Criteria
                <textarea className={field} rows={5} maxLength={10000} value={form.acceptanceCriteria} onChange={(event) => update("acceptanceCriteria", event.target.value)} placeholder={"List measurable conditions, one per line.\n• First slide advances automatically\n• Manual navigation works\n• Desktop and mobile retested"} />
                <span className="mt-1 block text-xs font-normal text-[#1E1B18]">Conditions to verify before marking the task complete.</span>
              </label>
              <label className="block">Root Cause (if known)
                <textarea className={field} rows={3} value={form.rootCause} onChange={(event) => update("rootCause", event.target.value)} placeholder="Leave blank until confirmed." />
              </label>
            </div>
            <div className="grid content-start gap-4 text-sm font-semibold sm:grid-cols-2 md:border-l md:border-[#DCE5E6] md:pl-6">
              <label className="block">Assigned reviewer
                <select className={field} value={form.reviewerEmail} onChange={(event) => update("reviewerEmail", event.target.value)}>
                  <option value="dan.collins@clarkwire.com">Dan</option>
                  <option value="shane.collins@clarkwire.com">Shane</option>
                </select>
              </label>
              <label className="block">Test area
                <select className={field} value={form.area} onChange={(event) => update("area", event.target.value as TaskFields["area"])}>
                  {areas.map((area) => <option key={area}>{area}</option>)}
                </select>
              </label>
              <label className="block">Status
                <select className={field} value={form.status} onChange={(event) => update("status", event.target.value as TaskFields["status"])}>
                  {statuses.map((status) => <option key={status}>{status}</option>)}
                </select>
              </label>
              <label className="block">Priority
                <select className={field} value={form.priority} onChange={(event) => update("priority", event.target.value as TaskFields["priority"])}>
                  {priorities.map((priority) => <option key={priority}>{priority}</option>)}
                </select>
              </label>
              <label className="block">Due date
                <input type="date" className={field} value={form.dueDate} onChange={(event) => update("dueDate", event.target.value)} />
              </label>
              {textFields.map(({ key, label }) => (
                <label key={key} className="block">{label}
                  <input className={field} value={form[key]} onChange={(event) => update(key, event.target.value)} />
                </label>
              ))}
              <label className="block">Jira issue key
                <input className={field} value={form.jiraKey} onChange={(event) => update("jiraKey", event.target.value)} placeholder="CCB-6" pattern="[A-Za-z][A-Za-z0-9]+-[0-9]+" title="Enter an issue key such as CCB-6." />
              </label>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-4">
            <button className={primary} type="submit" disabled={busy}>{busy ? "Saving…" : "Save task"}</button>
            <button type="button" className="text-sm font-semibold hover:underline" onClick={() => setForm(null)}>Cancel</button>
          </div>
        </form>
      )}

      {tasks && (
        <section className={card} aria-labelledby="task-list-heading">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 id="task-list-heading" className="text-xl font-semibold">Task list</h2>
            <div className="flex flex-wrap gap-1 rounded-lg bg-[#EDF2F3] p-1" role="group" aria-label="Filter tasks">
              {(["All", "Open", "Completed"] as const).map((item) => (
                <button key={item} type="button" aria-pressed={filter === item} onClick={() => setFilter(item)}
                  className={`rounded-md px-3 py-1.5 text-sm font-semibold ${filter === item ? "bg-white shadow-sm" : "hover:bg-white/60"}`}>
                  {item}
                </button>
              ))}
            </div>
          </div>
          {visible?.length ? (
            <ul className="mt-4 divide-y divide-[#DCE5E6]">
              {visible.map((task) => (
                <li key={task.id} className="flex items-start gap-3 py-4">
                  <input type="checkbox" className="mt-1 h-4 w-4 shrink-0 accent-[#E64833]"
                    aria-label={`Complete ${task.title}`} checked={task.status === "Done"} disabled={Boolean(form) || busy || task.approvalStatus !== "Approved" || task.createdBy !== user?.id}
                    onChange={async (event) => {
                      const status = event.target.checked ? "Done" : "To do";
                      if (await writeTask({ ...task, status }, true)) {
                        setNotice(status === "Done" ? "Task completed." : "Task reopened.");
                      }
                    }} />
                  <div className="min-w-0 flex-1">
                    <button type="button" disabled={Boolean(form) || task.createdBy !== user?.id} className={`break-words text-left font-semibold hover:underline disabled:cursor-default ${task.status === "Done" ? "line-through opacity-60" : ""}`} onClick={() => openForm(task)}>{task.title}</button>
                    <p className="mt-1 break-words text-sm text-[#1E1B18]">
                      {[task.area, task.priority, task.assignee, task.dueDate && `Due ${task.dueDate}`, task.jiraKey].filter(Boolean).join(" · ")}
                    </p>
                    <p className="mt-1 text-xs font-semibold">Review: {task.approvalStatus} · Assigned to {task.reviewerEmail === "shane.collins@clarkwire.com" ? "Shane" : "Dan"}</p>
                    {task.approvalStatus === "Approved" && <p className="mt-1 text-xs font-semibold text-[#244855]">Ready for Jira</p>}
                    {task.acceptanceCriteria && (
                      <div className="mt-3 rounded-lg border border-[#DCE5E6] bg-white p-3">
                        <p className="text-xs font-bold uppercase tracking-wide">Acceptance Criteria</p>
                        <p className="mt-1 whitespace-pre-wrap break-words text-sm text-[#1E1B18]">{task.acceptanceCriteria}</p>
                      </div>
                    )}
                    {task.reviewComment && <p className="mt-1 text-sm">Review comment: {task.reviewComment}</p>}
                    {task.approvalStatus === "Pending Approval" && myEmail === task.reviewerEmail && (
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <input className={field + " !mt-0 max-w-sm"} aria-label="Review comment" placeholder="Comment (required for changes)" value={reviewComments[task.id] || ""} onChange={(event) => setReviewComments((current) => ({ ...current, [task.id]: event.target.value }))} />
                        <button type="button" disabled={busy} className={primary} onClick={() => void reviewTask(task, "Approved")}>Approve</button>
                        <button type="button" disabled={busy || !(reviewComments[task.id] || "").trim()} className="rounded-xl border border-[#BFCFD2] px-3 py-2 text-sm font-semibold disabled:opacity-50" onClick={() => void reviewTask(task, "Changes Requested")}>Request changes</button>
                      </div>
                    )}
                  </div>
                  <span className="shrink-0 rounded-md bg-[#EDF2F3] px-2 py-1 text-xs font-semibold">{task.status}</span>
                </li>
              ))}
            </ul>
          ) : <p className="mt-5 text-sm text-[#1E1B18]">{tasks.length === 0 ? "Create a task to start tracking UAT work." : `No ${filter.toLowerCase()} tasks.`}</p>}
        </section>
      )}
    </div>
  );
}
