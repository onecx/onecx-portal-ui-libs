#!/bin/bash

m='{"migrations": []}'
p=()

f() {
  if [ -f "migrations.json" ]; then
    m=$(jq -s '.[0].migrations + .[1].migrations | unique_by(.name) | {migrations: .}' <(echo "$m") migrations.json)
    rm migrations.json
  fi
}

for d in node_modules/@onecx/*; do
  [ -d "$d" ] && p+=("@onecx/$(basename "$d")")
done

dep=$(jq -r '.dependencies | keys[] | select(startswith("@onecx/"))' package.json)
devDep=$(jq -r '.devDependencies | keys[] | select(startswith("@onecx/"))' package.json)

for e in $dep $devDep; do
  [[ ! " ${p[@]} " =~ " ${e} " ]] && p+=("$e")
done

for pkg in "${p[@]}"; do
  npx nx migrate "$pkg"
  f
done

echo "$m" > migrations.json

npx nx migrate --run-migrations --if-exists || {
  rm -rf node_modules package-lock.json
  npm i --package-lock-only
  npx nx migrate --run-migrations --if-exists
  npm i --package-lock-only
}

npm i
