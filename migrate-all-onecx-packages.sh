#!/bin/bash

# Initialize an empty array to store package names
packages=()

# Function to run migrations
run_migrations() {
  if ! npx nx migrate --run-migrations --if-exists; then
    # Remove node_modules and package-lock.json
    rm -rf node_modules package-lock.json

    # Install dependencies
    npm install

    # Run the migrations again
    npx nx migrate --run-migrations
  fi
  
  # Remove migrations.json if it exists
  if [ -f migrations.json ]; then
    rm migrations.json
  fi
}

# Iterate over each directory in the base directory
for dir in node_modules/@onecx/*; do
  if [ -d "$dir" ]; then
    DIR_NAME=$(basename "$dir")
    packages+=("@onecx/$DIR_NAME")
  fi
done

# Check package.json for dependencies starting with @onecx/
dependencies=$(jq -r '.dependencies | keys[] | select(startswith("@onecx/"))' package.json)
devDependencies=$(jq -r '.devDependencies | keys[] | select(startswith("@onecx/"))' package.json)

for dep in $dependencies $devDependencies; do
  if [[ ! " ${packages[@]} " =~ " ${dep} " ]]; then
    packages+=("$dep")
  fi
done

npm install

# Run migrations for all packages in the array
for package in "${packages[@]}"; do
  npx nx migrate "$package"
  run_migrations
done

npm install