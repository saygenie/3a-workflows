---
description: "Close sprint — generate handoff documents, finalize CLAUDE.md, clean up .3a/"
---

# 3A Sprint Handoff

Close the sprint and hand off to the customer team. This is the final step — everything should be documented well enough that the customer can operate independently.

## Step 1: Generate Handoff Documents

Create `.3a/handoff/` contents:

### Architecture Summary
- Final architecture diagram/description
- ADRs from `.3a/architecture/decisions/`
- Agent + Deterministic Code boundaries

### Operations Guide
- How to run the agent locally
- How to deploy (reference deployment-log.md)
- Monitoring and observability setup
- Common troubleshooting scenarios

### Evaluation Summary
- Final eval scores (from `.3a/eval/results/`)
- Score progression over the sprint
- Known limitations and failing test cases
- Ground truth dataset for ongoing evaluation

### Crawl → Walk → Run Roadmap
Suggest a progression path for the customer:
- **Crawl**: Current state — what's working, what's manual
- **Walk**: Next improvements — additional features, better eval coverage, CI/CD
- **Run**: Production readiness — scaling, security hardening, A/B testing, continuous evaluation

## Step 2: Finalize CLAUDE.md

Update the project's `CLAUDE.md` so that Claude Code can assist effectively **without the 3a-workflows plugin**:
- Project overview and architecture
- Key conventions and decisions
- How to run, test, deploy
- Important file locations

## Step 3: Clean Up .3a/

Present three options to the user:

| Option | Action |
|---|---|
| **Keep** | Leave `.3a/` as-is for reference |
| **Archive** | Move to `docs/3a-sprint-YYYY-MM-DD/` |
| **Clean** | Keep only `ground-truth.json`, `eval/results/`, `handoff/` — remove the rest |

Wait for user to choose before proceeding.

## Step 4: Final Commit

```
git add -A
git commit -m "[3a-handoff] Sprint 완료 - 인수인계 문서 포함"
```

## Closing

Thank the team and summarize:
- Features completed vs planned
- Final eval score
- Key decisions made during the sprint
- Recommended next steps from the roadmap
