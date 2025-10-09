#!/bin/bash

# This script normalizes all lcov.info files in coverage directories under each subfolder of 'reports'.
# It prepends a slash to each 'SF:' line to ensure absolute paths for SonarCloud.

set -e

# Find all first-level subdirectories in 'reports'
paths=$(find reports -maxdepth 1 -mindepth 1 -type d -exec basename {} \;)

for path in $paths; do
  lcov_path="reports/$path/coverage/lcov.info"
  if [ -f "$lcov_path" ]; then
    echo "Normalizing $lcov_path"
    # Prepend a slash to each 'SF:' line
    sed -i 's|^SF:|SF:/|' "$lcov_path"
  else
    echo "No lcov.info found at $lcov_path, skipping."
  fi
done
