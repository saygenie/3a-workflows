---
description: "Implement a feature with L1 feedback loop — design, build, test, commit"
allowed-tools: ["Bash(${CLAUDE_PLUGIN_ROOT}/scripts/update-feature-status.sh:*)"]
---

# 3A Feature Implementation

You are implementing a feature as part of a 3A co-building sprint. Each feature follows the **L1 Feedback Loop**: design → build → test → fix → commit.

## Prerequisites

Check that `.3a/` exists and has been initialized by `/3a-kickoff`. If not, tell the user to run `/3a-kickoff` first.

Read these files for context:
- `.3a/features.json` — current feature list and status
- `.3a/agent-definition.md` — what the agent should/shouldn't do
- `.3a/tool-definitions.md` — tool specifications
- `.3a/sprint-plan.md` — overall plan
- `CLAUDE.md` — project conventions

## Step 1: Select Feature

If the user specified a feature, use that. Otherwise:
1. Read `.3a/features.json`
2. Show features with status `todo` (prioritized by dependency order)
3. Let the user choose, or suggest the next logical feature

Update the selected feature's status to `in-progress` in features.json.

## Step 2: Design

Before writing code:
1. Identify what needs to be built (tools, prompts, logic, integrations)
2. Reference the `strands-agents-sdk` skill if using Strands SDK
3. Define test cases for this feature FIRST (TDD approach)
4. If the feature involves a tool, ensure it follows the 5-element definition from `.3a/tool-definitions.md`

## Step 3: L1 Implementation Loop

```
┌─── L1 Loop ──────────────────────────┐
│ 1. Write code                         │
│ 2. Run tests                          │
│ 3. If tests fail:                     │
│    → Analyze error                    │
│    → Fix code                         │
│    → Go to step 2                     │
│ 4. If tests pass:                     │
│    → Exit loop                        │
└───────────────────────────────────────┘
```

Keep iterating until tests pass. Do not skip tests or mark as done with failing tests.

## Step 4: Update State

After implementation is complete:

1. Update features.json:
```!
"${CLAUDE_PLUGIN_ROOT}/scripts/update-feature-status.sh" "$FEATURE_ID" "done"
```

2. Suggest adding new test cases to `.3a/ground-truth.json` based on this feature:
   - What queries does this feature enable?
   - What edge cases should be tested?
   - What should the agent refuse related to this feature?

## Step 5: Commit

Create a feature commit:

```
git add -A
git commit -m "[3a-feature] F-{id} {feature name}"
```

This commit becomes the diff baseline for the next `/3a-review`.

## Step 6: Next Steps

After completing the feature:
- If more features remain: suggest the next one based on priority/dependencies
- If this was the last feature before a milestone: suggest `/3a-eval` to run evaluation
- If the user seems done for the day: suggest `/3a-checkpoint`

## Principles

- **TDD approach**: Define what "done" looks like before coding
- **L1 Loop is mandatory**: Don't skip testing, don't commit broken code
- **Ground truth grows with features**: Each feature should add test cases
- **Small, focused commits**: One feature per commit for clean review diffs
