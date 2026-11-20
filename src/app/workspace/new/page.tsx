"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, ClipboardCopy, FilePlus2, Info, UploadCloud, FileDown } from "lucide-react";

type Status = "Draft" | "Pending Review" | "Approved" | "Submitted to Jira";
type FormData = {
  title: string;
  url: string;
  bugType: string;
  priority: string;
  description: string;
  findings: string;
  expectedResult: string;
  status: Status;
  jiraKey: string;
};

const initial: FormData = {
  title: "",
  url: "",
  bugType: "Functional",
  priority: "Medium",
  description: "",
  findings: "",
  expectedResult: "",
  status: "Draft",
  jiraKey: "",
};

const fieldClass = "w-full rounded-xl border border-[#DCE5E6] bg-white px-4 py-3 text-sm text-[#1E1B18] outline-none transition focus:border-[#90AEAD] focus:ring-2 focus:ring-[#90AEAD]/25";
const labelClass = "mb-2 block text-sm font-semibold text-[#1E1B18]";

export default function NewSubmissionPage() {
  const [form, setForm] = useState<FormData>(initial);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [screenshots, setScreenshots] = useState<File[]>([]);
  const [exporting, setExporting] = useState(false);

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setCopied(false);
    setError("");
  }

  async function copyIssue() {
    if (!form.title.trim() || !form.description.trim() || !form.expectedResult.trim()) {
      setError("Complete the issue title, description, and expected result before copying.");
      return;
    }
    if (form.status === "Submitted to Jira" && !/^([A-Z][A-Z0-9]+-\d+)$/i.test(form.jiraKey.trim())) {
      setError("Enter a valid existing Jira issue key, such as CCB-21.");
      return;
    }
    const payload = {
      ...form,
      findings: form.findings.split("\n").map((line) => line.replace(/^\s*[-•*]\s*/, "").trim()).filter(Boolean),
      jiraKey: form.status === "Submitted to Jira" ? form.jiraKey.trim().toUpperCase() : null,
    };
    try {
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      setCopied(true);
    } catch {
      setError("Clipboard access was blocked. Check your browser permissions.");
    }
  }

  async function downloadWord() {
    if (!form.title.trim() || !form.description.trim() || !form.expectedResult.trim()) {
      setError("Complete the issue title, description, and expected result before downloading.");
      return;
    }
    setExporting(true);
    setError("");
    try {
      const { Document, Packer, Paragraph, TextRun, HeadingLevel, ImageRun } = await import("docx");
      const heading = (text: string) => new Paragraph({ text, heading: HeadingLevel.HEADING_2, spacing: { before: 280, after: 100 } });
      const field = (name: string, value: string) => new Paragraph({ children: [new TextRun({ text: `${name}: `, bold: true }), new TextRun(value || "Not provided")], spacing: { after: 100 } });
      const findings = form.findings.split("\n").map(line => line.replace(/^\s*[-•*]\s*/, "").trim()).filter(Boolean);
      const children = [
        new Paragraph({ text: "Clark Wire & Cable | Znode 10 UAT", spacing: { after: 120 } }),
        new Paragraph({ text: form.title.trim(), heading: HeadingLevel.TITLE }),
        field("Page URL", form.url), field("Bug Type", form.bugType), field("Priority", form.priority),
        field("Status", form.status),
        ...(form.status === "Submitted to Jira" ? [field("Existing Jira Ticket", form.jiraKey)] : []),
        heading("Description"), new Paragraph({ text: form.description }),
        heading("Findings"),
        ...(findings.length ? findings.map(text => new Paragraph({ text, bullet: { level: 0 } })) : [new Paragraph("No findings entered")]),
        heading("Expected Result"), new Paragraph({ text: form.expectedResult }),
      ];
      if (screenshots.length) {
        children.push(heading("Supporting Screenshots"));
        for (const file of screenshots) {
          children.push(new Paragraph({ text: file.name, spacing: { before: 160, after: 80 } }));
          try {
            const bytes = new Uint8Array(await file.arrayBuffer());
            const bitmap = await createImageBitmap(file);
            const scale = Math.min(1, 520 / bitmap.width, 600 / bitmap.height);
            const width = Math.max(1, Math.round(bitmap.width * scale));
            const height = Math.max(1, Math.round(bitmap.height * scale));
            bitmap.close();

let imageBytes = bytes;

const imageType: "png" | "jpg" =
  file.type === "image/jpeg" ? "jpg" : "png";

if (file.type === "image/webp") {
  const image = await createImageBitmap(file);
  const canvas = document.createElement("canvas");

  canvas.width = image.width;
  canvas.height = image.height;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas unavailable");

  context.drawImage(image, 0, 0);
  image.close();

  const pngBlob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("PNG conversion failed")),
      "image/png"
    );
  });

  imageBytes = new Uint8Array(await pngBlob.arrayBuffer());
}

    children.push(
      new Paragraph({
        children: [
          new ImageRun({
            data: imageBytes,
            type: imageType,
            transformation: { width, height },
          }),
        ],
      })
    );
  } catch {
    children.push(
      new Paragraph({
        text: "Image could not be embedded; original file remains selected in the browser.",
      })
    );
  }
}
}
      const doc = new Document({ sections: [{ children }] });
      const blob = await Packer.toBlob(doc);
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = `UAT-${form.title.trim().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").slice(0, 70)}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(href), 1000);
    } catch {
      setError("Could not generate the Word document. Check that the docx package is installed.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-[#1E1B18]">
      <header className="border-b border-[#DCE5E6] bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-5">
          <Link href="/workspace" className="flex items-center gap-3 font-bold">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#244855] text-white"><FilePlus2 size={20} /></span>
            UAT Workspace
          </Link>
          <Link href="/workspace" className="inline-flex items-center gap-2 text-sm font-semibold text-[#1E1B18] hover:text-[#1E1B18]"><ArrowLeft size={16} /> Dashboard</Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl space-y-7 px-6 py-10">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#874F41]">Znode 10 Upgrade · UAT</p>
          <h1 className="text-3xl font-semibold tracking-tight">New UAT Submission</h1>
          <p className="mt-2 text-sm text-[#1E1B18]">Document a defect, refine its expected result, and prepare a structured issue for review.</p>
        </div>

        <div className="rounded-2xl border border-[#DCE5E6] bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-7 flex flex-wrap items-center justify-between gap-3 border-b border-[#E5ECEE] pb-5">
            <h2 className="text-lg font-semibold">Issue details</h2>
            <span className="rounded-full bg-[#E5EEEE] px-3 py-1 text-xs font-semibold text-[#1E1B18]">{form.status}</span>
          </div>
          <div className="space-y-6">
            <div>
              <label htmlFor="issue-title" className={labelClass}>Issue title <span className="text-[#C85A3B]">*</span></label>
              <input id="issue-title" className={fieldClass} value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="Projects Page — Broken Links and Missing Images" />
            </div>
            <div>
              <label htmlFor="page-url" className={labelClass}>Page URL</label>
              <input id="page-url" type="url" className={fieldClass} value={form.url} onChange={(e) => update("url", e.target.value)} placeholder="https://webstore-cwac-np.znodecorp.com/projects" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="bug-type" className={labelClass}>Bug type</label>
                <select id="bug-type" className={fieldClass} value={form.bugType} onChange={(e) => update("bugType", e.target.value)}>
                  {["Functional", "Look & Feel", "Usability", "Performance", "Exception"].map((type) => <option key={type}>{type}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="priority" className={labelClass}>Priority</label>
                <select id="priority" className={fieldClass} value={form.priority} onChange={(e) => update("priority", e.target.value)}>
                  {["High", "Medium", "Low"].map((priority) => <option key={priority}>{priority}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="description" className={labelClass}>Description <span className="text-[#C85A3B]">*</span></label>
              <textarea id="description" rows={4} className={fieldClass} value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Describe the overall problem and its impact." />
            </div>
            <div>
              <label htmlFor="findings" className={labelClass}>Findings</label>
              <textarea id="findings" rows={6} className={fieldClass} value={form.findings} onChange={(e) => update("findings", e.target.value)} placeholder={"One observation per line, for example:\nFirst project link works.\nOther links return 404 errors.\nProject images are missing."} />
              <p className="mt-2 text-xs text-[#1E1B18]">Enter one observation per line. These will be exported as separate findings.</p>
            </div>
            <div>
              <label className={labelClass}>Supporting Screenshots</label>
              <label className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-[#DCE5E6] bg-[#F9FBFB] p-8 text-center hover:border-[#90AEAD]">
                <UploadCloud size={30} className="text-[#90AEAD]" />
                <span className="text-sm font-semibold">Click to upload screenshots</span>
                <span className="text-xs text-[#1E1B18]">PNG, JPG or WebP · Multiple files supported</span>
                <input type="file" accept="image/png,image/jpeg,image/webp" multiple className="sr-only" onChange={(e) => {
                  const selected = Array.from(e.target.files ?? []);
                  setScreenshots(prev => [...prev, ...selected]);
                  e.target.value = "";
                }} />
              </label>
              {screenshots.length > 0 && <div className="mt-3 space-y-2">{screenshots.map((file, index) => (
                <div key={`${file.name}-${index}`} className="flex items-center justify-between gap-3 rounded-lg border border-[#DCE5E6] p-3 text-sm">
                  <span className="truncate">{file.name}</span>
                  <button type="button" className="font-semibold text-[#E64833]" onClick={() => setScreenshots(prev => prev.filter((_, i) => i !== index))}>Remove</button>
                </div>
              ))}</div>}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label htmlFor="expected-result" className="text-sm font-semibold">Expected Result <span className="text-[#C85A3B]">*</span></label>
                <span className={`text-xs tabular-nums ${form.expectedResult.length >= 255 ? "text-[#C85A3B]" : "text-[#1E1B18]"}`}>{form.expectedResult.length}/255</span>
              </div>
              <textarea id="expected-result" rows={3} maxLength={255} className={fieldClass} value={form.expectedResult} onChange={(e) => update("expectedResult", e.target.value)} placeholder="Describe how the page should behave after the defect is fixed." />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#DCE5E6] bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-5 text-lg font-semibold">Submission tracking</h2>
          <div className="space-y-5">
            <div>
              <label htmlFor="status" className={labelClass}>Status</label>
              <select id="status" className={fieldClass} value={form.status} onChange={(e) => update("status", e.target.value as Status)}>
                {["Draft", "Pending Review", "Approved", "Submitted to Jira"].map((status) => <option key={status}>{status}</option>)}
              </select>
            </div>
            {form.status === "Submitted to Jira" && (
              <div>
                <label htmlFor="jira-key" className={labelClass}>Existing Jira ticket ID</label>
                <input id="jira-key" className={fieldClass} value={form.jiraKey} onChange={(e) => update("jiraKey", e.target.value)} placeholder="CCB-21" />
                <p className="mt-2 text-xs text-[#1E1B18]">Manual reference only. This page does not create or verify Jira tickets.</p>
              </div>
            )}
            <div className="flex items-start gap-2 rounded-xl bg-[#F5F7F8] p-4 text-xs leading-relaxed text-[#1E1B18]">
              <Info size={17} className="mt-0.5 shrink-0 text-[#1E1B18]" />
              <p>This is a frontend-only preview. Status changes are not persisted. “Submitted to Jira” means you are recording an existing ticket reference, not submitting a new ticket.</p>
            </div>
          </div>
        </div>

        {error && <p role="alert" className="rounded-xl border border-[#C85A3B]/30 bg-[#C85A3B]/5 px-4 py-3 text-sm text-[#9E3B24]">{error}</p>}
        <div className="flex flex-wrap items-center justify-end gap-3">
          <Link href="/workspace" className="rounded-xl border border-[#DCE5E6] bg-white px-5 py-3 text-sm font-semibold hover:bg-[#E5EEEE]">Back to Dashboard</Link>
          <button type="button" onClick={downloadWord} disabled={exporting} className="inline-flex items-center gap-2 rounded-xl border border-[#244855] bg-white px-5 py-3 text-sm font-bold text-[#1E1B18] hover:bg-[#E5EEEE] disabled:opacity-50">
            <FileDown size={18} />{exporting ? "Generating Word..." : "Download Word (.docx)"}
          </button>
          <button type="button" onClick={copyIssue} className="inline-flex items-center gap-2 rounded-xl bg-[#E64833] px-5 py-3 text-sm font-bold text-white hover:bg-[#C83B29]">
            {copied ? <Check size={18} /> : <ClipboardCopy size={18} />}{copied ? "Copied JSON" : "Copy Structured Issue"}
          </button>
        </div>
      </div>
    </main>
  );
}
