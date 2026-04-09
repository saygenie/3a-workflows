# 3a-workflows

**A harness for building agent harnesses** — Claude Code plugin for the 3A (Agentic AI Acceleration) co-building program.

## What is this?

3a-workflows는 AWS AI/ML Specialist SA Team이 운영하는 **3A Program** (Agentic AI Acceleration Program)을 위한 Claude Code 플러그인입니다.

3~5일 co-building sprint 동안 SA와 고객 개발자가 production-grade AI 에이전트 애플리케이션을 함께 만들 때, Claude Code가 효과적인 코딩 파트너가 되도록 하는 **메타 하네스**입니다.

## Quick Start

```bash
# 플러그인 로드
claude --plugin-dir /path/to/3a-workflows

# Sprint 시작
/3a-kickoff

# Feature 구현
/3a-feature

# 진행 확인
/3a-status
```

## Commands

| Command | 목적 |
|---|---|
| `/3a-kickoff` | Day 1 Sprint 시작 — 4가지 산출물 + 아키텍처 + Feature 목록 |
| `/3a-feature` | Feature 단위 구현 (L1 Feedback Loop) |
| `/3a-status` | 진행 현황 — features, eval 점수, git 활동 |
| `/3a-checkpoint` | 체크포인트 — git commit + 계획 조정 |
| `/3a-review` | 코드/아키텍처 리뷰 (git diff 기반) |
| `/3a-eval` | 에이전트 평가 — Tier 1 (로컬) / Tier 2 (AgentCore) |
| `/3a-deploy` | AWS 배포 — AgentCore Runtime |
| `/3a-handoff` | Sprint 마무리 — 인수인계 + Crawl→Walk→Run 로드맵 |

## 3~5 Day Workflow

```
Day 1  /3a-kickoff → 4 산출물 + 아키텍처 + Feature 목록
Day 2  /3a-feature × N → /3a-eval (baseline)
Day 3  /3a-feature × N → /3a-review → /3a-eval (개선 확인)
Day 4  /3a-deploy dev → /3a-eval (배포 전 최종)
Day 5  /3a-deploy prod → /3a-handoff
```

매일 마무리: `/3a-status` → `/3a-checkpoint`

## 4 Key Deliverables (Day 1)

`/3a-kickoff`이 생성하는 핵심 산출물:

1. **Agent Definition** — 에이전트가 해야 할 것 / 하지 말아야 할 것
2. **Agent Persona** — 톤, 성격, 경계 밖 행동
3. **Tool Definitions** — 5요소 (이름, 파라미터, 반환, 에러, 사용 가이드)
4. **Ground Truth** — 평가용 테스트 케이스 (happy-path, edge-case, refusal)

## 3-Level Feedback Loops

- **L1 (Feature)**: 구현 → 테스트 → 실패 시 수정 → 통과까지 반복
- **L2 (Agent Quality)**: Ground Truth 평가 → 점수 미달 시 원인 분석 → 수정 → 재평가
- **L3 (Sprint Daily)**: 진행 분석 → 블로커/리스크 → 계획 조정 → 다음 날 우선순위

## Design Principles

- **Start simple, add complexity only when measured** (Anthropic)
- **Agent = Model + Harness; Harness = Guides + Sensors** (Martin Fowler)
- **Quality Left** — 빠른 검사 먼저, 비싼 검사 나중에
- **Tool consolidation > proliferation** — 적은 수의 강력한 도구
- **Error messages as prompts** — 에이전트가 다음 행동을 알 수 있게
- **Context = finite resource** — Just-In-Time 로딩

## Tech Stack

- **Framework**: Strands Agents SDK (기본), 다른 프레임워크도 지원
- **Platform**: Amazon Bedrock, Bedrock AgentCore
- **Coding Agent**: Claude Code
- **Evaluation**: Tier 1 (로컬 LLM-as-Judge) + Tier 2 (AgentCore Evaluations)

## Project Structure

```
3a-workflows/
├── .claude-plugin/plugin.json    # Plugin metadata
├── .mcp.json                     # MCP server config
├── agents/                       # Sub-agents
│   └── kickoff-agent.md
├── commands/                     # Slash commands (8)
├── hooks/                        # Quality control hooks
│   ├── hooks.json
│   └── scripts/
├── scripts/                      # Utility scripts
└── templates/                    # 4 essential templates
```

Sprint 실행 시 고객 프로젝트에 `.3a/` 디렉토리가 생성되어 sprint state를 관리합니다.

## Implementation Phases

| Phase | Status | 범위 |
|---|---|---|
| 1. Core | Done | plugin.json, kickoff-agent, /3a-kickoff, /3a-feature, hooks, templates |
| 2. Quality | Next | review-agent, eval-agent, /3a-review, /3a-eval (Tier 1) |
| 3. Workflow | Planned | /3a-status, /3a-checkpoint, /3a-deploy, /3a-handoff, deploy-agent |
| 4. Skills | Planned | 9 SKILL.md + 필요한 references 점진 추가 |
| 5. Visual | Planned | Visual Companion (브라우저 기반 대시보드) |

## References

- [Anthropic: Building Effective Agents](https://docs.anthropic.com/en/docs/build-with-claude/agent-components)
- [Anthropic: Writing Tools for Agents](https://docs.anthropic.com/en/docs/build-with-claude/tool-use)
- [Anthropic: Context Engineering](https://docs.anthropic.com/en/docs/build-with-claude/context-engineering)
- [Martin Fowler: Harness Engineering](https://martinfowler.com/articles/building-agent-harness.html)
- [AWS: AgentCore Best Practices](https://aws.amazon.com/blogs/machine-learning/building-ai-agents-in-enterprises-best-practices-with-amazon-bedrock-agentcore/)
