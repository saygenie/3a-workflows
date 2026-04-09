---
description: "Show sprint progress — features, eval scores, git activity"
---

# 3A Sprint Status

Show the current sprint status. This command does NOT require a sub-agent — it's data collection and display.

## Prerequisites

Check that `.3a/` exists. If not, tell the user to run `/3a-kickoff` first.

## Data Collection

Gather and display the following:

### 1. Feature Progress
Read `.3a/features.json` and show:
- Total features, completed, in-progress, blocked
- If assignees exist: per-developer breakdown
- Dependencies and blockers

### 2. Git Activity
Run:
- `git log --oneline --since="today"` — today's commits
- Find last `[3a-checkpoint]` commit and run `git diff --stat {SHA}..HEAD` — changes since last checkpoint

### 3. Eval Results
Check `.3a/eval/results/` for evaluation history:
- Latest score
- Trend (improving/declining) if multiple results exist
- Failing test cases count

### 4. Blockers & Risks
Identify:
- Features stuck in `blocked` status
- Features with no progress since last checkpoint
- Eval scores below target

## Output Format

Present as a clean markdown summary in the terminal. Keep it concise — this should be a quick glance, not a full report.

## Next Step Suggestions

Based on the data, suggest the most impactful next action:
- If features remain: suggest `/3a-feature`
- If eval is outdated: suggest `/3a-eval`
- If end of day: suggest `/3a-checkpoint`
