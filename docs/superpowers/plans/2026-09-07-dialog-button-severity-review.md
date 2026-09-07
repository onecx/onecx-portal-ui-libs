# Dialog Button Severity Review Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the PrimeNG-specific explanatory comment from the public button severity property while preserving the existing type and behavior.

**Architecture:** Keep the existing `DialogButtonSeverity` type and property unchanged. Modify only the model's property documentation because the review identified it as unnecessarily implementation-specific and redundant with the self-explanatory API.

**Tech Stack:** TypeScript, Angular, Nx, Jest.

**Spec:** PR review thread on `libs/angular-accelerator/src/lib/model/button-dialog.ts:50`.

## Global Constraints

- Preserve the public `severity?: DialogButtonSeverity` API and runtime behavior.
- Keep the change scoped to the review feedback; do not alter templates, tests, or severity values.
- Verify the affected Angular Accelerator project with its existing Nx test and lint tasks.

---

### Task 1: Remove implementation-specific severity documentation

**Files:**
- Modify: `libs/angular-accelerator/src/lib/model/button-dialog.ts:45-49`

**Interfaces:**
- Consumes: Existing `DialogButtonSeverity` type and `ButtonDialogButtonDetails` interface.
- Produces: The same public `severity?: DialogButtonSeverity` property without the PrimeNG-specific property comment.

- [ ] **Step 1: Confirm the review target**

Read `libs/angular-accelerator/src/lib/model/button-dialog.ts` and verify that only the documentation immediately above `severity` refers specifically to PrimeNG.

- [ ] **Step 2: Remove the redundant comment**

Delete the four-line PrimeNG-specific comment above `severity`, leaving the property declaration unchanged:

```ts
severity?: DialogButtonSeverity
```

- [ ] **Step 3: Run focused verification**

Run `npx nx test angular-accelerator --runInBand` and `npx nx lint angular-accelerator` from the repository root. Expected: both commands complete successfully with no new errors.

- [ ] **Step 4: Review the diff**

Run `git diff --check` and confirm the diff contains only the requested documentation removal.
