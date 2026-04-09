---
name: aws-deployment
description: "AWS deployment patterns for AI agents. Covers AgentCore Runtime deployment, IAM/VPC configuration, security patterns, and production readiness."
triggers:
  - "AWS 배포"
  - "배포 패턴"
  - "IAM"
  - "VPC"
  - "인프라"
  - "production"
  - "프로덕션"
---

# AWS Deployment for AI Agents

## Deployment Architecture

```
┌─────────────────────────────────────────────────┐
│                   API Gateway                    │
│              (Auth, Rate Limiting)                │
└───────────────────┬─────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────┐
│              AgentCore Runtime                    │
│         (Auto-scaling, Session Mgmt)             │
├──────────────────────────────────────────────────┤
│  Agent Code (Strands/LangGraph/Custom)           │
│  ├── System Prompt                               │
│  ├── Tools                                       │
│  └── Orchestration Logic                         │
└───────────┬──────────┬──────────┬───────────────┘
            │          │          │
     ┌──────▼──┐  ┌───▼────┐  ┌─▼──────────┐
     │ Bedrock │  │DynamoDB │  │ External   │
     │ (LLM)  │  │(State)  │  │ APIs       │
     └─────────┘  └────────┘  └────────────┘
```

## Environment Strategy

| Environment | Purpose | Data | Access |
|---|---|---|---|
| `dev` | Development & testing | Mock/test data | Developers |
| `staging` | Pre-production validation | Anonymized prod data | Team |
| `prod` | Production | Real data | Users via API |

### Environment Isolation
- Separate AWS accounts or at minimum separate VPCs
- Separate IAM roles per environment
- Separate Bedrock model access profiles
- Environment-specific configuration (not hardcoded)

## IAM Configuration

### Agent Runtime Role (Least Privilege)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "bedrock:InvokeModel",
      "Resource": "arn:aws:bedrock:*::foundation-model/anthropic.claude-*"
    },
    {
      "Effect": "Allow",
      "Action": ["dynamodb:GetItem", "dynamodb:PutItem", "dynamodb:Query"],
      "Resource": "arn:aws:dynamodb:*:*:table/agent-*"
    },
    {
      "Effect": "Allow",
      "Action": "secretsmanager:GetSecretValue",
      "Resource": "arn:aws:secretsmanager:*:*:secret:agent/*"
    },
    {
      "Effect": "Allow",
      "Action": ["logs:CreateLogStream", "logs:PutLogEvents"],
      "Resource": "arn:aws:logs:*:*:log-group:/agent/*"
    }
  ]
}
```

**Rules**:
- No `*` in Resource except for Bedrock model access
- No `*` in Action — list specific actions
- Separate roles for agent vs deployment pipeline

## VPC Configuration

```
VPC (10.0.0.0/16)
├── Private Subnet A (Agent Runtime)
│   └── NAT Gateway → Internet (for external APIs)
├── Private Subnet B (DynamoDB VPC Endpoint)
└── Public Subnet (ALB only, if needed)
```

- Agent runs in private subnet (no direct internet)
- VPC endpoints for AWS services (DynamoDB, S3, Bedrock)
- NAT Gateway only if external API access needed
- Security groups: allow only required ports/sources

## Secrets Management

```python
# Never this
API_KEY = "sk-hardcoded-secret"

# Always this
import boto3
client = boto3.client('secretsmanager')
secret = client.get_secret_value(SecretId='agent/api-key')
API_KEY = secret['SecretString']
```

- All secrets in AWS Secrets Manager or SSM Parameter Store
- Rotation policy enabled for production
- Agent code never contains credentials
- `.env` files in `.gitignore`

## Deployment Pipeline

```
Code Push → Build → Test → Deploy Dev → Smoke Test
                                  │
                           Deploy Staging → Full Eval
                                  │
                            Deploy Prod → Monitor
```

### Deployment Strategies

| Strategy | Use Case | Rollback |
|---|---|---|
| All-at-once | Dev environment | Redeploy previous |
| Blue/Green | Staging/Prod | Switch back to blue |
| Canary | Prod (if high traffic) | Route 100% to old |

## Production Readiness Checklist

### Security
- [ ] No hardcoded credentials
- [ ] IAM least privilege
- [ ] VPC endpoints for AWS services
- [ ] Input validation on all endpoints
- [ ] API authentication configured
- [ ] Secrets in Secrets Manager

### Observability
- [ ] OpenTelemetry instrumented
- [ ] CloudWatch logs configured
- [ ] Key metrics dashboards created
- [ ] Alerts for error rate and latency
- [ ] X-Ray tracing enabled

### Reliability
- [ ] Health check endpoint
- [ ] Auto-scaling configured
- [ ] Request timeout limits set
- [ ] Error handling for all external calls
- [ ] Graceful degradation plan

### Cost
- [ ] Token usage monitoring
- [ ] Request rate limits
- [ ] Auto-scaling max limits set
- [ ] Cost allocation tags applied
