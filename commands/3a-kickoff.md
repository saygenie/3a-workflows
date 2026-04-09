---
description: "Start a new 3A sprint — generate 4 key deliverables, architecture decisions, and sprint plan"
---

# 3A Sprint Kickoff

You are initializing a new 3A (Agentic AI Acceleration) co-building sprint. This is Day 1 — the most important day. Everything built in the next 3~5 days depends on the foundation you lay now.

## Step 1: Initialize Sprint Directory

Create the `.3a/` directory structure. If `.3a/` already exists, warn the user that an active sprint is in progress and suggest running `/3a-handoff` first.

Create these directories:
- `.3a/architecture/decisions/`
- `.3a/eval/results/`
- `.3a/visual/content/`
- `.3a/visual/state/`
- `.3a/checkpoints/`
- `.3a/handoff/`

Create `.3a/.gitignore` with:
```
visual/
```

## Step 2: Gather Requirements

Check if the user has already provided requirements in this conversation. They may have provided:
- A free-form description of the agent they want to build
- A requirements document or file
- A conversation explaining the use case

**IMPORTANT: Do NOT ask multiple questions one by one.** If you need more information, ask ALL questions in a single message, then wait for ONE response. But strongly prefer to just start with what you have — you can always refine later.

If the user gave ANY description of what the agent should do, that is enough to proceed. Fill in reasonable defaults for anything not specified:
- End users: general users (unless stated otherwise)
- Boundaries: infer from the agent's purpose
- Team size: 1 developer (unless stated otherwise)
- Tech stack: Strands Agents SDK + Amazon Bedrock (unless stated otherwise)
- External APIs: Mock data first, real APIs later (unless stated otherwise)

**Bias toward action — start generating deliverables immediately.** Do not wait for perfect requirements.

## Step 3: Generate Deliverables

Use the **kickoff-agent** to generate all deliverables. The kickoff-agent will:

1. Create **4 key deliverables** in `.3a/`:
   - `agent-definition.md` — MUST DO / MUST NOT DO / Scope / Success Criteria
   - `agent-persona.md` — Tone, personality, boundary behaviors
   - `tool-definitions.md` — Each tool with 5 elements (name, params, return, errors, usage)
   - `ground-truth.json` — 10~20 initial test cases (happy-path, edge-case, refusal)

2. Make **architecture decisions**:
   - Single agent vs multi-agent (default: single — "Start simple")
   - Agent + Deterministic Code boundaries
   - ADR in `.3a/architecture/decisions/`

3. Create **features.json** with feature list and assignees

4. Generate **sprint-plan.md** from template

5. Generate **project CLAUDE.md** with sprint context and conventions

## Step 4: Observability Setup

Suggest OpenTelemetry instrumentation setup for the chosen framework:
- For Strands Agents SDK: built-in tracing support
- For other frameworks: manual instrumentation guidance
- Goal: traces from Day 1, not as an afterthought

## Step 5: Review and Approve

Present the complete sprint plan to the SA and developers:
- Summary of all 4 deliverables
- Architecture decision with rationale
- Feature list with assignments and dependencies
- Day-by-day plan

Wait for approval before proceeding. Adjust based on feedback.

## Step 6: Commit

After approval, create the initial commit:

```
git add .3a/ CLAUDE.md
git commit -m "[3a-kickoff] Sprint 초기화 - {project name}"
```

## Principles to Follow

- **"Start simple, add complexity only when measured"** — this applies to architecture, tools, and the sprint plan itself
- **4 deliverables are non-negotiable** — Agent Definition, Persona, Tool Definitions, Ground Truth
- **Ground truth starts small** (10~20 cases) — it grows with each /3a-feature
- **Day 1 Observability** — instrument from the start
