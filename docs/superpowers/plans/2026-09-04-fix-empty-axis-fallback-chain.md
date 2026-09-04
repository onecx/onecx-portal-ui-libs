# Empty Axis Fallback Chain Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ensure fallback-chain generation materializes valid CSS variables when a schema axis group omits one or more dimensions.

**Architecture:** Normalize each axis dimension to a singleton containing its configured default before Cartesian expansion. Preserve the existing undefined-base behavior while ensuring severity-only, state-only, or variant-only groups still emit their supported combinations.

**Tech Stack:** TypeScript, Jest, Nx.

**Spec:** `issue.json` for `onecx/internal-tasks#545`; review thread `pr-reviews.json` comment `3931749107`.

## Global Constraints

- Keep the fallback algorithm uniform and driven by the configured axis metadata.
- Do not introduce cross-layer fallback or alter fully relaxed usage-base semantics.
- Add regression coverage at the existing `fallback-chain.spec.ts` seam.

---

### Task 1: Normalize omitted axis dimensions during Cartesian expansion

**Files:**
- Modify: `libs/integration-interface/src/lib/topics/current-theme/v1/schema/fallback-chain.ts`
- Test: `libs/integration-interface/src/lib/topics/current-theme/v1/schema/fallback-chain.spec.ts`

**Interfaces:**
- Consumes: `AxisGroupMetadata` and `cartesianCombos`.
- Produces: one valid combination for every axis group even when `variants`, `states`, or `severities` is empty.

- [ ] **Step 1: Write the failing test**

Add a `cartesianCombos` case with only severities populated and expect omitted variants/states to use `defaultVariant` and `defaultState`.

- [ ] **Step 2: Run the focused test**

Run `npx nx test integration-interface --testFile=libs/integration-interface/src/lib/topics/current-theme/v1/schema/fallback-chain.spec.ts --no-interactive`.

Expected: the new test fails because the current Cartesian product has zero rows for empty dimensions.

- [ ] **Step 3: Implement minimal normalization**

In `cartesianCombos`, use each non-empty dimension as-is and replace an empty dimension with `[group.default...]` before iterating. Leave `parentCombo`, `parentOfFullCombo`, and base-combination omission unchanged.

- [ ] **Step 4: Run the focused test again**

Run the same Nx test command and expect all fallback-chain specs to pass.

- [ ] **Step 5: Review the diff**

Confirm the change is limited to empty-axis normalization and its regression test.
