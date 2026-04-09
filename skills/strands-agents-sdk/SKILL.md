---
name: strands-agents-sdk
description: "Strands Agents SDK usage guide. Covers agent creation, tool definition, multi-agent patterns, memory, streaming, and integration with Amazon Bedrock."
triggers:
  - "strands"
  - "Strands"
  - "strands-agents"
  - "@tool"
  - "에이전트 SDK"
---

# Strands Agents SDK

## What is Strands?

An open-source SDK for building AI agents with a model-driven approach. The agent loop is controlled by the LLM — the model decides which tools to call and when to stop.

## Core Concepts

### Agent Creation

```python
from strands import Agent
from strands.models.bedrock import BedrockModel

model = BedrockModel(
    model_id="us.anthropic.claude-sonnet-4-20250514",
    region_name="us-east-1"
)

agent = Agent(
    model=model,
    system_prompt="You are a helpful assistant.",
    tools=[tool1, tool2]
)

response = agent("사용자 질문")
```

### Tool Definition (5 Elements)

```python
from strands.types.tools import tool

@tool
def search_orders(
    customer_id: str,
    status: str = "all"
) -> dict:
    """Search customer orders by status.

    Args:
        customer_id: Customer identifier (e.g., "CUST-12345")
        status: Filter by order status. One of: "all", "pending", "shipped", "delivered", "cancelled"

    Returns:
        dict with keys:
        - orders: list of matching orders with order_id, status, created_at
        - total_count: number of matching orders

    Raises:
        ValueError: If customer_id format is invalid. Try again with format "CUST-XXXXX".
        NotFoundError: No customer found. Verify the customer_id and retry.
    """
    # Implementation
    pass
```

**5 Elements**: name, parameters (with descriptions), return format, error conditions (as prompts), usage guidance (in docstring)

### Multi-Agent Patterns

```python
from strands import Agent

# Orchestrator-Workers
orchestrator = Agent(
    system_prompt="You coordinate tasks between specialized agents.",
    tools=[research_agent_tool, writer_agent_tool]
)

# Agent-as-Tool pattern
@tool
def research_agent_tool(query: str) -> str:
    """Research a topic and return findings.

    Args:
        query: The research question to investigate
    """
    researcher = Agent(
        system_prompt="You are a research specialist.",
        tools=[web_search, document_reader]
    )
    return str(researcher(query))
```

### Memory & State

```python
from strands import Agent

# Conversation memory (built-in)
agent = Agent(system_prompt="...")
agent("첫 번째 질문")  # 대화 기록 유지
agent("후속 질문")      # 이전 컨텍스트 참조 가능

# Custom state management
agent = Agent(
    system_prompt="...",
    state={"user_preferences": {}, "session_data": {}}
)
```

### Streaming

```python
# Streaming responses
agent = Agent(model=model, tools=[...])

for event in agent.stream("질문"):
    if event.type == "text":
        print(event.data, end="")
    elif event.type == "tool_use":
        print(f"\n[Using tool: {event.tool_name}]")
```

## Best Practices for 3A Sprint

1. **Start with one agent**: Add multi-agent only when measured quality demands it
2. **Tool docstrings are prompts**: Write them for the model, not for developers
3. **Error messages guide next action**: "Invalid format. Expected YYYY-MM-DD" not just "Invalid input"
4. **Test tools independently**: Before wiring into agents, verify tool behavior
5. **Use type hints**: They become part of the tool schema the model sees
6. **Keep system prompts focused**: Right Altitude — specific enough to guide, abstract enough to generalize

## Common Patterns in 3A Projects

| Pattern | Use Case | Example |
|---|---|---|
| Single Agent + Tools | Most Day 1-2 implementations | Customer service bot |
| Agent-as-Tool | Specialized sub-tasks | Research agent called by main agent |
| Prompt Chaining | Sequential processing | Intake → Classify → Route → Respond |
| Parallel Agents | Independent analysis | Sentiment + Entity extraction simultaneously |

## Integration with Bedrock

```python
from strands.models.bedrock import BedrockModel

# Cross-region inference
model = BedrockModel(
    model_id="us.anthropic.claude-sonnet-4-20250514",
    region_name="us-east-1",
    additional_request_fields={
        "thinking": {"type": "enabled", "budget_tokens": 5000}
    }
)
```

## Debugging Tips

- Enable debug logging: `import logging; logging.basicConfig(level=logging.DEBUG)`
- Check tool schemas: `print(agent.tool_registry.get_all_tools_config())`
- Inspect conversation: `print(agent.messages)`
