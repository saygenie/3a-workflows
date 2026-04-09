---
description: "Deploy agent to AWS — AgentCore Runtime, observability, verification"
---

# 3A AWS Deployment

Deploy the agent application to AWS using AgentCore Runtime. Uses the **deploy-agent** for verification.

## Prerequisites

- `.3a/` must exist with completed features
- AWS credentials configured
- `deploy-agent` must be available (Phase 3)

## Step 1: Pre-deployment Check

Verify readiness:
1. All Critical features in `done` status (check `.3a/features.json`)
2. Latest eval score meets minimum threshold
3. No uncommitted changes (`git status`)
4. AWS credentials are valid

## Step 2: Deployment Target

Ask user for deployment target:
- `dev` — Development environment
- `staging` — Pre-production
- `prod` — Production

## Step 3: Deploy

Use deploy-agent to:
1. Package the agent application
2. Deploy to AgentCore Runtime
3. Configure observability (CloudWatch, OpenTelemetry)
4. Set up health checks

## Step 4: Verify

1. Run smoke tests against deployed endpoint
2. Verify observability is working (traces appearing)
3. If Tier 2 eval is available: set up online evaluation

## Step 5: Record

Update `.3a/deployment-log.md` with:
- Timestamp, environment, endpoint
- Deployment method and configuration
- Verification results

```
git add .3a/deployment-log.md
git commit -m "[3a-deploy] {environment} 환경 배포"
```
