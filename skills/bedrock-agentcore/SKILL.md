---
name: bedrock-agentcore
description: "Amazon Bedrock AgentCore deployment and management. Covers Runtime, Gateway, Identity/Policy, Memory, Observability, and Evaluations."
triggers:
  - "AgentCore"
  - "agentcore"
  - "agent runtime"
  - "배포"
  - "observability"
  - "에이전트코어"
---

# Amazon Bedrock AgentCore

## What is AgentCore?

A managed service for deploying, securing, and observing AI agents in production. Framework-agnostic — works with Strands, LangGraph, CrewAI, or custom agents.

## Core Components

### 1. AgentCore Runtime

Deploy agents as managed services:

- **Auto-scaling**: Scales based on request volume
- **Session management**: Maintains conversation state
- **Health checks**: Built-in liveness/readiness probes
- **Multi-environment**: dev / staging / prod separation

```bash
# Deploy an agent
aws bedrock-agentcore create-agent-runtime \
  --agent-name "my-agent" \
  --runtime-config '{...}'

# Check status
aws bedrock-agentcore get-agent-runtime \
  --agent-runtime-id "art-xxxxx"
```

### 2. AgentCore Gateway

API management for agent endpoints:

- Authentication & authorization
- Rate limiting & throttling
- Request/response logging
- API key management

### 3. Identity & Policy

Secure agent-to-resource access:

- **Agent Identity**: Each agent gets an IAM-backed identity
- **Policy Engine**: Define what each agent can access
- **Least Privilege**: Default deny, explicit allow
- **Audit Trail**: All access decisions logged

### 4. Memory

Persistent memory across sessions:

- **Short-term**: Within a session (conversation history)
- **Long-term**: Across sessions (user preferences, learned facts)
- **Shared**: Between agents (knowledge base)

### 5. Observability (Day 1 Priority)

> "Instrument everything from day one" — AWS Best Practice #2

- **OpenTelemetry**: Traces, metrics, logs
- **CloudWatch Integration**: Dashboards, alarms
- **X-Ray Tracing**: End-to-end request tracing
- **Key Metrics**:
  - Latency (P50, P95, P99)
  - Error rate
  - Tool call success rate
  - Token usage per request
  - Session duration

```python
# Strands SDK auto-instrumentation
from strands import Agent
from strands.telemetry import configure_telemetry

configure_telemetry(
    service_name="my-agent",
    exporter="otlp",
    endpoint="https://otlp.endpoint"
)
```

### 6. Evaluations (Tier 2)

Production-grade evaluation:

- **On-demand**: During development (batch evaluation)
- **Online**: In production (continuous evaluation)
- **13 Built-in Evaluators**: Helpfulness, Correctness, Faithfulness, Harmlessness, Tool Selection Accuracy, etc.
- **3-Level Evaluation**: Session → Trace → Tool (Span)
- **Custom Evaluators**: Define your own metrics

## Deployment Checklist for 3A Sprint

### Day 1 (with /3a-kickoff)
- [ ] Set up OpenTelemetry instrumentation in agent code
- [ ] Configure CloudWatch log group
- [ ] Verify AWS credentials and permissions

### Day 2-3 (with /3a-feature)
- [ ] Test tools with instrumentation enabled
- [ ] Verify traces appear in local/dev environment
- [ ] Monitor token usage patterns

### Day 4 (with /3a-deploy)
- [ ] Deploy to dev environment
- [ ] Run smoke tests against deployed endpoint
- [ ] Verify observability pipeline (traces → CloudWatch)
- [ ] Set up basic alarms (error rate, latency)

### Day 5 (with /3a-deploy prod)
- [ ] Deploy to staging, run full eval suite
- [ ] Deploy to prod with canary/blue-green if available
- [ ] Enable online evaluation (if Tier 2 available)
- [ ] Document deployment in `.3a/deployment-log.md`

## Security Configuration

```
IAM Role (Agent)
├── Bedrock: InvokeModel (specific models only)
├── DynamoDB: Read/Write (agent's tables only)
├── S3: GetObject (specific buckets only)
├── SecretsManager: GetSecretValue (agent's secrets)
└── CloudWatch: PutMetricData, PutLogEvents
```

**Never** give agents `*` permissions. Start with zero access and add only what's needed.

## Cost Optimization

- Use cross-region inference for better availability
- Cache frequent tool responses where appropriate
- Monitor token usage — system prompt size is a recurring cost
- Set request timeout limits to prevent runaway costs
