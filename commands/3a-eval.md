---
description: "Evaluate agent quality against ground truth — Tier 1 (local) or Tier 2 (AgentCore)"
---

# 3A Agent Evaluation

Run evaluation against the ground truth dataset using the **L2 Quality Feedback Loop**. Supports two tiers:

- **Tier 1 (Local)**: Claude as LLM-as-Judge — works everywhere, no external dependencies
- **Tier 2 (AgentCore)**: AgentCore Evaluations API — 13 built-in evaluators (when available)

## Prerequisites

- `.3a/ground-truth.json` must exist with test cases
- The agent under evaluation must be runnable
- `eval-agent` must be available (Phase 2)

## Step 1: Load Ground Truth

Read `.3a/ground-truth.json` and validate:
- At least 5 test cases exist
- Mix of categories (happy-path, edge-case, refusal)
- Expected fields are present

## Step 2: Run Evaluation (Tier 1 — Default)

For each test case:
1. Send the query to the agent
2. Collect the response (tools used, parameters, output)
3. Claude evaluates as LLM-as-Judge:
   - **Response Quality**: accuracy, completeness, tone
   - **Tool Selection**: did the agent pick the right tool(s)?
   - **Refusal Accuracy**: did it refuse when it should?
4. Record latency and cost per query

## Step 3: Save Results

Write to `.3a/eval/results/YYYY-MM-DD-HHmm.json`:
- Per-case scores
- Aggregate metrics
- Comparison with previous run (if exists)
- Failing cases detail

## Step 4: L2 Quality Loop

If scores are below target:
1. Identify failing categories
2. Use eval-agent to analyze root causes:
   - Tool Selection failures → improve tool descriptions
   - Parameter failures → improve parameter documentation
   - Refusal failures → strengthen guardrails
   - Quality failures → adjust system prompt
3. Suggest specific fixes
4. After fixes: re-evaluate only the failing cases (max 3 rounds)

## Step 5: Grow Ground Truth

Suggest new test cases based on:
- Edge cases discovered during evaluation
- Failure patterns that should be explicitly tested
- New features added since last eval
