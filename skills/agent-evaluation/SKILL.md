---
name: agent-evaluation
description: "Agent evaluation methodology. Covers 2-tier evaluation (local + AgentCore), ground truth design, 6 key metrics, eval-driven development, and continuous evaluation."
triggers:
  - "평가"
  - "evaluation"
  - "eval"
  - "ground truth"
  - "테스트 케이스"
  - "메트릭"
---

# Agent Evaluation

## Core Principle: Eval-Driven Development

> "Prototype → Evaluate → Improve 반복이 에이전트 품질의 핵심이다."

Don't guess if your agent is good. Measure it.

## 2-Tier Evaluation System

### Tier 1: Local (Works Everywhere)

No external dependencies. LLM-as-Judge approach:

| Dimension | Score | Method |
|---|---|---|
| Tool Selection | 0-100 | Did the agent pick the correct tool(s)? |
| Parameter Accuracy | 0-100 | Were parameters extracted correctly from user input? |
| Refusal Accuracy | pass/fail | Did it refuse when it should? Did it NOT refuse when it shouldn't? |
| Response Quality | 0-100 | Accuracy, completeness, tone alignment |
| Latency | ms | Time from query to response |
| Cost | tokens/$ | Token usage per interaction |

### Tier 2: AgentCore Evaluations (When Available)

Production-grade evaluation with 13 built-in evaluators:

- **Helpfulness**: Did the response help the user?
- **Correctness**: Is the information factually accurate?
- **Faithfulness**: Does the response match tool outputs (no hallucination)?
- **Harmlessness**: Does the response avoid harmful content?
- **Tool Selection Accuracy**: Correct tool for the task?
- **Tool Parameter Accuracy**: Correct parameters extracted?
- **Coherence**: Is the response logically structured?
- **Relevance**: Does the response address the actual question?
- And 5 more...

**3-Level Evaluation**:
- **Session level**: Overall conversation quality
- **Trace level**: Each agent step within a session
- **Tool (Span) level**: Individual tool call correctness

## Ground Truth Design

### 5 Categories (MECE)

| Category | Purpose | Example |
|---|---|---|
| Happy-path | Normal, expected use | "주문 상태 알려줘" (with valid order) |
| Edge-case | Boundary conditions | Empty results, special characters, very long input |
| Refusal | Should refuse gracefully | Out-of-scope request, dangerous action |
| Multi-tool | Requires multiple tool calls | "주문 찾아서 취소해줘" (search + cancel) |
| Parameter extraction | Tests parameter parsing | "어제부터 오늘까지 배송된 주문" (date parsing) |

### Ground Truth Structure

```json
{
  "test_cases": [
    {
      "id": "GT-001",
      "category": "happy-path",
      "query": "주문번호 ORD-2026-001 상태 알려줘",
      "expected_tools": ["search_orders"],
      "expected_parameters": {
        "search_orders": {"order_id": "ORD-2026-001"}
      },
      "expected_response_contains": ["배송", "상태"],
      "should_refuse": false
    }
  ]
}
```

### Ground Truth Sizing

| Sprint Day | Recommended Cases | Focus |
|---|---|---|
| Day 1 | 10-15 | Happy-path + basic refusal |
| Day 2 | 15-25 | + edge-cases + parameter extraction |
| Day 3 | 25-35 | + multi-tool + regression cases |
| Day 4-5 | 35-50 | + production-like scenarios |

## L2 Quality Loop (Root Cause → Fix)

When scores are below target:

| Failure Type | Root Cause | Fix Target |
|---|---|---|
| Wrong tool selected | Tool descriptions unclear/overlapping | `tool-definitions.md` — clarify when-to-use |
| Wrong parameters | Parameter docs insufficient | Tool parameter descriptions |
| Missed refusal | Guardrails too loose | `agent-definition.md` — MUST NOT DO |
| False refusal | Guardrails too strict | `agent-definition.md` — scope boundaries |
| Low response quality | System prompt missing guidance | System prompt or few-shot examples |

### Fix Process
```
1. Identify failing test cases
2. Group by failure type
3. For each group:
   a. Identify root cause (not just "it got it wrong")
   b. Point to specific file/section to change
   c. Apply fix
   d. Re-evaluate ONLY failing cases
   e. Max 3 rounds per failure group
4. Run full evaluation to check for regressions
```

## Metrics Targets

| Metric | Minimum | Good | Excellent |
|---|---|---|---|
| Tool Selection | 80% | 90% | 95%+ |
| Parameter Accuracy | 85% | 92% | 97%+ |
| Refusal Accuracy | 90% | 95% | 100% |
| Response Quality | 70% | 80% | 90%+ |
| Overall | 75% | 85% | 92%+ |

## Continuous Evaluation (Post-Deploy)

After deployment:
1. **Online evaluation**: Sample production requests for automated scoring
2. **Drift detection**: Compare weekly scores to baseline
3. **Regression alerts**: Score drop > 5% triggers investigation
4. **A/B testing**: Compare agent versions on same queries
5. **Ground truth growth**: Convert interesting production cases to test cases
