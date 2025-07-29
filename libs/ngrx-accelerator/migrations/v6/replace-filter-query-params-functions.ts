import { Tree } from "@nx/devkit";
import { replaceInFiles } from "@onecx/nx-migration-utils/angular";

export default async function replaceFilterForQueryParamsChanged(tree: Tree) {
    const srcDirectoryPath = 'src'
    
    replaceInFiles(tree, srcDirectoryPath, 'Identifier[name="filterForQueryParamsChanged"]', 'filterOutQueryParamsHaveNotChanged', 'ImportDeclaration[moduleSpecifier.text="@onecx/ngrx-accelerator"] ImportSpecifier:has(Identifier[name="filterForQueryParamsChanged"])')
    replaceInFiles(tree, srcDirectoryPath, 'Identifier[name="filterForOnlyQueryParamsChanged"]', 'filterOutOnlyQueryParamsChanged', 'ImportDeclaration[moduleSpecifier.text="@onecx/ngrx-accelerator"] ImportSpecifier:has(Identifier[name="filterForOnlyQueryParamsChanged"])')
}