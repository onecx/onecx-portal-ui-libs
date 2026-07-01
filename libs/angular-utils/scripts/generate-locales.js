#!/usr/bin/env node
// This script generates a TypeScript file that exports a mapping of locale identifiers to dynamic import functions for Angular locale data.
// It reads the available locale files from the @angular/common/locales directory and creates an export that can be used to dynamically load locale data in an Angular application.
// Added as a prebuild step to ensure the list of locales is always up-to-date with the installed version of @angular/common.

const fs = require('fs');
const path = require('path');

const LOCALES_PATH = path.join(__dirname, '../../../node_modules/@angular/common/locales');
const OUTPUT_FILE = path.join(__dirname, '../src/lib/utils/angular-locales.ts');

function generateLocales() {
  try {
    if (!fs.existsSync(LOCALES_PATH)) {
      console.error('Locales path not found: ' + LOCALES_PATH);
      process.exit(1);
    }

    const allFiles = fs.readdirSync(LOCALES_PATH);
    const localeSet = new Set();

    allFiles.forEach(file => {
      // Skip non-locale files that may appear in the directory - `index.d.ts` and `README.md` are not actual locale modules.
      // Prefer runtime `.js` locale files when available (they contain the actual locale data). Some installs or package distributions 
      // only include `.d.ts` type declaration files (or the `.js` might be compiled/located differently). 
      // To be robust we also accept `.d.ts` files as a fallback — extracting the locale name and adding it only if 
      // it hasn't already been added from a `.js` file. We also explicitly ignore source map files (`*.js.map`).
      if (file === 'index.d.ts' || file === 'README.md') return;
      if (file.endsWith('.js') && !file.endsWith('.js.map')) {
        localeSet.add(file.slice(0, -3));
      } else if (file.endsWith('.d.ts')) {
        const locale = file.replace(/\.d\.ts$/, '');
        if (!localeSet.has(locale)) localeSet.add(locale);
      }
    });

    const localeFiles = Array.from(localeSet).sort();
    if (localeFiles.length === 0) {
      console.error('No locale files found in @angular/common/locales');
      process.exit(1);
    }

    const imports = localeFiles
      .map(locale => `  '${locale}': () => import('@angular/common/locales/${locale}'),`)
      .join('\n');

    const content = `/**
 * AUTO-GENERATED FILE - Do not manually edit
 * 
 * This file is regenerated during every build via the generate-locales script.
 * To update locales, run: npm install (or yarn install)
 * 
 * Generated with ${localeFiles.length} available locales from @angular/common/locales
 */

export const localeLoaders: Record<string, () => Promise<any>> = {
${imports}
}
`;

    fs.writeFileSync(OUTPUT_FILE, content, 'utf8');
  } catch (err) {
    console.error('Error generating locales:', err && err.message ? err.message : err);
    process.exit(1);
  }
}

generateLocales();
