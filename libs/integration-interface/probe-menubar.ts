import { collectAxisScopes } from './src/lib/topics/current-themes/v1/schema/test-utils'

const scopes = collectAxisScopes('v2.usages.menubar')
console.log('SIZE', scopes.size)
for (const [s, a] of scopes) console.log(s, JSON.stringify(a))
