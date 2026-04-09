---
name: harness-engineering
description: "Harness engineering for AI agents. Covers the Guides+Sensors framework, computational vs inferential checks, harnessability, and the Quality Left principle."
triggers:
  - "harness"
  - "하네스"
  - "가이드"
  - "센서"
  - "quality"
  - "안정성"
---

# Harness Engineering

## Core Framework

> Agent = Model + Harness
> Harness = Guides (Feedforward) + Sensors (Feedback)
> — Martin Fowler

The **model** provides reasoning capability. The **harness** ensures it reasons well — guiding it toward correct behavior and detecting when it goes wrong.

## Guides (Feedforward)

Guides steer the agent **before** it acts:

| Guide Type | Example | When Applied |
|---|---|---|
| System Prompt | Agent definition, persona, boundaries | Every request |
| Tool Descriptions | 5-element docs, when-to-use guidance | Tool selection |
| Few-Shot Examples | Example conversations | Ambiguous scenarios |
| Skill References | Domain knowledge (this plugin's skills/) | On demand |
| Architecture Constraints | Agent+Code boundary, pattern choice | Design time |
| Sprint Context | Current features, progress, priorities | Per session |

### Guide Design Principles

1. **Right Altitude**: Not too abstract, not too detailed
2. **JIT Loading**: Load when needed, not all at once
3. **Explicit Boundaries**: MUST DO / MUST NOT DO clearly stated
4. **Actionable**: Every guide should change agent behavior measurably

## Sensors (Feedback)

Sensors detect problems **after** the agent acts:

### Computational Sensors (Fast, Cheap)
- Code-based checks that run automatically
- Examples: credential detection, file size limits, format validation
- Response time: < 1 second
- Used in: hooks (PreToolUse)

### Inferential Sensors (Slow, Expensive)
- LLM-based evaluation that requires reasoning
- Examples: code review, eval scoring, architecture assessment
- Response time: seconds to minutes
- Used in: agents (review-agent, eval-agent)

### Quality Left Principle

```
Speed:     ◀━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━▶
           Fast                            Slow

           PreToolUse    Stop         /3a-review    /3a-eval
           (hooks)       (prompt)     (agent)       (agent)

Cost:      Cheap ──────────────────────────── Expensive
```

**"Quality Left"** means: apply the cheapest, fastest checks first. Only escalate to expensive inferential checks when needed.

| Layer | Type | Speed | Example |
|---|---|---|---|
| L0 | Computational hook | < 1s | Block hardcoded credentials |
| L1 | Prompt hook | ~10s | Remind about feature status update |
| L2 | Review agent | ~minutes | Multi-perspective code review |
| L3 | Eval agent | ~minutes | Ground truth evaluation |

## Harnessability

> "하네스가 효과적이려면, 에이전트 코드가 하네스하기 쉽게 설계되어야 한다."

### High Harnessability
- Clear tool boundaries (each tool does one thing well)
- Observable state (logs, traces, metrics)
- Deterministic where possible (code for computation, agent for reasoning)
- Testable independently (each component can be tested in isolation)

### Low Harnessability
- Monolithic agent with no tool separation
- Hidden state (no observability)
- Over-reliance on inference for deterministic tasks
- Tightly coupled components

## The Generate → Evaluate → Improve Loop

This is the fundamental feedback loop at every level:

```
┌─────────────┐
│  Generate   │ ← Guides (feedforward)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Evaluate   │ ← Sensors (feedback)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Improve    │ ← Update guides based on feedback
└──────┬──────┘
       │
       └──────→ Back to Generate
```

### Applied at 3 Levels

| Level | Generate | Evaluate | Improve |
|---|---|---|---|
| L1 (Feature) | Implement code | Run tests | Fix failures |
| L2 (Quality) | Agent responds | Eval scores | Tune prompts/tools |
| L3 (Sprint) | Day's work | Status review | Adjust priorities |

## Practical Harness Checklist

For each agent you build:

- [ ] **Guides**: System prompt at Right Altitude?
- [ ] **Guides**: Tool descriptions complete (5 elements)?
- [ ] **Guides**: Guardrails explicit (MUST / MUST NOT)?
- [ ] **Sensors**: Computational checks for obvious errors?
- [ ] **Sensors**: Eval dataset covering all categories?
- [ ] **Sensors**: Observability instrumented?
- [ ] **Boundary**: Agent for reasoning, code for computation?
- [ ] **Testability**: Each tool testable independently?
- [ ] **Simplicity**: Is the current complexity justified by measured results?
