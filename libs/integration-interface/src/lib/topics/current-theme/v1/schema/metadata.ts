import { type $ZodType } from 'zod/v4/core';
import { z } from 'zod';

import { AxisGroupMetadata, LeafAxisMetadata } from './axis.model';
import { getAxisMeta } from './theme-properties-v2.schema';

function unwrap(schema: $ZodType): $ZodType {
  let current = schema;
  while (
    current instanceof z.ZodOptional ||
    current instanceof z.ZodDefault ||
    current instanceof z.ZodNullable
  ) {
    current = current.unwrap();
  }
  return current;
}

function shapeOf(schema: $ZodType): z.ZodRawShape {
  return (unwrap(schema) as z.ZodObject<z.ZodRawShape>).shape;
}

interface GroupBuilder {
  variants: string[];
  states: string[];
  severities: string[];
}

function newGroupBuilder(): GroupBuilder {
  return { variants: [], states: [], severities: [] };
}

function addName(builder: GroupBuilder, axis: 'variants' | 'states' | 'severities', name: string): void {
  if (!builder[axis].includes(name)) {
    builder[axis].push(name);
  }
}

function hasAnyAxisName(builder: GroupBuilder): boolean {
  return builder.variants.length > 0 || builder.states.length > 0 || builder.severities.length > 0;
}

function defaultOf(declarationOrder: string[], literal: string): string {
  if (declarationOrder.length === 0) {
    return literal;
  }
  return declarationOrder.includes(literal) ? literal : declarationOrder[0];
}

function finalizeGroup(builder: GroupBuilder): AxisGroupMetadata {
  return {
    variants: [...builder.variants].sort(),
    states: [...builder.states].sort(),
    severities: [...builder.severities].sort(),
    defaultVariant: defaultOf(builder.variants, 'defaultVariant'),
    defaultState: defaultOf(builder.states, 'defaultState'),
    defaultSeverity: defaultOf(builder.severities, 'defaultSeverity'),
  };
}

/**
 * Accumulates every variant/state/severity name in `node`'s axis group into
 * `builder`. A group's region spans all descendants up to, but not including,
 * `child` boundaries (each child starts its own group), so sibling axis values are
 * unioned together and nested child groups are left out.
 */
function recordRegion(node: $ZodType, builder: GroupBuilder): void {
  for (const [, child] of Object.entries(shapeOf(node))) {
    const meta = getAxisMeta(unwrap(child));
    if (meta?.axisKind === 'variant') {
      addName(builder, 'variants', meta.axisName);
      recordRegion(child, builder);
    } else if (meta?.axisKind === 'state') {
      addName(builder, 'states', meta.axisName);
      recordRegion(child, builder);
    } else if (meta?.axisKind === 'severity') {
      addName(builder, 'severities', meta.axisName);
      recordRegion(child, builder);
    }
    // 'child' and unmarked entries are not part of this group's region.
  }
}

/**
 * Walks a marked-up Zod token schema tree and produces one {@link LeafAxisMetadata}
 * entry per distinct terminal token field name. Each entry records a representative
 * path to that field and the ordered list of axis groups (outermost first) the field
 * passes through, together with each group's full applicable variant/state/severity
 * names (sorted) and its default name per axis.
 *
 * A group's axis values are unioned across all of its siblings so that the metadata
 * describes the token's full axis set rather than a single path. A `child` marker
 * closes the current axis group and opens a fresh inner one, so a token nested under
 * a child boundary carries one group per boundary crossed.
 *
 * @param schema - The root (usually variant-level) Zod schema of a usage or primitive.
 * @returns One entry per distinct terminal field name (first occurrence wins).
 */
export function deriveLeafAxisMetadata(schema: $ZodType): LeafAxisMetadata[] {
  const results: LeafAxisMetadata[] = [];
  const seenFields = new Set<string>();

  const capture = (
    node: $ZodType,
    path: string[],
    closedGroups: AxisGroupMetadata[],
    openGroup: GroupBuilder,
  ): void => {
    for (const [key, child] of Object.entries(shapeOf(node))) {
      const meta = getAxisMeta(unwrap(child));
      const childPath = [...path, key];

      if (!meta) {
        if (seenFields.has(key)) {
          continue;
        }
        seenFields.add(key);
        const leafGroups = hasAnyAxisName(openGroup)
          ? [...closedGroups, finalizeGroup(openGroup)]
          : [...closedGroups];
        results.push({ path: childPath, groups: leafGroups });
      } else if (meta.axisKind === 'child') {
        const innerClosed = hasAnyAxisName(openGroup)
          ? [...closedGroups, finalizeGroup(openGroup)]
          : closedGroups;
        const innerBuilder = newGroupBuilder();
        recordRegion(child, innerBuilder);
        capture(child, childPath, innerClosed, innerBuilder);
      } else {
        capture(child, childPath, closedGroups, openGroup);
      }
    }
  };

  const rootBuilder = newGroupBuilder();
  recordRegion(schema, rootBuilder);
  capture(schema, [], [], rootBuilder);

  return results;
}

/**
 * Returns the base-combination path segments for an axis group: its default
 * variant, default state, and default severity, in that order.
 *
 * @param group - The axis group to inspect.
 * @returns The three base-combination name segments.
 */
export function getBaseComboPath(group: AxisGroupMetadata): string[] {
  return [group.defaultVariant, group.defaultState, group.defaultSeverity];
}
