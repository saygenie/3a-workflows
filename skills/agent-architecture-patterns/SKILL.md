---
name: agent-architecture-patterns
description: "Agent architecture patterns and when to use them. Covers Anthropic's 5 workflow patterns, multi-agent decomposition, and the Agent+Code boundary principle."
triggers:
  - "multi-agent"
  - "아키텍처"
  - "패턴"
  - "architecture pattern"
  - "orchestrator"
  - "routing"
---

# Agent Architecture Patterns

## Core Principle: Start Simple

> "가장 단순한 솔루션을 먼저 찾고, 복잡성은 결과가 개선될 때만 추가하라." — Anthropic

**Single agent + good tools** solves most problems. Only add complexity when you have measured evidence that simplicity isn't enough.

## Anthropic's 5 Workflow Patterns (Progressive Complexity)

### 1. Prompt Chaining
- Sequential steps, each feeding into the next
- **When**: Tasks with clear, linear stages (e.g., generate → validate → format)
- **Gate**: Add verification between steps
- **Complexity**: Low

### 2. Routing
- Classify input → route to specialized handler
- **When**: Distinct input types need different processing (e.g., complaint vs inquiry vs feedback)
- **Complexity**: Low-Medium

### 3. Parallelization
- Run multiple tasks simultaneously, aggregate results
- **Subtypes**: Sectioning (split task) vs Voting (same task, multiple attempts)
- **When**: Independent subtasks, or need consensus
- **Complexity**: Medium

### 4. Orchestrator-Workers
- Central orchestrator dynamically assigns tasks to worker agents
- **When**: Complex tasks where subtasks aren't predictable upfront
- **Key difference from Chaining**: Orchestrator decides next steps dynamically
- **Complexity**: High

### 5. Evaluator-Optimizer
- Generator produces output, evaluator scores it, loop until quality threshold
- **When**: Clear evaluation criteria exist and iterative improvement is valuable
- **Complexity**: High

## Decision Framework

```
질문 1: 단일 LLM 호출로 해결 가능한가?
  → Yes: 단일 에이전트. 끝.
  → No: 질문 2로

질문 2: 단계가 예측 가능한가?
  → Yes: Prompt Chaining
  → No: 질문 3으로

질문 3: 입력 유형에 따라 처리가 다른가?
  → Yes: Routing
  → No: 질문 4로

질문 4: 독립적인 하위 작업이 있는가?
  → Yes: Parallelization
  → No: 질문 5로

질문 5: 하위 작업이 동적으로 결정되는가?
  → Yes: Orchestrator-Workers
  → No: Evaluator-Optimizer (반복 개선이 필요한 경우)
```

## Agent + Deterministic Code Boundary

The critical design decision: **what should the agent reason about vs what should be code?**

| Agent (Inference) | Code (Deterministic) |
|---|---|
| Understanding user intent | Data validation |
| Selecting which tool to use | API calls with fixed parameters |
| Interpreting ambiguous inputs | Calculations, transformations |
| Generating natural language | Format conversion |
| Deciding next steps | Access control checks |

**Rule of thumb**: If the logic has no ambiguity and doesn't require judgment, it should be code, not agent reasoning.

## Protocol vs Pattern

| Aspect | Protocol | Pattern |
|---|---|---|
| Definition | Communication standard (e.g., MCP, A2A) | Architecture design (e.g., Orchestrator-Workers) |
| Purpose | How agents talk | How agents are organized |
| Example | MCP for tool access | Orchestrator dispatching to workers |
| Independence | Can use any pattern | Can use any protocol |

You need both. Don't confuse choosing a protocol with choosing a pattern.

## Anti-Patterns

- **Premature multi-agent**: Adding agents before measuring single-agent limits
- **Agent for computation**: Using inference for tasks that deterministic code handles better
- **God orchestrator**: One agent that does everything — defeats the purpose
- **Missing evaluation**: Adding complexity without measuring if it improved quality
