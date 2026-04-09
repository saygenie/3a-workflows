---
name: agent-tool-design
description: "Designing tools for AI agents. Covers the 5-element documentation, consolidation principle, semantic identifiers, error-as-prompt pattern, and eval-driven development."
triggers:
  - "도구 설계"
  - "tool design"
  - "도구 정의"
  - "tool definition"
  - "@tool"
  - "파라미터"
---

# Agent Tool Design

## Core Principle: Tools are the Agent's Hands

> "에이전트가 도구를 잘 사용하느냐가 에이전트의 성능을 결정한다."

Tool design is **ACI (Agent-Computer Interface)** design. Invest as much in it as you would in UI/UX for humans.

## The 5 Elements of Tool Documentation

Every tool MUST have all 5 elements:

### 1. Name
- Clear, action-oriented: `search_orders`, `create_ticket`
- Avoid: `process_data`, `handle_request` (too vague)
- Namespace if many tools: `order_search`, `order_create`

### 2. Parameters
- Each parameter has: name, type, description, constraints
- Description tells the agent **how to determine the value** from user input
- Include examples in descriptions: `"date in YYYY-MM-DD format, e.g., 2026-04-09"`
- Mark optional vs required clearly

### 3. Return Format
- Document the structure the agent will receive
- Use semantic field names: `customer_name` not `field_3`
- Include units: `"amount_usd"` not just `"amount"`
- Describe what "empty" looks like: `{"orders": [], "total_count": 0}`

### 4. Error Conditions
- **Error messages are prompts** — they tell the agent what to do next
- Bad: `"Error: Invalid input"`
- Good: `"Invalid date format. Expected YYYY-MM-DD, got '04-09-2026'. Try reformatting."`
- Include all recoverable errors and their recovery actions

### 5. Usage Guidance
- When to use this tool vs other tools
- What information to gather before calling
- Limitations and edge cases
- Example scenarios

## Consolidation > Proliferation

> "적은 수의 강력한 도구가 많은 수의 좁은 도구보다 낫다."

### Bad: Too Many Narrow Tools
```
get_order_by_id(order_id)
get_orders_by_customer(customer_id)
get_orders_by_date(start_date, end_date)
get_orders_by_status(status)
get_recent_orders(limit)
```

### Good: One Consolidated Tool
```
search_orders(
    order_id: str = None,        # Specific order lookup
    customer_id: str = None,     # Filter by customer
    start_date: str = None,      # Filter by date range
    end_date: str = None,
    status: str = None,          # Filter by status
    limit: int = 10              # Max results
) -> OrderSearchResult
```

**Why**: Fewer tools = less decision-making for the agent = fewer errors.

### When to Split
- When a tool does genuinely different things (read vs write)
- When parameter sets don't overlap at all
- When error handling is completely different

## Semantic Identifiers

Return meaningful names, not opaque IDs:

```python
# Bad
{"id": "a1b2c3d4-e5f6-7890"}

# Good
{"order_id": "ORD-2026-04-001", "customer_name": "김철수"}
```

The agent needs to communicate results to users. Semantic identifiers make this natural.

## Error-as-Prompt Pattern

```python
@tool
def update_order_status(order_id: str, new_status: str) -> dict:
    if not order_id.startswith("ORD-"):
        raise ValueError(
            f"Invalid order_id format: '{order_id}'. "
            f"Order IDs start with 'ORD-' followed by year and sequence. "
            f"Try searching for the order first using search_orders."
        )
    if new_status not in VALID_STATUSES:
        raise ValueError(
            f"Invalid status: '{new_status}'. "
            f"Valid statuses are: {', '.join(VALID_STATUSES)}. "
            f"Current order status is '{current_status}'."
        )
```

Each error message answers: **"What should the agent do next?"**

## Eval-Driven Tool Development

```
1. Define ground truth (expected tool calls for given queries)
2. Implement tool with basic documentation
3. Run eval → measure tool selection accuracy
4. If accuracy < target:
   a. Analyze failures — which tools are confused?
   b. Improve descriptions — clarify when-to-use
   c. Consolidate overlapping tools
   d. Re-run eval
5. Repeat until target met
```

## Common Anti-Patterns

| Anti-Pattern | Problem | Fix |
|---|---|---|
| API passthrough | Exposes implementation details to agent | Design agent-facing interface |
| UUID-only returns | Agent can't communicate meaningfully | Add semantic identifiers |
| Silent failures | Agent doesn't know something went wrong | Always return error info |
| Kitchen-sink tool | One tool does 10 unrelated things | Split by domain responsibility |
| Missing examples | Agent guesses parameter format | Add examples to descriptions |
