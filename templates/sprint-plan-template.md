# Sprint Plan: {{PROJECT_NAME}}

## Overview
- **Duration:** {{N}}일 ({{START_DATE}} ~ {{END_DATE}})
- **Team:** SA: {{SA_NAME}}, Developers: {{DEV_NAMES}}
- **Goal:** {{Sprint 목표 1~2문장}}

## Architecture Decision
- **Pattern:** {{단일 에이전트 / 멀티에이전트}}
- **Framework:** {{Strands Agents SDK / LangGraph / etc.}}
- **Rationale:** {{선택 이유 — "Start simple" 원칙 기반}}

## Day-by-Day Plan

### Day 1 — Kickoff
- [ ] 4가지 산출물 생성 (Agent 정의, Tone, Tool 정의, Ground Truth)
- [ ] 아키텍처 설계 확정
- [ ] Feature 목록 생성 + assignee 할당
- [ ] 프로젝트 스캐폴딩
- [ ] OpenTelemetry 설정

### Day 2 — Core Implementation
- [ ] {{F-001: feature name}} → {{assignee}}
- [ ] {{F-002: feature name}} → {{assignee}}
- [ ] /3a-eval → baseline 수립

### Day 3 — Integration
- [ ] {{F-003: feature name}} → {{assignee}}
- [ ] /3a-review → 품질 검증
- [ ] /3a-eval → baseline 대비 개선 확인

### Day 4 — Deploy
- [ ] /3a-deploy dev
- [ ] 나머지 feature 완료
- [ ] /3a-eval → 배포 전 최종 평가

### Day 5 — Handoff
- [ ] /3a-deploy staging/prod
- [ ] /3a-handoff → 인수인계 문서

## Risk & Mitigation
| Risk | Impact | Mitigation |
|---|---|---|
| {{리스크 1}} | {{영향}} | {{대응}} |

## Success Metrics
- Eval score target: {{목표 점수}}
- Feature completion: {{N}}/{{M}} features
- Deployment: {{환경}} 배포 완료
