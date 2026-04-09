#!/bin/bash
# Update a feature's status in .3a/features.json
# Usage: update-feature-status.sh <feature-id> <new-status>
# Status: todo | in-progress | done | blocked

FEATURE_ID="$1"
NEW_STATUS="$2"
FEATURES_FILE=".3a/features.json"

if [ -z "$FEATURE_ID" ] || [ -z "$NEW_STATUS" ]; then
    echo "Usage: update-feature-status.sh <feature-id> <new-status>"
    echo "Status options: todo, in-progress, done, blocked"
    exit 1
fi

if [ ! -f "$FEATURES_FILE" ]; then
    echo "Error: $FEATURES_FILE not found. Run /3a-kickoff first."
    exit 1
fi

# Validate status
case "$NEW_STATUS" in
    todo|in-progress|done|blocked) ;;
    *)
        echo "Error: Invalid status '$NEW_STATUS'. Use: todo, in-progress, done, blocked"
        exit 1
        ;;
esac

# Update using python3 (available on most systems)
python3 << EOF
import json
import sys
from datetime import datetime, timezone

with open("$FEATURES_FILE", "r") as f:
    data = json.load(f)

found = False
for feature in data.get("features", []):
    if feature.get("id") == "$FEATURE_ID":
        old_status = feature.get("status", "unknown")
        feature["status"] = "$NEW_STATUS"
        feature["updated_at"] = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
        found = True
        print(f"✓ {feature['id']} ({feature.get('name', 'unnamed')}): {old_status} → $NEW_STATUS")
        break

if not found:
    print(f"Error: Feature '$FEATURE_ID' not found in $FEATURES_FILE")
    sys.exit(1)

with open("$FEATURES_FILE", "w") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
    f.write("\n")
EOF
