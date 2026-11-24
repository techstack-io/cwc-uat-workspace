"use client";

import UatMark from "@/components/UatMark";
import { adminEmail, canReview, mikeEmail, shaneEmail } from "@/lib/reviewer-roles";

import { useUser, SignOutButton } from "@clerk/nextjs";
import Image from "next/image";
import { Plus, Archive, ArchiveRestore, LogOut, ClipboardCheck, LayoutDashboard, FilePlus2, ListChecks, Inbox, Ticket, Settings2, Plug } from "lucide-react";
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
  createdByEmail: string;
  approvalStatus: string;
  reviewedBy: string;
  reviewComment: string;
  checklistProgress: string;
  reviewedAt: string | null;
  archivedAt: string | null;
  archivedBy: string;
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
  { label: "Create Task", href: "/workspace/tasks?new=1", Icon: FilePlus2 },
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
              src="/uat-logo-2.png"
              alt="UAT Workspace"
              width={280}
              height={80}
              className="h-auto w-[220px] sm:w-[300px] xl:w-[280]"
              priority
            />
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-xs font-semibold uppercase tracking-widest text-[#1E1B18] sm:inline">
              Clark UAT workspace
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
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">
                <UatMark size={36} />
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
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("new") === "1") setForm({ ...blank });
  }, []);
  const [filter, setFilter] = useState<"All" | "Open" | "Completed">("All");
  const [assigneeFilter, setAssigneeFilter] = useState("All assignees");
  const [archiveView, setArchiveView] = useState<"Active" | "Archived">("Active");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const { user } = useUser();
  const myEmail = user?.emailAddresses.find((e) => e.verification?.status === "verified" && canReview(e.emailAddress.toLowerCase()))?.emailAddress.toLowerCase();
  const isAdmin = myEmail === adminEmail;
  const [reviewComments, setReviewComments] = useState<Record<string, string>>({});
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [criteriaReviewed, setCriteriaReviewed] = useState(false);
  const [savingChecklist, setSavingChecklist] = useState(false);
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

  async function changeArchive(task: Task, action: "archive" | "restore") {
    if (!isAdmin || busy) return;
    if (action === "archive" && !window.confirm(`Archive "${task.title}"? It will leave the active list but can be restored later.`)) return;
    setBusy(true);
    try {
      const response = await fetch(`/api/tasks/${encodeURIComponent(task.id)}/archive`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Unable to change archive state");
      }
      const updated: Task = await response.json();
      setTasks((current) => (current ?? []).map((item) => item.id === updated.id ? updated : item));
      setNotice(action === "archive" ? "Task archived." : "Task restored.");
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to change archive state");
    } finally { setBusy(false); }
  }

  async function reviewTask(task: Task, decision: "Approved" | "Changes Requested") {
    setBusy(true);
    try {
      const response = await fetch(`/api/tasks/${encodeURIComponent(task.id)}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision, comment: reviewComments[task.id] || "", criteriaReviewed: decision === "Approved" ? criteriaReviewed : false }),
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Review failed");
      }
      const updated: Task = await response.json();
      setTasks((current) => (current ?? []).map((item) => item.id === task.id ? updated : item));
      setNotice(`Task ${decision.toLowerCase()}.`);
      setReviewingId(null);
      setCriteriaReviewed(false);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save review.");
    } finally { setBusy(false); }
  }

  async function verifyChecklistItem(task: Task, index: number, verified: boolean) {
    setSavingChecklist(true);
    try {
      const response = await fetch(`/api/tasks/${encodeURIComponent(task.id)}/checklist`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index, verified }),
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Could not save checklist");
      }
      const updated: Task = await response.json();
      setTasks((current) => (current ?? []).map((item) => item.id === updated.id ? updated : item));
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save checklist.");
    } finally { setSavingChecklist(false); }
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
    setForm(task ? { ...task, reviewerEmail: isAdmin ? task.reviewerEmail : "dan.collins@clarkwire.com" } : { ...blank });
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

  function openReview(task: Task) {
    setReviewingId(task.id);
    setCriteriaReviewed(false);
    setError("");
  }

  const reviewingTask = tasks?.find((task) => task.id === reviewingId);
  const reviewItems = reviewingTask?.acceptanceCriteria.split(/\r?\n/).map((line) => line.trim()).filter(Boolean) ?? [];
  const reviewProgress: { index: number; by: string; at: string }[] = (() => {
    try { const value: unknown = JSON.parse(reviewingTask?.checklistProgress || "[]"); return Array.isArray(value) ? value : []; }
    catch { return []; }
  })();
  const verifiedIndices = new Set(reviewProgress.filter((entry) => entry.by === myEmail).map((entry) => entry.index));
  const allVerified = reviewItems.length > 0 && reviewItems.every((_, index) => verifiedIndices.has(index));
  const activeTasks = tasks?.filter((task) => !task.archivedAt) ?? [];
  const completed = activeTasks.filter((task) => task.status === "Done").length;
  const assignees = Array.from(new Set((tasks ?? []).map((task) => task.assignee.trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b));
  const visible = tasks?.filter((task) =>
    (archiveView === "Archived" ? Boolean(task.archivedAt) : !task.archivedAt) &&
    (filter === "All" || (task.status === "Done") === (filter === "Completed")) &&
    (assigneeFilter === "All assignees" || (assigneeFilter === "Unassigned" ? !task.assignee.trim() : task.assignee.trim() === assigneeFilter))
  );

  return (
    <div className="mt-7 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">{tasks && `${completed} of ${activeTasks.length} active tasks completed`}</p>
          <p className="text-sm text-[#1E1B18]">Tasks are shared with authorized Clark team members. Saving a task makes it available to Dan immediately.</p>
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
                <textarea className={field} rows={8} maxLength={10000} value={form.acceptanceCriteria} onChange={(event) => update("acceptanceCriteria", event.target.value)} placeholder={"List measurable conditions, one per line.\n• First slide advances automatically\n• Manual navigation works\n• Desktop and mobile retested"} />
                <span className="mt-1 block text-xs font-normal text-[#1E1B18]">Enter each Znode fix on a separate line. Reviewers must verify every line before approval.</span>
              </label>
              <label className="block">Root Cause (if known)
                <textarea className={field} rows={3} value={form.rootCause} onChange={(event) => update("rootCause", event.target.value)} placeholder="Leave blank until confirmed." />
              </label>
            </div>
            <div className="grid content-start gap-4 text-sm font-semibold sm:grid-cols-2 md:border-l md:border-[#DCE5E6] md:pl-6">
              <label className="block">Assigned reviewer
                <select disabled={!isAdmin} className={field} value={form.reviewerEmail} onChange={(event) => update("reviewerEmail", event.target.value)}>
                  <option value="dan.collins@clarkwire.com">Dan</option>
                  {isAdmin && <option value={mikeEmail}>Mike</option>}
                  {isAdmin && <option value={shaneEmail}>Shane (legacy reviews)</option>}
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

      {reviewingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E1B18]/60 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget && !busy) setReviewingId(null); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="review-task-title" className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#874F41]">Review before approval</p>
                <h2 id="review-task-title" className="mt-2 text-xl font-semibold">{reviewingTask.title}</h2>
              </div>
              <button type="button" disabled={busy} onClick={() => setReviewingId(null)} className="rounded-lg border border-[#DCE5E6] px-3 py-2 text-sm font-semibold">Close</button>
            </div>
            <p className="mt-3 text-sm text-[#244855]">{[reviewingTask.area, reviewingTask.assignee && `Assigned to ${reviewingTask.assignee}`, reviewingTask.jiraKey].filter(Boolean).join(" · ")}</p>
            <div className="mt-6 space-y-5 text-sm">
              {([
                ["Description", reviewingTask.description],
                ["Expected result", reviewingTask.expectedResult],
                ["Acceptance criteria", reviewingTask.acceptanceCriteria],
                ["Tester findings / root cause", reviewingTask.rootCause],
                ["Platform", reviewingTask.platform],
                ["Browser", reviewingTask.browser],
              ] as const).map(([label, value]) => (
                <div key={label}>
                  <h3 className="font-bold">{label}</h3>
                  <p className="mt-1 whitespace-pre-wrap break-words text-[#1E1B18]">{value?.trim() || "Not provided"}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 border-t border-[#DCE5E6] pt-5">
              <h3 className="text-sm font-bold">Fix verification checklist</h3>
              <p className="mt-1 text-xs text-[#244855]">{verifiedIndices.size} of {reviewItems.length} verified · Saved to the task</p>
              {reviewItems.length ? (
                <div className="mt-4 space-y-3">
                  {reviewItems.map((item, index) => {
                    const entry = reviewProgress.find((record) => record.index === index && record.by === myEmail);
                    return (
                      <label key={index} className="flex items-start gap-3 rounded-lg border border-[#DCE5E6] p-3 text-sm">
                        <input type="checkbox" className="mt-1 h-4 w-4 shrink-0 accent-[#244855]" checked={verifiedIndices.has(index)} disabled={savingChecklist || busy} onChange={(event) => void verifyChecklistItem(reviewingTask, index, event.target.checked)} />
                        <span className="min-w-0"><span className="block whitespace-pre-wrap">{item}</span>{entry && <span className="mt-1 block text-xs text-[#244855]">Verified by {entry.by} · {new Date(entry.at).toLocaleString()}</span>}</span>
                      </label>
                    );
                  })}
                </div>
              ) : <p className="mt-3 text-sm text-red-800">No checklist items. Add acceptance criteria to the task before approving.</p>}
            </div>
            <div className="mt-6 border-t border-[#DCE5E6] pt-5">
              <label className="flex items-start gap-3 text-sm font-medium">
                <input type="checkbox" checked={criteriaReviewed} onChange={(event) => setCriteriaReviewed(event.target.checked)} className="mt-1 h-4 w-4 accent-[#E64833]" />
                I have reviewed the task details, expected result, and acceptance criteria.
              </label>
              <label className="mt-5 block text-sm font-semibold">Review comment
                <textarea rows={3} maxLength={2000} className={field} placeholder="Required when requesting changes" value={reviewComments[reviewingTask.id] || ""} onChange={(event) => setReviewComments((current) => ({ ...current, [reviewingTask.id]: event.target.value }))} />
              </label>
              <div className="mt-5 flex flex-wrap gap-3">
                <button type="button" disabled={busy || savingChecklist || !criteriaReviewed || !allVerified} className={primary + " disabled:cursor-not-allowed disabled:opacity-50"} onClick={() => void reviewTask(reviewingTask, "Approved")}>Approve</button>
                <button type="button" disabled={busy || !(reviewComments[reviewingTask.id] || "").trim()} className="rounded-xl border border-[#BFCFD2] px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50" onClick={() => void reviewTask(reviewingTask, "Changes Requested")}>Request changes</button>
              </div>
            </div>
          </section>
        </div>
      )}

      {tasks && (
        <section className={card} aria-labelledby="task-list-heading">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 id="task-list-heading" className="text-xl font-semibold">Task list</h2>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex gap-1 rounded-lg bg-[#EDF2F3] p-1" role="group" aria-label="Archive view">
                {(["Active", "Archived"] as const).map((item) => (
                  <button key={item} type="button" aria-pressed={archiveView === item} onClick={() => { setArchiveView(item); setFilter("All"); }}
                    className={`rounded-md px-3 py-1.5 text-sm font-semibold ${archiveView === item ? "bg-white shadow-sm" : "hover:bg-white/60"}`}>
                    {item}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-1 rounded-lg bg-[#EDF2F3] p-1" role="group" aria-label="Filter tasks">
                {(["All", "Open", "Completed"] as const).map((item) => (
                  <button key={item} type="button" aria-pressed={filter === item} onClick={() => setFilter(item)}
                    className={`rounded-md px-3 py-1.5 text-sm font-semibold ${filter === item ? "bg-white shadow-sm" : "hover:bg-white/60"}`}>
                    {item}
                  </button>
                ))}
              </div>
              <label className="sr-only" htmlFor="task-assignee-filter">Filter by assignee</label>
              <select id="task-assignee-filter" value={assigneeFilter} onChange={(event) => setAssigneeFilter(event.target.value)}
                className="rounded-lg border border-[#BFCFD2] bg-white px-3 py-2 text-sm font-semibold text-[#244855]">
                <option value="All assignees">All assignees</option>
                {assignees.map((name) => <option key={name} value={name}>{name}</option>)}
                <option value="Unassigned">Unassigned</option>
              </select>
            </div>
          </div>
          {visible?.length ? (
            <ul className="mt-4 divide-y divide-[#DCE5E6]">
              {visible.map((task) => (
                <li key={task.id} className="flex items-start gap-3 py-4">
                  <input type="checkbox" className="mt-1 h-4 w-4 shrink-0 accent-[#E64833]"
                    aria-label={`Complete ${task.title}`} checked={task.status === "Done"} disabled={Boolean(form) || busy || !isAdmin || Boolean(task.archivedAt) || task.approvalStatus !== "Approved"}
                    onChange={async (event) => {
                      const status = event.target.checked ? "Done" : "To do";
                      if (await writeTask({ ...task, status }, true)) {
                        setNotice(status === "Done" ? "Task completed." : "Task reopened.");
                      }
                    }} />
                  <div className="min-w-0 flex-1">
                    <button type="button" disabled={Boolean(form) || Boolean(task.archivedAt) || (!isAdmin && (task.createdBy !== user?.id || task.approvalStatus === "Approved"))} className={`break-words text-left font-semibold hover:underline disabled:cursor-default ${task.status === "Done" ? "line-through opacity-60" : ""}`} onClick={() => openForm(task)}>{task.title}</button>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-2 rounded-lg border border-[#90AEAD] bg-[#EDF2F3] px-3 py-1.5 text-sm font-semibold text-[#244855]">
                        <span className="text-xs font-bold uppercase tracking-wide">Assignee</span>
                        <span>{task.assignee.trim() || "Unassigned"}</span>
                      </span>
                    </div>
                    <p className="mt-2 break-words text-sm text-[#1E1B18]">
                      {[task.area, task.priority, task.dueDate && `Due ${task.dueDate}`, task.jiraKey].filter(Boolean).join(" · ")}
                    </p>
                    <p className="mt-2 text-xs font-semibold text-[#244855]">Created by: {task.createdByEmail || (task.createdBy === user?.id ? "You" : "Existing task")}</p>
                    <p className="mt-1 text-xs font-semibold">Review: {task.approvalStatus} · Assigned to {task.reviewerEmail === mikeEmail ? "Mike" : task.reviewerEmail === shaneEmail ? "Shane" : "Dan"}</p>
                    {task.approvalStatus === "Approved" && <p className="mt-1 text-xs font-semibold text-[#244855]">Ready for Jira</p>}
                    {task.acceptanceCriteria && (
                      <div className="mt-3 rounded-lg border border-[#DCE5E6] bg-white p-3">
                        <p className="text-xs font-bold uppercase tracking-wide">Acceptance Criteria</p>
                        <p className="mt-1 whitespace-pre-wrap break-words text-sm text-[#1E1B18]">{task.acceptanceCriteria}</p>
                      </div>
                    )}
                    {task.acceptanceCriteria && <p className="mt-2 text-xs font-semibold text-[#244855]">Checklist: {(() => { try { const value: unknown = JSON.parse(task.checklistProgress || "[]"); return Array.isArray(value) ? value.filter((entry) => entry.by === task.reviewerEmail).length : 0; } catch { return 0; } })()} / {task.acceptanceCriteria.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).length} verified</p>}
                    {task.reviewComment && <p className="mt-1 text-sm">Review comment: {task.reviewComment}</p>}
                    {task.approvalStatus === "Pending Approval" && !task.archivedAt && myEmail === task.reviewerEmail && (
                      <button type="button" disabled={busy || Boolean(form)} className="mt-3 rounded-xl border border-[#244855] px-4 py-2 text-sm font-semibold text-[#244855] hover:bg-[#E5EEEE] disabled:opacity-50" onClick={() => openReview(task)}>
                        Review task
                      </button>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <span className="rounded-md bg-[#EDF2F3] px-2 py-1 text-xs font-semibold">{task.archivedAt ? "Archived" : task.status}</span>
                    {task.archivedAt && <span className="text-xs text-[#244855]">{new Date(task.archivedAt).toLocaleDateString()}</span>}
                    {isAdmin && <button type="button" disabled={busy || Boolean(form)} onClick={() => void changeArchive(task, task.archivedAt ? "restore" : "archive")}
                      className="inline-flex items-center gap-1 rounded-lg border border-[#BFCFD2] px-2 py-1.5 text-xs font-semibold hover:bg-[#EDF2F3] disabled:opacity-50">
                      {task.archivedAt ? <ArchiveRestore size={14} /> : <Archive size={14} />}
                      {task.archivedAt ? "Restore" : "Archive"}
                    </button>}
                  </div>
                </li>
              ))}
            </ul>
          ) : <p className="mt-5 text-sm text-[#1E1B18]">{tasks.length === 0 ? "Create a task to start tracking UAT work." : archiveView === "Archived" ? "No archived tasks match these filters." : `No ${filter.toLowerCase()} active tasks.`}</p>}
        </section>
      )}
    </div>
  );
}
