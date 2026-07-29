---
name: readme-wizard
description: Use when someone wants a project README created or improved, or asks about a repo's first impression, badges, shields.io, star history charts, contributor avatars, documentation tables, project structure trees, or mermaid architecture diagrams for a README — even if the word "README" is never said.
---

# README Wizard

## Overview

Generates or upgrades a project's README into a polished, professional entry point: hero section, badges, quick start, structure tree, docs table, contributors, and star history — all backed by facts detected from the actual repo, never invented.

## When to Use

- Explicit: "write a README", "improve my README", "make our repo look better"
- Implicit: badges, shields.io, star history chart, contributor avatars, contrib.rocks, project structure tree, docs table, mermaid architecture diagram, "first impression" of a repo

## Step 1: Detect Project Facts

Run `scripts/scan_project.sh <project-dir>` first — it prints JSON with name, description, license, git remote (owner/repo), package manager, CI setup, social links found in local files, and a ready-to-paste 2-level directory tree. It's local-files-only (no API calls, no invented values — empty string/array when a fact isn't found), so still cross-check anything decision-critical by reading the repo directly.

The script doesn't cover everything — fill these in by reading the repo:

| Fact | Where to look |
|---|---|
| Scripts/commands | `package.json` scripts, `Makefile` targets, `pyproject.toml` entry points — use these verbatim for Quick Start, don't invent commands |
| Project type | Single package vs `workspaces`/`packages/*` (monorepo), library (has `main`/`exports`, published to a registry) vs app (has a server/build/deploy step) vs docs repo (mostly `.md` files, no build) vs small utility (one script, no framework) — drives which sections and tone to use, see `references/readme-best-practices.md` |

Read `references/readme-best-practices.md` before writing. It covers structure, tone, project-type adaptation, and common pitfalls. Read `assets/badges.json` for exact badge URL formats (status/social/extras) and their `{{PLACEHOLDER}}` values.

## Step 2: Build the README

Use `assets/readme-template.md` as the base structure, not a script to copy verbatim:

- Replace every `{{PLACEHOLDER}}` with actual data detected in Step 1 — never leave one unresolved in the output.
- Adapt, don't copy blindly: drop any section whose facts weren't found in Step 1, and adjust tone/depth to match the project type (see `references/readme-best-practices.md`).
- The template's Connect section carries its own HTML-comment instruction — follow it: include the section only if social links were found in Step 1, otherwise delete the whole section.
- For the architecture diagram placeholder, pick a template from `assets/diagrams.md` and adapt it — only when the repo has enough distinct components to make a diagram informative.
