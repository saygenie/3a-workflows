# Tool Definition: {{TOOL_NAME}}

## 1. Name
`{{tool_function_name}}`

## 2. Parameters
| Parameter | Type | Required | Description |
|---|---|---|---|
| {{param_name}} | {{type}} | {{yes/no}} | {{설명 — 에이전트가 값을 결정할 수 있도록 구체적으로}} |

## 3. Return Format
```json
{
  "status": "success | error",
  "data": {
    "{{semantic_field}}": "{{값 — UUID 대신 의미 있는 이름 사용}}"
  }
}
```

## 4. Error Conditions
| Error | Condition | Message (에이전트가 다음 행동을 알 수 있게) |
|---|---|---|
| {{에러 이름}} | {{발생 조건}} | "{{구체적 에러 메시지 — 복구 방법 포함}}" |

## 5. Usage Guidance
- **When to use:** {{이 도구를 선택해야 하는 상황}}
- **When NOT to use:** {{다른 도구를 써야 하는 상황}}
- **Common patterns:** {{자주 쓰이는 파라미터 조합}}
- **Combine with:** {{함께 쓰이는 다른 도구}}
