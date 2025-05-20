import { Tree } from '@nx/devkit'
import { commonMigrateOnecxToV6 } from '@onecx/nx-migration-utils'

export default async function migrateOnecxToV6(tree: Tree) {
  await commonMigrateOnecxToV6(tree)
}
