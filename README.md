# UAT Workspace Starter

Standalone Next.js + Tailwind + TypeScript boilerplate based on the splash-page mockup.

## Start

```bash
npm install
npm run dev
```

Visit http://localhost:3000 and http://localhost:3000/workspace.

The workspace demo parses bullet lines locally. **It is not an LLM.** Clerk, Neon, and Jira are intentionally not wired yet. Do not use for real internal feedback until authentication and persistence are implemented.

Next: add Clerk auth and server-side route protection; Neon schema for organizations/projects/submissions/issues; LLM structured output with validation; reviewer approval; Jira integration.
