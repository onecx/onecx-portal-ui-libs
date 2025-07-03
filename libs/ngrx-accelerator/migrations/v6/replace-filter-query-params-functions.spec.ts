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

      export class Effects {
        effect$ = createEffect(() => {
          return this.actions$.pipe(
            filterForQueryParamsChanged(this.router, queryParamsTypeDef, false)
          );
        });
      }
      `
    )
    await replaceFilterForQueryParamsChanged(tree)

    const content = tree.read(filePath)?.toString()

    expect(content).toEqualIgnoringWhitespace(`
      import { filterOutQueryParamsHaveNotChanged } from '@onecx/ngrx-accelerator';

      export class Effects {
        effect$ = createEffect(() => {
          return this.actions$.pipe(
            filterOutQueryParamsHaveNotChanged(this.router, queryParamsTypeDef, false)
          );
        });
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

      export class Effects {
        effect$ = createEffect(() => {
          return this.actions$.pipe(
            filterForOnlyQueryParamsChanged(this.router, queryParamsTypeDef, false)
          );
        });
      }
      `
    )
    await replaceFilterForQueryParamsChanged(tree)

    const content = tree.read(filePath)?.toString()

    expect(content).toEqualIgnoringWhitespace(`
      import { filterOutOnlyQueryParamsChanged } from '@onecx/ngrx-accelerator';

      export class Effects {
        effect$ = createEffect(() => {
          return this.actions$.pipe(
            filterOutOnlyQueryParamsChanged(this.router, queryParamsTypeDef, false)
          );
        });
      }
      `
    )
  })

  it('should not replace filterForOnlyQueryParamsChanged without related import', async () => {
    const filePath = 'src/app/component.ts'
    tree.write(
      filePath,
      `
      import { filterForNavigatedTo } from '@onecx/ngrx-accelerator';

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
      import { filterForNavigatedTo } from '@onecx/ngrx-accelerator';

      export class Component {
        ngOnInit() {
          const result = filterForOnlyQueryParamsChanged();
        }
      }
      `
    )
  })
})
