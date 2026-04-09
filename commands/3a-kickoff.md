---
description: "Start a new 3A sprint — generate 4 key deliverables, architecture decisions, and sprint plan"
allowed-tools: ["Bash(${CLAUDE_PLUGIN_ROOT}/scripts/init-sprint.sh:*)"]
---

# 3A Sprint Kickoff

You are initializing a new 3A (Agentic AI Acceleration) co-building sprint. This is Day 1 — the most important day. Everything built in the next 3~5 days depends on the foundation you lay now.

## Step 1: Initialize Sprint Directory

Run the sprint initialization script:

```!
"${CLAUDE_PLUGIN_ROOT}/scripts/init-sprint.sh"
```

## Step 2: Gather Requirements

Ask the user for their requirements. They may provide:
- A free-form description of the agent they want to build
- A requirements document or file
- A conversation explaining the use case

If the user has already provided requirements in this conversation, proceed directly.

Ask these critical questions if not already answered:
1. **What does the agent do?** (core use case)
2. **Who are the end users?** (persona)
3. **What tools/APIs does the agent need?** (external integrations)
4. **What should the agent refuse to do?** (boundaries)
5. **How many developers are participating?** (team size for feature assignment)

Bias toward action — if you have enough information to start, start. You can refine later.

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
