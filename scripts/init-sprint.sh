#!/bin/bash
# Initialize .3a/ sprint directory structure
# Called by /3a-kickoff command

SPRINT_DIR=".3a"

if [ -d "$SPRINT_DIR" ]; then
    echo "⚠ .3a/ directory already exists."
    echo "An active sprint is in progress. To start fresh, archive or remove the existing .3a/ directory first."
    echo ""
    echo "Options:"
    echo "  - Run /3a-handoff to properly close the current sprint"
    echo "  - Manually move: mv .3a .3a-backup-$(date +%Y%m%d)"
    exit 1
fi

# Create directory structure
mkdir -p "$SPRINT_DIR/architecture/decisions"
mkdir -p "$SPRINT_DIR/eval/results"
mkdir -p "$SPRINT_DIR/visual/content"
mkdir -p "$SPRINT_DIR/visual/state"
mkdir -p "$SPRINT_DIR/checkpoints"
mkdir -p "$SPRINT_DIR/handoff"

# Create .3a/.gitignore (visual session data should not be committed)
cat > "$SPRINT_DIR/.gitignore" << 'EOF'
# Visual Companion session data (not for version control)
visual/
EOF

echo "✓ .3a/ sprint directory initialized"
echo ""
echo "Structure:"
echo "  .3a/"
echo "  ├── architecture/decisions/   # ADRs"
echo "  ├── eval/results/             # Evaluation history"
echo "  ├── visual/                   # Visual Companion (gitignored)"
echo "  ├── checkpoints/              # Daily checkpoints"
echo "  └── handoff/                  # Final handoff documents"
echo ""
echo "Next: Generate 4 key deliverables (agent-definition, persona, tool-definitions, ground-truth)"
