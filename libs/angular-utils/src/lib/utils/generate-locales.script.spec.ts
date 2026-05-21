import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'
import { spawnSync } from 'child_process'

describe('generate-locales script', () => {
  const originalScript = path.join(process.cwd(), 'libs/angular-utils/scripts/generate-locales.js')

  it('writes angular-locales.ts when locales are present', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'genlocales-'))
    try {
      const scriptDest = path.join(tmp, 'libs/angular-utils/scripts/generate-locales.js')
      fs.mkdirSync(path.dirname(scriptDest), { recursive: true })
      fs.copyFileSync(originalScript, scriptDest)

      const localesDir = path.join(tmp, 'node_modules', '@angular', 'common', 'locales')
      fs.mkdirSync(localesDir, { recursive: true })
      // create both English and German locale files to validate inclusion
      fs.writeFileSync(path.join(localesDir, 'en.js'), "module.exports = {};\n", 'utf8')
      fs.writeFileSync(path.join(localesDir, 'de.js'), "module.exports = {};\n", 'utf8')

      const outputDir = path.join(tmp, 'libs/angular-utils/src/lib/utils')
      fs.mkdirSync(outputDir, { recursive: true })

      const res = spawnSync('node', ['libs/angular-utils/scripts/generate-locales.js'], { cwd: tmp, encoding: 'utf8' })

      expect(res.status).toBe(0)

      const outFile = path.join(tmp, 'libs/angular-utils/src/lib/utils/angular-locales.ts')
      expect(fs.existsSync(outFile)).toBe(true)
      const content = fs.readFileSync(outFile, 'utf8')

      // verify the generated import map contains entries for 'en' and 'de' and they use dynamic imports
      const lines = content.split(/\r?\n/)
      const enLine = lines.find(l => l.includes("'en'") && l.includes("@angular/common/locales/en") && l.includes('=> import('))
      const deLine = lines.find(l => l.includes("'de'") && l.includes("@angular/common/locales/de") && l.includes('=> import('))
      expect(enLine).toBeDefined()
      expect(deLine).toBeDefined()
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true })
    }
  })

  it('exits non-zero when locales path missing', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'genlocales-'))
    try {
      const scriptDest = path.join(tmp, 'libs/angular-utils/scripts/generate-locales.js')
      fs.mkdirSync(path.dirname(scriptDest), { recursive: true })
      fs.copyFileSync(originalScript, scriptDest)

      // do NOT create node_modules so the script should fail
      const res = spawnSync('node', ['libs/angular-utils/scripts/generate-locales.js'], { cwd: tmp, encoding: 'utf8' })

      // script calls process.exit(1) when locales path not found
      expect(res.status).not.toBe(0)
      expect(res.stderr || res.stdout).toMatch(/Locales path not found/)
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true })
    }
  })

  it('locales path contains en and de', () => {
    const repoScript = path.join(process.cwd(), 'libs/angular-utils/scripts/generate-locales.js')
    const repoLocalesPath = path.join(path.dirname(repoScript), '../../../node_modules/@angular/common/locales')

    if (!fs.existsSync(repoLocalesPath)) {
      // Fail the test if the locales path is missing. `en` and `de` are required locales for the UI
      throw new Error(`Repo locales path not found: ${repoLocalesPath}`)
    }

    const files = fs.readdirSync(repoLocalesPath)
    const hasEn = files.some(f => f.startsWith('en.'))
    const hasDe = files.some(f => f.startsWith('de.'))
    expect(hasEn).toBeTruthy()
    expect(hasDe).toBeTruthy()
  })
})
