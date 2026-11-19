import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import * as ts from 'typescript'
import { libraries, tsConfig, workspaceRoot } from './workspace'

/**
 * Dependencies of a file, resolved with the workspace path aliases.
 * `files` are workspace-relative paths of other files in the libraries, `packages` the imported npm package names.
 */
export interface FileDependencies {
  files: string[]
  packages: string[]
}

// ArchUnitTS only follows `import` declarations. Re-exports (`export * from`), `import()`, `require()` and
// `import('x').Type` are dependencies as well, so the rules use this graph for the dependency checks.
let graph: Map<string, FileDependencies> | undefined

export function dependencyGraph(): Map<string, FileDependencies> {
  graph ??= buildGraph()
  return graph
}

/** Dependencies of a workspace-relative file path, empty for files outside the libraries. */
export function dependenciesOf(file: string): FileDependencies {
  return dependencyGraph().get(file) ?? { files: [], packages: [] }
}

function buildGraph(): Map<string, FileDependencies> {
  const { config } = ts.readConfigFile(tsConfig, ts.sys.readFile)
  const { options } = ts.parseJsonConfigFileContent(config, ts.sys, workspaceRoot)
  const resolutionCache = ts.createModuleResolutionCache(workspaceRoot, (name) => name, options)

  const result = new Map<string, FileDependencies>()
  for (const absoluteFile of libraries.flatMap((lib) => sourceFiles(path.join(workspaceRoot, 'libs', lib)))) {
    const files = new Set<string>()
    const packages = new Set<string>()
    for (const specifier of moduleSpecifiers(absoluteFile)) {
      const resolved = ts.resolveModuleName(specifier, absoluteFile, options, ts.sys, resolutionCache).resolvedModule
      if (resolved && !resolved.isExternalLibraryImport && !resolved.resolvedFileName.includes('/node_modules/')) {
        files.add(toWorkspacePath(resolved.resolvedFileName))
      } else if (!specifier.startsWith('.')) {
        packages.add(packageName(specifier))
      }
    }
    result.set(toWorkspacePath(absoluteFile), { files: [...files], packages: [...packages] })
  }
  return result
}

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      return entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'dist'
        ? []
        : sourceFiles(fullPath)
    }
    return /\.tsx?$/.test(entry.name) ? [fullPath] : []
  })
}

/** All module specifiers of a file: imports, re-exports, import(), require(), import types and `import x = require()`. */
function moduleSpecifiers(file: string): string[] {
  const source = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, false)
  const specifiers: string[] = []
  const add = (node: ts.Node | undefined) => {
    if (node && ts.isStringLiteralLike(node)) specifiers.push(node.text)
  }
  const visit = (node: ts.Node) => {
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
      add(node.moduleSpecifier)
    } else if (ts.isImportEqualsDeclaration(node) && ts.isExternalModuleReference(node.moduleReference)) {
      add(node.moduleReference.expression)
    } else if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument)) {
      add(node.argument.literal)
    } else if (
      ts.isCallExpression(node) &&
      (node.expression.kind === ts.SyntaxKind.ImportKeyword ||
        (ts.isIdentifier(node.expression) && node.expression.text === 'require'))
    ) {
      add(node.arguments[0])
    }
    ts.forEachChild(node, visit)
  }
  visit(source)
  return specifiers
}

const toWorkspacePath = (file: string) => path.relative(workspaceRoot, file).split(path.sep).join('/')

/** `@scope/name/sub/path` -> `@scope/name`, `name/sub/path` -> `name`. */
const packageName = (specifier: string) =>
  specifier
    .split('/')
    .slice(0, specifier.startsWith('@') ? 2 : 1)
    .join('/')

/** Strongly connected components (Tarjan, iterative) with more than one file. */
export function findCycleGroups(edges: { source: string; target: string }[]): string[][] {
  const successors = new Map<string, string[]>()
  for (const { source, target } of edges) {
    if (source === target) continue
    successors.set(source, [...(successors.get(source) ?? []), target])
    if (!successors.has(target)) successors.set(target, [])
  }

  type NodeState = { index: number; lowLink: number; onStack: boolean }
  const states = new Map<string, NodeState>()
  const stack: string[] = []
  const groups: string[][] = []
  let counter = 0

  for (const start of successors.keys()) {
    if (states.has(start)) continue
    const work: { node: string; state: NodeState; next: number }[] = []
    const enter = (node: string) => {
      const state = { index: counter, lowLink: counter++, onStack: true }
      states.set(node, state)
      stack.push(node)
      work.push({ node, state, next: 0 })
    }
    enter(start)

    while (work.length) {
      const frame = work[work.length - 1]
      const targets = successors.get(frame.node) ?? []
      if (frame.next < targets.length) {
        const target = targets[frame.next++]
        const targetState = states.get(target)
        if (!targetState) {
          enter(target)
        } else if (targetState.onStack) {
          frame.state.lowLink = Math.min(frame.state.lowLink, targetState.index)
        }
        continue
      }
      work.pop()
      const parent = work[work.length - 1]
      if (parent) parent.state.lowLink = Math.min(parent.state.lowLink, frame.state.lowLink)
      if (frame.state.lowLink === frame.state.index) {
        const group: string[] = []
        for (let member = stack.pop(); member !== undefined; member = stack.pop()) {
          const memberState = states.get(member)
          if (memberState) memberState.onStack = false
          group.push(member)
          if (member === frame.node) break
        }
        if (group.length > 1) groups.push(group)
      }
    }
  }
  return groups
}
