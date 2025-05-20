#!/bin/bash

m='{"migrations": []}'
p=()

f() {
  if [ -f "migrations.json" ]; then
    m=$(jq -s '.[0].migrations + .[1].migrations | unique_by(.name) | {migrations: .}' <(echo "$m") migrations.json)
    rm migrations.json
  fi
}

# Function to collect packages recursively
collect_packages() {
  local dir=$1
  for d in "$dir"/*; do
    if [ -d "$d" ]; then
      local base=$(basename "$d")
      if [[ $base == *@* ]]; then
        if [[ $base == *nx-plugin ]]; then
          p+=("$base")
        else
          collect_packages "$d"
        fi
      else
        for subd in "$d"/*nx-plugin; do
          if [ -d "$subd" ]; then
            p+=("$base/$(basename "$subd")")
          fi
        done
      fi
    fi
  done
}

# Collect @onecx packages from node_modules
for d in node_modules/@onecx/*; do
  [ -d "$d" ] && p+=("@onecx/$(basename "$d")")
done

# Collect nx-plugin packages from node_modules and subdirectories
collect_packages "node_modules"

# Collect @onecx and nx-plugin dependencies and devDependencies from package.json
dep=$(jq -r '.dependencies | keys[] | select(startswith("@onecx/") or endswith("nx-plugin"))' package.json)
devDep=$(jq -r '.devDependencies | keys[] | select(startswith("@onecx/") or endswith("nx-plugin"))' package.json)

for e in $dep $devDep; do
  [[ ! " ${p[@]} " =~ " ${e} " ]] && p+=("$e")
done

# Remove @onecx/nx-plugin if not in dependencies or devDependencies
if [[ ! " ${dep[@]} ${devDep[@]} " =~ "@onecx/nx-plugin" ]]; then
  p=(${p[@]/@onecx\/nx-plugin})
fi

for pkg in "${p[@]}"; do
  npx nx migrate "$pkg"
  f
done

echo "$m" > migrations.json

# Install dependencies before running migrations
npm i --force

# Run migrations without re-installing packages to avoid peer dependency issues
NX_MIGRATE_SKIP_INSTALL=true npx nx migrate --run-migrations --if-exists || {
  # If migrations fail, do a clean re-install of all packages and re-run migrations
  rm -rf node_modules package-lock.json
  npm i
  NX_MIGRATE_SKIP_INSTALL=true npx nx migrate --run-migrations --if-exists || {
    # If migrations fail, do a clean re-install of all packages and re-run migrations
    rm -rf node_modules package-lock.json
    npm i
    NX_MIGRATE_SKIP_INSTALL=true npx nx migrate --run-migrations --if-exists
  }
}

# Reinstall all packages to ensure that package modifications from migrations are applied and installed
npm i
