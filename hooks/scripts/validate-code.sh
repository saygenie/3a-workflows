#!/bin/bash
# PreToolUse hook: Framework-neutral code validation
# Runs on Write/Edit operations — checks for common security issues
# Does NOT check framework-specific patterns (that's review-agent's job)
#
# Input: JSON via stdin with tool_input containing file_path and content

# Read JSON input from stdin
INPUT=$(cat)

# Extract file path from tool input
FILE_PATH=$(echo "$INPUT" | python3 -c "
import json, sys
data = json.load(sys.stdin)
ti = data.get('tool_input', {})
print(ti.get('file_path', ti.get('file', '')))
" 2>/dev/null)

# Extract content (for Write) or new_string (for Edit)
CONTENT=$(echo "$INPUT" | python3 -c "
import json, sys
data = json.load(sys.stdin)
ti = data.get('tool_input', {})
print(ti.get('content', ti.get('new_string', '')))
" 2>/dev/null)

# Skip non-code files
case "$FILE_PATH" in
    *.md|*.txt|*.json|*.yaml|*.yml|*.toml|*.cfg|*.ini|*.html|*.css)
        exit 0
        ;;
esac

WARNINGS=""

if [ -n "$CONTENT" ]; then
    # AWS access keys
    if echo "$CONTENT" | grep -qE 'AKIA[0-9A-Z]{16}'; then
        WARNINGS="${WARNINGS}Possible AWS access key detected. "
    fi

    # Generic secret patterns
    if echo "$CONTENT" | grep -qiE '(password|secret|api_key|apikey|token)\s*=\s*["\x27][^"\x27]{8,}'; then
        WARNINGS="${WARNINGS}Possible hardcoded secret/credential detected. "
    fi

    # .env file being created
    if [[ "$FILE_PATH" == *".env"* ]] && [[ "$FILE_PATH" != *".env.example"* ]]; then
        WARNINGS="${WARNINGS}Writing to .env file — ensure it is in .gitignore. "
    fi
fi

if [ -n "$WARNINGS" ]; then
    echo "${WARNINGS}Consider using environment variables or AWS Secrets Manager instead." >&2
    exit 2
fi
