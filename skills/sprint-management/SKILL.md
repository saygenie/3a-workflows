---
name: sprint-management
description: "3A Sprint management methodology. Covers the 4 initial deliverables, feature list management, checkpoint rhythm, Crawl→Walk→Run progression, and multi-developer coordination."
triggers:
  - "sprint"
  - "스프린트"
  - "계획"
  - "일정"
  - "진행"
  - "feature list"
  - "Crawl Walk Run"
---

# Sprint Management

## 3A Sprint Structure (3-5 Days)

```
Day 1  │ Kickoff: 4 deliverables + architecture + feature list
Day 2  │ Build: Feature implementation (L1 loops) + baseline eval
Day 3  │ Integrate: Review + eval improvement (L2 loop)
Day 4  │ Deploy: Dev/staging deployment + final eval
Day 5  │ Handoff: Production + documentation + roadmap
```

## 4 Initial Deliverables (Day 1)

These are the foundation. Everything else builds on them:

### 1. Agent Definition (`agent-definition.md`)
- **MUST DO**: Core capabilities the agent must have
- **MUST NOT DO**: Explicit boundaries and refusals
- **Scope**: Clear statement of what's in/out
- **Success Criteria**: How to know the agent is working correctly

### 2. Agent Persona (`agent-persona.md`)
- Tone and communication style
- Language preferences (Korean, English, mixed)
- How to handle frustrated users
- Personality boundaries (professional, casual, etc.)

### 3. Tool Definitions (`tool-definitions.md`)
- Every tool with 5 elements (name, params, return, errors, guidance)
- Consolidation applied (fewer powerful tools > many narrow ones)
- Semantic identifiers in returns
- Error messages as prompts

### 4. Ground Truth (`ground-truth.json`)
- 10-20 initial test cases
- 5 categories: happy-path, edge-case, refusal, multi-tool, parameter-extraction
- Expected tools, parameters, and response characteristics
- This is your evaluation baseline

## Feature Management

### features.json Structure

```json
{
  "features": [
    {
      "id": "F-001",
      "name": "주문 조회 도구",
      "priority": "critical",
      "assignee": "developer-a",
      "status": "done",
      "depends_on": [],
      "tests": {"pass": 5, "fail": 0},
      "eval_score": 92,
      "updated_at": "2026-04-09T14:30:00Z"
    }
  ]
}
```

### Priority Levels

| Priority | Meaning | Action |
|---|---|---|
| `critical` | Must have for MVP | Complete by Day 3 |
| `important` | Significantly improves quality | Complete if time allows |
| `nice-to-have` | Enhancement | Only after critical+important done |

### Status Flow

```
todo → in-progress → done
                   → blocked (with reason)
```

## Checkpoint Rhythm

```
매 Feature 완료: /3a-feature → git commit
매일 마무리:     /3a-status → /3a-checkpoint → git commit
리뷰 시:        /3a-review → 수정 → git commit
평가 시:        /3a-eval → 수정 → git commit
```

Each checkpoint creates a git commit that serves as:
1. Recovery point (can always go back)
2. Review baseline (git diff from here)
3. Progress marker (git log shows trajectory)

## Multi-Developer Coordination

### Feature Assignment
- SA distributes features based on developer skills and dependencies
- Independent features can be worked in parallel
- Dependent features have `depends_on` field

### Merge Strategy
- Each developer works on their features (branch optional)
- `features.json`: each feature is independent object → auto-merge usually works
- `ground-truth.json`: append-only pattern → minimal conflicts
- `tool-definitions.md`: section-per-developer → section-level merge
- After merge: run `/3a-eval` to detect regressions

### Daily Sync Point
```
1. Each developer: /3a-checkpoint (commit their work)
2. Merge/rebase as team prefers
3. SA runs: /3a-status (see overall progress)
4. SA runs: /3a-eval (check for regressions)
5. Plan tomorrow: prioritize based on eval results
```

## Crawl → Walk → Run

Post-sprint progression path for the customer:

### Crawl (Sprint Deliverable)
- Agent working with core features
- Tier 1 evaluation baseline established
- Basic observability (logs + traces)
- Manual deployment process
- Ground truth dataset with 30-50 cases

### Walk (1-2 Weeks Post-Sprint)
- Additional features from backlog
- Tier 2 evaluation (AgentCore) if available
- CI/CD pipeline for agent deployment
- Expanded ground truth (100+ cases)
- Monitoring dashboards + alerts
- A/B testing framework

### Run (1-2 Months Post-Sprint)
- Production-grade auto-scaling
- Continuous online evaluation
- Drift detection and automated alerts
- Multi-agent decomposition (if justified by eval)
- Security hardening complete
- Organizational capability building (team can iterate independently)

## Risk Management

| Risk | Signal | Mitigation |
|---|---|---|
| Feature scope creep | More features added mid-sprint | Strict priority filtering — only critical |
| Eval score plateau | Score stuck despite fixes | Change approach — tool redesign, not prompt tweaking |
| Integration failures | Features work alone, break together | Earlier integration, more multi-tool test cases |
| Deployment blockers | AWS config issues on Day 4 | Set up dev environment on Day 1 |
| Knowledge transfer gap | Customer can't operate post-sprint | Start handoff docs on Day 3, not Day 5 |

## Anti-Patterns

- **Big Bang Integration**: Building all features then integrating on Day 4 → integrate daily
- **Eval Procrastination**: "We'll evaluate later" → establish baseline on Day 2
- **Scope Inflation**: "While we're at it..." → stick to feature list, add to backlog
- **Hero Mode**: One developer does everything → distribute and coordinate
- **Documentation Debt**: "We'll document later" → document as you go, finalize at handoff
