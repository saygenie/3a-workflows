#!/bin/bash
# SessionStart hook: Load sprint context if .3a/ exists

SPRINT_DIR=".3a"

if [ -d "$SPRINT_DIR" ]; then
    echo "=== 3A Sprint Active ==="

    # Show feature progress
    if [ -f "$SPRINT_DIR/features.json" ]; then
        TOTAL=$(python3 -c "import json; d=json.load(open('$SPRINT_DIR/features.json')); print(len(d.get('features',[])))" 2>/dev/null || echo "?")
        DONE=$(python3 -c "import json; d=json.load(open('$SPRINT_DIR/features.json')); print(sum(1 for f in d.get('features',[]) if f.get('status')=='done'))" 2>/dev/null || echo "?")
        echo "Features: $DONE/$TOTAL completed"
    fi

    # Show latest eval result
    LATEST_EVAL=$(ls -t "$SPRINT_DIR/eval/results/"*.json 2>/dev/null | head -1)
    if [ -n "$LATEST_EVAL" ]; then
        echo "Latest eval: $(basename "$LATEST_EVAL" .json)"
    fi

    # Show last checkpoint
    LATEST_CP=$(ls -t "$SPRINT_DIR/checkpoints/"*.md 2>/dev/null | head -1)
    if [ -n "$LATEST_CP" ]; then
        echo "Last checkpoint: $(basename "$LATEST_CP" .md)"
    fi

    echo ""
    echo "Commands: /3a-feature, /3a-status, /3a-review, /3a-eval, /3a-checkpoint, /3a-deploy, /3a-handoff"
else
    echo "No active 3A sprint found. Run /3a-kickoff to start a new sprint."
fi
