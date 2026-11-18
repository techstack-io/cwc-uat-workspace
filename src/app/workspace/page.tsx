"use client";
import Link from "next/link";
import {useState} from "react";
import {ClipboardCheck,Sparkles,Copy} from "lucide-react";
const sample=`Banner All –
- Rotation not active
- Click and slide not active

Banner 1 –
- Letters don’t match, Bold vs Non
- Underline added
- Links font different
- Symbols missing from links
- Image is too dark
- Picture cut at bottom`;
export default function Workspace(){const [input,setInput]=useState(sample);const [issues,setIssues]=useState<string[]>([]);return <main className="min-h-screen bg-slate-50"><header className="border-b bg-white px-6 py-5"><div className="mx-auto flex max-w-4xl items-center justify-between"><Link href="/" className="flex items-center gap-2 font-bold"><ClipboardCheck className="text-clark"/>UAT Workspace</Link><Link href="/" className="text-sm text-clark">Back to landing page</Link></div></header><div className="mx-auto max-w-4xl space-y-7 px-6 py-12"><p className="font-bold uppercase tracking-widest text-clark">Clark pilot · Interactive demo</p><h1 className="text-3xl font-bold">New UAT Submission</h1><p className="text-slate-600">This starter uses a local bullet splitter to demonstrate the UI. No AI, database, or Jira calls are made.</p><div className="rounded-2xl border bg-white p-6"><label className="mb-3 block font-bold" htmlFor="feedback">Describe what you found</label><textarea id="feedback" className="h-72 w-full rounded-xl border p-4" value={input} onChange={e=>setInput(e.target.value)}/><button onClick={()=>setIssues(input.split("\n").map(s=>s.trim()).filter(s=>s.startsWith("-")).map(s=>s.replace(/^-\s*/,"")))} className="mt-4 flex items-center gap-2 rounded-xl bg-clark px-6 py-3 font-bold text-white"><Sparkles size={18}/> Preview extracted issues</button></div>{issues.length>0&&<div className="rounded-2xl border bg-white p-6"><div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-bold">Proposed issues ({issues.length})</h2><button onClick={()=>navigator.clipboard.writeText(JSON.stringify(issues,null,2))} className="flex gap-2 rounded-lg border px-3 py-2 text-sm"><Copy size={16}/> Copy JSON</button></div>{issues.map((s,i)=><div key={i} className="mb-3 rounded-xl border p-4"><label className="mb-1 block text-xs font-bold text-slate-500">ISSUE {i+1}</label><input className="w-full rounded-lg border px-3 py-2" value={s} onChange={e=>setIssues(v=>v.map((x,j)=>j===i?e.target.value:x))}/></div>)}<p className="text-sm text-slate-500">Not saved or submitted to Jira.</p></div>}</div></main>}
