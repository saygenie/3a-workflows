---
description: "Save a sprint checkpoint — git commit + metadata + plan adjustment"
---

# 3A Sprint Checkpoint

Create a checkpoint that captures the current sprint state and adjusts the plan forward. This is the core of the **L3 Daily Review Loop**.

## Prerequisites

Check that `.3a/` exists. If not, tell the user to run `/3a-kickoff` first.

## Step 1: Collect State

1. Read `.3a/features.json` — current progress
2. Check `.3a/eval/results/` — latest eval scores
3. Run `git status` — any uncommitted changes

## Step 2: Create Checkpoint Metadata

Write `.3a/checkpoints/YYYY-MM-DD-HHmm.md` with:
- Feature progress snapshot (N/M done, X blocked)
- Latest eval score (if available)
- Key accomplishments since last checkpoint
- Current blockers

## Step 3: Git Commit

Stage and commit all current work:

```
git add -A
git commit -m "[3a-checkpoint] Day N - {brief summary}"
```

This commit SHA becomes the BASE_SHA for the next `/3a-review`.

## Step 4: Plan Adjustment (L3 Loop)

Compare remaining work vs remaining time:
- **Remaining features** vs **remaining days**
- **Blocked features** — can they be unblocked? Should scope be reduced?
- **Eval scores** — which areas need the most attention?

Suggest priority adjustments:
- High-risk features → reduce scope or deprioritize
- Quick wins → prioritize for momentum
- Low eval scores → focus improvement effort

Present the adjusted plan and wait for SA/developer approval.
