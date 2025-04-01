#!/bin/bash
set -e

echo "Fetching ESC values..."
node get-esc-values-simple.js

echo "ESC values updated. Ready for deployment."
