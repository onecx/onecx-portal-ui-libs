/**
 * @jest-environment node
 */

import { buttonUsageSchema } from './button.schema';
import { colorPrimitiveSchema } from './primitives.schema';
import { inputUsageSchema } from './input.schema';
import { deriveLeafAxisMetadata, getBaseComboPath } from './metadata';
import { markAxis } from './theme-properties-v2.schema';
import { type LeafAxisMetadata } from './axis.model';
import { z } from 'zod';

function findLeaf(leaves: LeafAxisMetadata[], field: string): LeafAxisMetadata {
  const leaf = leaves.find((candidate) => candidate.path[candidate.path.length - 1] === field);
  if (!leaf) {
    throw new Error(`Expected a leaf for field "${field}"`);
  }
  return leaf;
}

describe('metadata', () => {
  describe('deriveLeafAxisMetadata', () => {
    it('should derive a single background leaf with one group for the input usage schema', () => {
      const leaves = deriveLeafAxisMetadata(inputUsageSchema);

      expect(leaves).toHaveLength(1);
      expect(leaves[0].path[leaves[0].path.length - 1]).toBe('background');

      const [group] = leaves[0].groups;
      expect(group.variants).toEqual(['filled', 'outlined']);
      expect(group.states).toEqual(['defaultState', 'hover']);
      expect(group.severities).toEqual(['defaultSeverity', 'success']);
      expect(group.defaultVariant).toBe('outlined');
      expect(group.defaultState).toBe('defaultState');
      expect(group.defaultSeverity).toBe('defaultSeverity');
    });

    it('should derive background and text leaves each with a fully-default group for the color primitive', () => {
      const leaves = deriveLeafAxisMetadata(colorPrimitiveSchema);

      expect(leaves.map((leaf) => leaf.path[leaf.path.length - 1])).toEqual(['background', 'text']);
      expect(leaves.every((leaf) => leaf.groups.length === 1)).toBe(true);

      for (const leaf of leaves) {
        const [group] = leaf.groups;
        expect(group.defaultVariant).toBe('defaultVariant');
        expect(group.defaultState).toBe('defaultState');
        expect(group.defaultSeverity).toBe('defaultSeverity');
        expect(getBaseComboPath(group)).toEqual(['defaultVariant', 'defaultState', 'defaultSeverity']);
      }
    });

    it('should derive a two-group color leaf (outer variant group plus inner icon child group) for the button', () => {
      const colorLeaf = findLeaf(deriveLeafAxisMetadata(buttonUsageSchema), 'color');

      expect(colorLeaf.groups).toHaveLength(2);

      const [outer, inner] = colorLeaf.groups;
      expect(outer.variants).toEqual(['outlined', 'text']);
      expect(inner.defaultVariant).toBe('defaultVariant');
      expect(inner.defaultState).toBe('defaultState');
      expect(inner.defaultSeverity).toBe('defaultSeverity');
    });

    it('should derive a single-group background leaf with no inner child group for the button', () => {
      const backgroundLeaf = findLeaf(deriveLeafAxisMetadata(buttonUsageSchema), 'background');

      expect(backgroundLeaf.groups).toHaveLength(1);
      expect(backgroundLeaf.groups[0].variants).toEqual(['outlined', 'text']);
    });
  });

  describe('group boundary edge cases', () => {
    const severityLeaf = () => z.object({ background: z.string().optional() });

    it('should close the group when the only axis names are severities (states empty, severities present)', () => {
      const schema = z.object({ severity: markAxis(severityLeaf(), 'severity', 'only').optional() });

      const leaves = deriveLeafAxisMetadata(schema);

      expect(leaves).toHaveLength(1);
      expect(leaves[0].groups).toHaveLength(1);
      expect(leaves[0].groups[0].severities).toEqual(['only']);
      expect(leaves[0].groups[0].variants).toEqual([]);
      expect(leaves[0].groups[0].states).toEqual([]);
      expect(leaves[0].groups[0].defaultVariant).toBe('defaultVariant');
      expect(leaves[0].groups[0].defaultState).toBe('defaultState');
      expect(leaves[0].groups[0].defaultSeverity).toBe('only');
    });

    it('should not add a group for a terminal leaf reached while no axis group is open', () => {
      const schema = z.object({ plain: z.string().optional() });

      const leaves = deriveLeafAxisMetadata(schema);

      expect(leaves.map((leaf) => leaf.path[leaf.path.length - 1])).toEqual(['plain']);
      expect(leaves[0].groups).toHaveLength(0);
    });

    it('should open a fresh inner group at a root-level child boundary with no outer group', () => {
      const schema = z.object({
        icon: markAxis(
          z.object({
            v: markAxis(
              z.object({
                dSeverity: markAxis(severityLeaf(), 'severity', 'dSeverity').optional(),
              }),
              'variant',
              'v',
            ).optional(),
          }),
          'child',
          'icon',
        ).optional(),
      });

      const backgroundLeaf = findLeaf(deriveLeafAxisMetadata(schema), 'background');

      expect(backgroundLeaf.groups).toHaveLength(1);
      expect(backgroundLeaf.groups[0].variants).toEqual(['v']);
      expect(backgroundLeaf.path).toEqual(['icon', 'v', 'dSeverity', 'background']);
    });

    it('should use the first declared name as the default when a named default is absent from the group', () => {
      const schema = z.object({ severity: markAxis(severityLeaf(), 'severity', 'alpha').optional() });

      const leaves = deriveLeafAxisMetadata(schema);

      expect(leaves[0].groups[0].defaultSeverity).toBe('alpha');
    });
  });

  describe('getBaseComboPath', () => {
    it('should return the default variant, state, and severity in order', () => {
      const leaf = deriveLeafAxisMetadata(inputUsageSchema)[0];
      expect(getBaseComboPath(leaf.groups[0])).toEqual(['outlined', 'defaultState', 'defaultSeverity']);
    });
  });
});
