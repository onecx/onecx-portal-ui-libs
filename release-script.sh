#!/bin/bash
VERSION=14.3.1
packageJsonData=$(cat package.json)
topLevelPackageVersion=$(echo "$packageJsonData" | jq -r '.version')
echo $topLevelPackageVersion
if [ $topLevelPackageVersion != $VERSION ]
then
    echo Version is not up to date
    npx -p replace-json-property rjp ./package.json version $VERSION
fi

folder_names=()
directory="libs"
while IFS= read -r folder; do
    folder_names+=("$folder")
done < <(find "$directory" -mindepth 1 -maxdepth 1 -type d | awk -F "/" '{print $NF}' | sort | uniq)

for folder in "${folder_names[@]}"; do
    packageJsonDataLib=$(cat libs/angular-accelerator/package.json)
    libPackageVersion=$(echo "$packageJsonDataLib" | jq -r '.version')
    peerDependencies=$(echo "$packageJsonDataLib" | jq -r '.peerDependencies')
    ocx_properties=$(echo "$packageJsonDataLib" | jq -r '."@onecx/accelerator"')
    packageJsonDataLib=$(echo "$packageJsonDataLib" | sed -E 's/(@onecx[^"]+?": *?")([^"]+)"/\1^'$libPackageVersion'"/')
    echo "$packageJsonDataLib" > libs/angular-accelerator/package.json
    # 
    if [ $libPackageVersion != $VERSION ]
then
    echo Version is not up to date
    npx -p replace-json-property rjp libs/$folder/package.json version $VERSION
    #npx nx run-many -t test
    ## the keyword test will be removed later and replaced with release
    #npx nx run $folder:test
fi  
done


