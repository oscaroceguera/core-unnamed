---
description: Analyzes the monorepo and generates/updates visual documentation in ARCHITECTURE.md
allowed-tools: Bash(find:*), Bash(cat:*), Bash(date:*), Bash(git:*), Read, Glob, Grep, Write
model: claude-haiku-4-5-20251001
---

## Context (recalculated on every run)

- Current date/time: !`date +"%Y-%m-%d %H:%M"`
- Folder tree (3 levels, excluding node_modules/.git/dist): !`find . -maxdepth 3 -type d \( -name node_modules -o -name .git -o -name dist -o -name .next -o -name .turbo \) -prune -o -type d -print`
- Root workspaces: !`cat package.json 2>/dev/null | grep -A 30 '"workspaces"'`
- Apps/packages with their package.json: !`find apps packages -maxdepth 2 -name package.json 2>/dev/null`

## Your task

You are a technical documentation writer. Analyze this monorepo (Turborepo, Next.js, TypeScript, Tailwind, Prisma, Neon) and create or **fully overwrite** the `ARCHITECTURE.md` file at the project root with this content:

1. **Header** with the project name and a visual badge (emojis are fine, no external images).
2. **Last updated:** use exactly the date/time shown in the context above — this value must ALWAYS replace whatever was there before, even if nothing else in the doc changes.
3. **Project summary** in 2-3 lines: what it is, who it's for (JSConf México), what problem it solves.
4. **Tech stack** as a list with emojis (⚡ Next.js, 🔷 TypeScript, 🎨 Tailwind, 🗄️ Prisma + Neon, 📦 Turborepo, ▲ Vercel).
5. **Monorepo structure**: a clean folder tree (use the tree from context, filter out noise) in a `text` block.
6. **Architecture diagram** in Mermaid (`mermaid`) showing how apps/packages relate to each other (e.g. web → api → db, dashboard → analytics MCP, etc). Infer relationships by reading each `package.json` and imports if needed.
7. **Per app/package detail**: for each one in `apps/` and `packages/`, a subsection with: name, purpose (read its `package.json`/README if present), main scripts.
8. **How to run the project** (dev/build commands taken from the root scripts).
9. Footer: `📝 Documentation auto-generated with Claude Haiku — do not edit by hand, run /document-monorepo to update.`

Rules:

- If `ARCHITECTURE.md` already exists, keep the same style/sections but regenerate all content from scratch with current info (no partial patches).
- Be concise per section — this is reference documentation, not an essay.
- Don't invent packages or apps that don't exist; only document what you actually find.
