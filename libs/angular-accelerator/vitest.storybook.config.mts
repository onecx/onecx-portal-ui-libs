import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { storybookAngularVitest } from '@storybook/angular-vite/vitest'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const workspaceRoot = path.resolve(dirname, '../..')

// Reuse the Storybook build options so the tests render the stories exactly like the published Storybook.
// The paths in project.json are workspace-relative.
const storybookOptions = JSON.parse(readFileSync(path.join(dirname, 'project.json'), 'utf8')).targets['build-storybook']
  .options

// Renders every story in Chromium and runs the a11y addon (axe-core) against it, see `parameters.a11y` in .storybook/preview.ts.
// Run with `npx nx run angular-accelerator:test-a11y` or `npm run test:a11y`.
export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          storybookAngularVitest({
            zoneless: storybookOptions.zoneless,
            styles: storybookOptions.styles.map((style: string) => path.resolve(workspaceRoot, style)),
          }),
          storybookTest({ configDir: path.join(dirname, '.storybook') }),
        ],
        test: {
          name: 'angular-accelerator-storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
})
