import * as z from 'zod';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { theme } from '../src/lib/topics/current-themes/v1/current-themes.schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const jsonSchema = z.toJSONSchema(theme);

const outputDir = join(__dirname, '..', '..', '..', 'dist', 'libs', 'integration-interface');
const outputPath = join(outputDir, 'current-themes.schema.json');

mkdirSync(outputDir, { recursive: true });
writeFileSync(outputPath, JSON.stringify(jsonSchema, null, 2) + '\n');

console.log(`JSON schema written to ${outputPath}`);
