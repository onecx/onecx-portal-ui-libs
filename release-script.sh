#!/bin/bash
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

for folder in "${folder_names[@]}"; do
    packageJsonDataLib=$(cat libs/$folder/package.json)
    libPackageVersion=$(echo "$packageJsonDataLib" | jq -r '.version')
    packageJsonDataLib=$(echo "$packageJsonDataLib" | sed -E 's/(@onecx[^"]+?": *?")([^"]+)"/\1^'$1'"/')
    echo $packageJsonDataLib > libs/$folder/package.json

    versionFilePath="libs/$folder/src/version.ts"
    if [[ -f "$versionFilePath" ]]
    then
        echo "export const LIB_VERSION = '$1'" > "$versionFilePath"
    fi

    if [[ $libPackageVersion != $1 ]]
    then
        npx -p replace-json-property rjp libs/$folder/package.json version $1
        npx nx run $folder:release
    fi  
done


