# Function to increment the version
increment_version() {
  local version=$1
  local base_version=$(echo "$version" | grep -oP '^\^?\d+\.\d+\.\d+-rc')
  local rc_version=$(echo "$version" | grep -oP '(?<=rc\.)\d+')
  local new_rc_version=$((rc_version + 1))
  echo "$base_version.$new_rc_version"
}

# Function to update the version in a given file
update_version() {
  local file=$1
  local version_path=$2
  local current_version=$(jq -r "$version_path" "$file")
  local new_version=$(increment_version "$current_version")
  jq --arg new_version "$new_version" "$version_path = \$new_version" "$file" > tmp.$$.json && mv tmp.$$.json "$file"
  echo "$new_version"
}

# Function to update dependencies starting with @onecx/
update_onecx_dependencies() {
  local file=$1
  local new_version=$2

  jq --arg new_version "$new_version" \
    '(.peerDependencies // {}) |= with_entries(if .key | startswith("@onecx/") then .value = $new_version else . end)' \
    "$file" > tmp.$$.json && mv tmp.$$.json "$file"
}

# Iterate through each directory in libs/xxx
for dir in libs/*; do
  if [ -d "$dir" ]; then
    package_json="$dir/package.json"
    migrations_json="$dir/migrations.json"

    if [ -f "$package_json" ]; then
      # Update package.json with new version
      new_version=$(update_version "$package_json" '.version')
      # update_onecx_dependencies "$package_json" "^$new_version"

      # Update migrations.json with the new version
      if [ -f "$migrations_json" ]; then
        jq --arg new_version "$new_version" \
          '(.generators[] | select(.version | startswith("6")) | .version) |= $new_version | .packageJsonUpdates["6.0.0"].version = $new_version' \
          "$migrations_json" > tmp.$$.json && mv tmp.$$.json "$migrations_json"
        echo "Version updated to $new_version in $migrations_json"
      fi

      # Update version in .ts files
      # for ts_file in "$dir/migrations/v6/"*.ts; do
      #   if [ -f "$ts_file" ]; then
      #     perl -i -pe "s/\^?6\.0\.0(-rc\.(\d+))?/'^$new_version'/ge" "$ts_file"
      #     echo "Version updated to $new_version in $ts_file"
      #   fi
      # done
    fi
  fi
done

for ts_file in "libs/nx-migration-utils/src/lib/common-migrations/"*.ts; do
  if [ -f "$ts_file" ]; then
    perl -i -pe "s/\^?6\.0\.0(-rc\.(\d+))?/'^$new_version'/ge" "$ts_file"
    echo "Version updated to $new_version in $ts_file"
  fi
done

npm run build

for dir in libs/*; do
  if [ -d "$dir" ]; then
    # Extract the directory name
    dir_name=$(basename "$dir")

    # Navigate to the dist/libs/xxx directory
    cd "dist/libs/$dir_name" || continue

    # Run npm publish with the specified registry
    npm publish --registry http://localhost:4873

    # Navigate back to the root directory
    cd ../../../
  fi
done
 