#!/bin/bash

export BROWSER=wslview

declare -A packages
packages=(
  ["@onecx/accelerator"]="8.0.0-rc.3"
  ["@onecx/angular-accelerator"]="8.0.0-rc.3"
)

npm whoami 2>/dev/null || { echo "Login to npm!"; npm login; }

for pkg in "${!packages[@]}"; do
  for ver in ${packages[$pkg]}; do
    echo "Removing $pkg@$ver..."
    npm unpublish "$pkg@$ver"
  done
done
