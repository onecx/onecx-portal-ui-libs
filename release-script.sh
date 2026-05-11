#!/bin/bash
set -euo pipefail

echo "$1"
echo "$2"
export VERSION=$1
export CHANNEL=$2
packageJsonData=$(cat package.json)
topLevelPackageVersion=$(echo "$packageJsonData" | jq -r '.version')
if [[ $topLevelPackageVersion != $1 ]]
then
    npx -p replace-json-property rjp ./package.json version $1
fi

folder_names=()
directory="libs"
while IFS= read -r folder; do
    folder_names+=("$folder")
done < <(find "$directory" -mindepth 1 -maxdepth 1 -type d | awk -F "/" '{print $NF}' | sort | uniq)

failed_libs=()
declare -A failed_libs_errors

for folder in "${folder_names[@]}"; do
    packageJsonDataLib=$(cat libs/$folder/package.json)
    libPackageName=$(echo "$packageJsonDataLib" | jq -r '.name')
    libPackageVersion=$(echo "$packageJsonDataLib" | jq -r '.version')
    packageJsonDataLib=$(echo "$packageJsonDataLib" | sed -E 's/(@onecx[^"]+?": *?")([^"]+)"/\1^'$1'"/')
    echo $packageJsonDataLib > libs/$folder/package.json

    versionFilePath="libs/$folder/src/version.ts"
    if [[ -f "$versionFilePath" ]]
    then
        printf "export const LIB_NAME = '%s'\nexport const LIB_VERSION = '%s'\n" "$libPackageName" "$1" > "$versionFilePath"
    fi

    if [[ $libPackageVersion != $1 ]]
    then
        npx -p replace-json-property rjp libs/$folder/package.json version $1
        
        if ! release_output=$(npx nx run $folder:release 2>&1); then
            failed_libs+=("$folder")
            failed_libs_errors["$folder"]="$release_output"
        fi
    fi  
done

if [[ ${#failed_libs[@]} -gt 0 ]]; then
    echo ""
    echo "❌ Release failed for the following libraries:"
    printf '  - %s\n' "${failed_libs[@]}"
    echo ""
    echo "📋 Error Details:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    for lib in "${failed_libs[@]}"; do
        echo ""
        echo "❌ $lib:"
        echo "───────────────────────────────────────────────────────────"
        echo "${failed_libs_errors[$lib]}" | tail -30
        echo "───────────────────────────────────────────────────────────"
    done
    
    exit 1
fi


