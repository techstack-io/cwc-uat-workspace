"use client";

import { useUser } from "@clerk/nextjs";
import { ArrowLeft, Plus } from "lucide-react";
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
  area: (typeof areas)[number];
  priority: (typeof priorities)[number];
  status: (typeof statuses)[number];
  assignee: string;
  dueDate: string;
  jiraKey: string;
  platform: string;
  browser: string;
};
type Task = TaskFields & { id: string };

const blank: TaskFields = {
  title: "", description: "", expectedResult: "", area: "Content & Forms",
  priority: "Medium", status: "To do", assignee: "", dueDate: "", jiraKey: "",
  platform: "", browser: "",
};

const card = "rounded-2xl border border-[#DCE5E6] bg-white p-5 shadow-sm sm:p-6";
const primary =
  "inline-flex items-center gap-2 rounded-xl bg-[#E64833] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#C83B29]";
const field = "mt-1.5 block w-full rounded-lg border border-[#BFCFD2] bg-white px-3 py-2 text-sm font-normal text-[#244855] focus-visible:outline-[#244855]";
const textFields = [
  { key: "assignee", label: "Assignee" },
  { key: "platform", label: "Platform" },
  { key: "browser", label: "Web browser" },
] as const;

export default function TasksPage() {
  const { user } = useUser();

  return (
    <main className="min-h-screen bg-white text-[#244855]">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <Link href="/workspace" className="inline-flex items-center gap-2 text-sm font-semibold hover:underline">
          <ArrowLeft size={16} /> Workspace overview
        </Link>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight">UAT Tasks</h1>
        <p className="mt-2 text-sm text-[#516879]">
          Test on the{" "}
          <a className="font-semibold underline" href="https://webstore-cwac-np.znodecorp.com/" target="_blank" rel="noreferrer">
            Znode 10 staging webstore
          </a>.
        </p>
        {user ? <TaskWorkspace key={user.id} storageKey={`cwc-uat-tasks-v1:${user.id}`} /> : <p role="status" className="mt-6 text-sm">Loading tasks…</p>}
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

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      const parsed: unknown = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(parsed)) throw new Error("Invalid task list");
      setTasks(parsed);
    } catch {
      setError("Saved tasks could not be loaded from this browser.");
    }
  }, [storageKey]);

  function persist(change: (current: Task[]) => Task[]) {
    try {
      const saved = window.localStorage.getItem(storageKey);
      const next = change(saved ? JSON.parse(saved) : []);
      window.localStorage.setItem(storageKey, JSON.stringify(next));
      setTasks(next);
      setError("");
      return true;
    } catch {
      setNotice("");
      setError("Your change could not be saved in this browser.");
      return false;
    }
  }

  function openForm(task?: Task) {
    setEditing(task?.id ?? null);
    setForm(task ?? blank);
    setNotice("");
  }

  function update<K extends keyof TaskFields>(key: K, value: TaskFields[K]) {
    setForm((current) => current && { ...current, [key]: value });
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form || !form.title.trim()) return;
    const task: Task = {
      ...form,
      id: editing ?? crypto.randomUUID(),
      title: form.title.trim(),
      jiraKey: form.jiraKey.trim().toUpperCase(),
    };
    const saved = persist((current) => editing
      ? current.map((item) => item.id === editing ? task : item)
      : [task, ...current]);
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
          <p className="text-sm text-[#516879]">Tasks are saved in this browser.</p>
        </div>
        {tasks && !form && <button type="button" className={primary} onClick={() => openForm()}><Plus size={17} /> New task</button>}
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
            </div>
            <div className="grid content-start gap-4 text-sm font-semibold sm:grid-cols-2 md:border-l md:border-[#DCE5E6] md:pl-6">
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
            <button className={primary} type="submit">Save task</button>
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
                  <input type="checkbox" className="mt-1 h-4 w-4 shrink-0 accent-[#244855]"
                    aria-label={`Complete ${task.title}`} checked={task.status === "Done"} disabled={Boolean(form)}
                    onChange={(event) => {
                      const status = event.target.checked ? "Done" : "To do";
                      if (persist((current) => current.map((item) => item.id === task.id ? { ...item, status } : item))) {
                        setNotice(status === "Done" ? "Task completed." : "Task reopened.");
                      }
                    }} />
                  <div className="min-w-0 flex-1">
                    <button type="button" disabled={Boolean(form)} className="break-words text-left font-semibold hover:underline disabled:cursor-default" onClick={() => openForm(task)}>{task.title}</button>
                    <p className="mt-1 break-words text-sm text-[#516879]">
                      {[task.area, task.priority, task.assignee, task.dueDate && `Due ${task.dueDate}`, task.jiraKey].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-md bg-[#EDF2F3] px-2 py-1 text-xs font-semibold">{task.status}</span>
                </li>
              ))}
            </ul>
          ) : <p className="mt-5 text-sm text-[#516879]">{tasks.length === 0 ? "Create a task to start tracking UAT work." : `No ${filter.toLowerCase()} tasks.`}</p>}
        </section>
      )}
    </div>
  );
}
