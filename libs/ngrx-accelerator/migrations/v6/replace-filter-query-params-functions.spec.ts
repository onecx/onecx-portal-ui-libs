import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing'
import { Tree } from '@nx/devkit'
import replaceFilterForQueryParamsChanged from './replace-filter-query-params-functions'

import '../test-utils/custom-matchers'

describe('replace-filterForQueryParamsChanged', () => {
  let tree: Tree

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace()
  })

  it('should replace filterForQueryParamsChanged with filterOutQueryParamsHaveNotChanged', async () => {
    const filePath = 'src/app/component.ts'
    tree.write(
      filePath,
      `
      import { filterForQueryParamsChanged } from '@onecx/ngrx-accelerator';

      export class Component {
        ngOnInit() {
          const result = filterForQueryParamsChanged();
        }
      }
      `
    )
    await replaceFilterForQueryParamsChanged(tree)

    const content = tree.read(filePath)?.toString()

    expect(content).toEqualIgnoringWhitespace(`
      import { filterOutQueryParamsHaveNotChanged } from '@onecx/ngrx-accelerator';

      export class Component {
        ngOnInit() {
          const result = filterOutQueryParamsHaveNotChanged();
        }
      }
      `
    )
  })

  it('should replace filterForOnlyQueryParamsChanged with filterOutOnlyQueryParamsChanged', async () => {
    const filePath = 'src/app/component.ts'
    tree.write(
      filePath,
      `
      import { filterForOnlyQueryParamsChanged } from '@onecx/ngrx-accelerator';

      export class Component {
        ngOnInit() {
          const result = filterForOnlyQueryParamsChanged();
        }
      }
      `
    )
    await replaceFilterForQueryParamsChanged(tree)

    const content = tree.read(filePath)?.toString()

    expect(content).toEqualIgnoringWhitespace(`
      import { filterOutOnlyQueryParamsChanged } from '@onecx/ngrx-accelerator';

      export class Component {
        ngOnInit() {
          const result = filterOutOnlyQueryParamsChanged();
        }
      }
      `
    )
  })

  it('should not replace filterForOnlyQueryParamsChanged without related import', async () => {
    const filePath = 'src/app/component.ts'
    tree.write(
      filePath,
      `
      import { test } from '@onecx/ngrx-accelerator';

      export class Component {
        ngOnInit() {
          const result = filterForOnlyQueryParamsChanged();
        }
      }
      `
    )
    await replaceFilterForQueryParamsChanged(tree)

    const content = tree.read(filePath)?.toString()

    expect(content).toEqualIgnoringWhitespace(`
      import { test } from '@onecx/ngrx-accelerator';

      export class Component {
        ngOnInit() {
          const result = filterForOnlyQueryParamsChanged();
        }
      }
      `
    )
  })
})
