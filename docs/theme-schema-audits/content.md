# Content theme schema audit

## Confirmed schema structure

- **Content** (the standalone `content` usage — `ocx-content` / `.ocx-card`) — a static container card. It carries **no variant, no state, and no severity**, so its tokens sit directly at the top level with no axis wrapper. Its "mandatory baseline" is the whole token set: every root token and the `title` child's tokens carry a default.
  - **Title** (`contentTitle`) — a minimal, specific child. It is the distinct heading `OcxContentDirective` prepends (element id `ocx_content_title_element`) when a `title` is passed. Only `color` and `font` differ from the card's own typography (a larger, medium-weight heading), so it is a small, specific child rather than a reuse of a generic usage. It carries no variants/states/severities of its own.
- The card is CSS-only: `content` has no PrimeNG preset usage-mapping rule — its styles are emitted entirely through the `contentCssRules` companion CSS (`.ocx-card` and `#ocx_content_title_element`). There is no `settings` subtree.

## Structural gap list and resolutions

| Gap in previous schema | Resolution |
| --- | --- |
| Single file `content.ts` held both `content` and `contentTitle` inline. | Split into a directory: `content/content.ts` (card) + `content/title.ts` (title child); the old `content.ts` path became a thin re-export facade so existing imports (`current-themes.schema.ts`, `theme-path.types.ts`) are unchanged. |
| Zod leaf defaults were baked inline via `.default()` / `.prefault({})` on the schema itself (`content`, `contentTitle`). | Adopted the shape/defaults separation pattern: `contentShape` is a pure all-`.optional()` shape, `contentDefaults` is a plain defaults tree, and `content = applyDefaultsRecursive(contentShape, contentDefaults)`. `contentTitle` mirrors this with `contentTitleShape` / `contentTitleDefaults`. |
| The `title` child embedded a default instance (`(contentTitle as typeof contentTitle).prefault({})`), whose `ZodPrefault` return type is not a `ZodObject`. | `contentShape.title` is now `contentTitleShape.prefault({})` (pure shape), and the title defaults are baked whole into the card defaults tree as `title: contentTitleDefaults`. This avoids the `prefault`-instance typing gotcha and keeps the child's registry id (`contentTitle`) intact. |
| Legacy spec used `expectExactTokens` / `expectExactUndefinedTokens` with a separate `describe('title')` sub-block. | Replaced with the single top-level spec carrying exactly the three required tests (parse-empty, full `parse({})` snapshot, `expectDefaultsMatchShape`). |

## Default-value decisions

| Node / path | Default decision |
| --- | --- |
| `background` | `{{primitives.area.surface.defaultState.defaultSeverity.bg}}` |
| `color` | `{{primitives.area.surface.defaultState.defaultSeverity.contrast}}` |
| `font` | family/size/weight/lineHeight/letterSpacing/style from `primitives.font.*` (size `font.size`, weight `font.weight`). |
| `paddingX` / `paddingY` | `{{primitives.space.md}}` |
| `marginX` / `marginY` | `0` / `{{primitives.space.xl}}` |
| `border` | color/style from `primitives.area.surface.defaultState.defaultSeverity.border.*`; width `{{primitives.border.width.none}}`; radius `{{primitives.border.radius.md}}`; offset `{{primitives.border.offset.none}}` |
| `shadow` | `{{primitives.shadow.md}}` |
| `title.color` | `{{primitives.area.surface.defaultState.defaultSeverity.contrast}}` |
| `title.font` | Same as card `font` except `size: font.size.lg` and `weight: font.weight.medium` (the distinct heading typography). |

All token values are unchanged from the pre-refactor schema; the audit preserved the exact default tree and re-expressed it as shape + defaults.

## Changes applied

- Created `schema/content/content.ts` (`contentShape` / `contentDefaults` / `content`) and `schema/content/title.ts` (`contentTitleShape` / `contentTitleDefaults` / `contentTitle`), preserving the `content` and `contentTitle` registry ids.
- Rewrote `schema/content.ts` as a compatibility re-export facade (no import-site changes required).
- Removed the legacy single-file `schema/content.spec.ts`.
- No CSS/mapper changes were needed: `content.rules.ts` (`usages/content.rules.ts`) reads `usages.content.*` and `usages.content.title.*`, paths that are byte-for-byte unchanged by the refactor; there is no PrimeNG usage-mapping rule for `content`.

## Testing

- Added the single top-level spec at `schema/content/content.spec.ts` with the three required tests and the full `parse({})` snapshot at `schema/content/__snapshots__/content.spec.ts.snap`. The snapshot's default token tree is identical to the values the legacy spec asserted.
- `content/content.spec.ts` passes: 3 tests, 1 snapshot.
- Pre-existing, unrelated: the full `nx test integration-interface` run is blocked by a stale `MessageSettingsSchema` import in `utils/axis-metadata.spec.ts` (`message/settings.ts` now exports `messageSettingsShape`). That file is outside this audit's scope and is not touched by these changes.
