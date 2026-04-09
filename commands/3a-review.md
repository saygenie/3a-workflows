---
description: "Run code/architecture review using git diff and the review-agent"
---

# 3A Code & Architecture Review

Run a comprehensive review using the **Producer-Reviewer pattern**. Uses git diff to scope the review to recent changes only, saving context.

## Prerequisites

- `.3a/` must exist
- `review-agent` must be available (Phase 2)

## Step 1: Determine Review Scope

Find the review baseline:
1. Look for the most recent `[3a-checkpoint]` commit: `git log --grep="\[3a-checkpoint\]" -1 --format="%H"`
2. If no checkpoint exists, use the `[3a-kickoff]` commit
3. Show `git diff --stat {BASE_SHA}..HEAD` to confirm scope with user

## Step 2: Run Review

Use the **review-agent** to analyze changes from multiple perspectives:
- **Tool design**: 5-element completeness, consolidation principle, semantic identifiers, error-as-prompt
- **Context/prompts**: Right Altitude principle, JIT loading, guardrails
- **Architecture**: Pattern appropriateness, Agent+Code boundary, unnecessary complexity

## Step 3: Producer-Reviewer Loop

1. Categorize findings: **Critical** / **Important** / **Nice-to-have**
2. For Critical issues:
   - Apply fix
   - Re-verify with review-agent (max 2 rounds)
3. For Important issues: present as actionable suggestions

## Step 4: Report & Checkpoint

1. Present review summary
2. Run `/3a-checkpoint` to save the post-review state
