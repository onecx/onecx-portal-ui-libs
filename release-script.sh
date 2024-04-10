#!/bin/bash
packageJsonData=$(cat package.json)
topLevelPackageVersion=$(echo "$packageJsonData" | jq -r '.version')
if [ $topLevelPackageVersion != $VERSION ]
then
    npx -p replace-json-property rjp ./package.json version $VERSION
fi

folder_names=()
directory="libs"
while IFS= read -r folder; do
    folder_names+=("$folder")
done < <(find "$directory" -mindepth 1 -maxdepth 1 -type d | awk -F "/" '{print $NF}' | sort | uniq)

for folder in "${folder_names[@]}"; do
    packageJsonDataLib=$(cat libs/$folder/package.json)
    libPackageVersion=$(echo "$packageJsonDataLib" | jq -r '.version')
    packageJsonDataLib=$(echo "$packageJsonDataLib" | sed -E 's/(@onecx[^"]+?": *?")([^"]+)"/\1^'$VERSION'"/')
if [ $libPackageVersion != $VERSION ]
then
    npx -p replace-json-property rjp libs/$folder/package.json version $VERSION
    npx nx run $folder:release
fi  
done


