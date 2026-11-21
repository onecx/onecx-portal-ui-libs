# OneCX Portal UI Libraries - Copilot Instructions

## Project Context

This is an Nx monorepo containing Angular libraries for the OneCX portal platform. The workspace includes multiple libraries providing accelerators, utilities, authentication, state management, and testing tools.

**Key Technologies:**
- Angular 20 (with standalone components and signals support)
- NgRx for state management
- PrimeNG 20 for UI components
- Jest for testing
- Nx for monorepo management
- ngx-translate for internationalization
- Module Federation for micro-frontend architecture

## General Development Guidelines

### Workspace Management

- Always change the directory to the repository root before running commands
- When creating new files, ensure they are exported in the appropriate `index.ts` files (public API)
- Use Nx library boundaries and respect the dependency graph

### Task Execution

**CRITICAL:** Always prefer running lint, test, coverage, build, and all other tasks defined in `.vscode/tasks.json` via workspace tasks. Do NOT run commands directly in the terminal that have corresponding tasks. (The Clean Code Guardrail below has no task; run it directly.)

- For testing current work: Use task `nx affected test (current work)`
- For linting current work: Use task `nx affected lint (current work)`
- For building: Use the appropriate `nx build <library>` task
- Some tasks take significant time (up to 15 minutes) - wait for completion before making further changes
- If a task doesn't fit your needs, suggest a task modification to the user rather than using direct commands

### Code Quality

- Avoid all linter errors - code must pass ESLint validation, without `eslint-disable` comments
- Avoid all SonarQube errors and code smells
- Maintain consistent code style throughout the workspace
- Use meaningful variable and function names
- Keep functions small and focused (single responsibility); the limits are enforced by the Clean Code Guardrail below

### Comments and Documentation

- Only use comments when the reason for something is not directly obvious
- Never use comments to explain what code is doing (code should be self-explanatory)
- TSDoc comments are expected and excluded from the above rule
- Document public APIs with comprehensive TSDoc
- Include usage examples in documentation for complex utilities

### External Dependencies

- When reading information about npm packages, always use the npm MCP server instead of reading directly from the npm registry
- Consider the knowledge in the PrimeNG MCP Server for PrimeNG components
- Check existing OneCX libraries before adding external dependencies

## TypeScript Guidelines

- Use strict TypeScript settings
- Avoid `any` type - use proper types or generics
- Prefer interfaces over type aliases for object shapes
- Use enums for fixed sets of values
- Leverage TypeScript utility types (`Partial`, `Pick`, `Omit`, etc.)
- Use readonly properties where appropriate
- Prefer const assertions for literal objects

## Angular Best Practices

### Modern Angular Patterns

- Prefer standalone components, directives, and pipes
- Use signals (`input()`, `output()`, `model()`) over traditional `@Input()`/`@Output()` where possible
- Leverage `computed()` for derived state
- Use `effect()` judiciously and only for side effects
- Prefer `inject()` function over constructor injection in modern code (this also keeps constructors within the 3-parameter limit of the Clean Code Guardrail below)
- Use `@if`, `@for`, `@switch` control flow syntax over structural directives

### Components

- **Reusability:** Prefer using existing components from the Angular Accelerator library or PrimeNG over creating new ones
- **Forms:** Always use Reactive Forms approach (`FormControl`, `FormGroup`, `FormArray`)
- **Inputs:** Implement ControlValueAccessor pattern for custom form inputs
- **Buttons:** Add `pButton` and `pRipple` directives to all buttons
- **Styling:** Prefer PrimeFlex/Tailwind utility classes over custom CSS classes
- **Responsiveness:** All components must be responsive and work on mobile, tablet, and desktop
- **Accessibility:** All components must be accessible (a11y) - use proper ARIA attributes, keyboard navigation, focus management
- **Internationalization:** All user-facing strings must be translatable using ngx-translate (`{{ 'KEY' | translate }}`)
- **Testing:** All components must provide a test harness for integration testing. Place harnesses in the harness folder

### Services

- Use `providedIn: 'root'` for singleton services
- Keep services focused on a single responsibility
- Avoid logic in constructors - use initialization methods
- Return observables for asynchronous operations
- Consider using signals for reactive service state
- Handle errors appropriately with meaningful error messages

### Directives

- Prefer attribute directives over structural directives
- Keep directives focused and reusable
- Document directive selectors and usage

### Pipes

- Keep pipes pure (default behavior)
- Use pipes for view transformations only
- Avoid complex logic in pipes
- Consider memoization for expensive operations

### Change Detection

- Use `OnPush` change detection strategy where possible
- Avoid detaching change detection unless absolutely necessary
- Be mindful of change detection when using signals

### Lifecycle Hooks

- Use `OnInit` for initialization logic
- Use `OnDestroy` for cleanup (consider `@UntilDestroy()` from `@ngneat/until-destroy`)
- Avoid using `OnChanges` with signals
- Understand the order of lifecycle hooks

## State Management (NgRx)

- Follow NgRx best practices and patterns
- Use feature stores for feature-specific state
- Use selectors for derived state
- Use effects for side effects and API calls
- Keep reducers pure and simple
- Use action creators for all actions
- Consider NgRx SignalStore for simpler state management needs
- Use `FakeTopic` class for mocking topic behavior in tests

## Testing Guidelines

### General Testing Principles

- **Framework:** Use Jest as the testing framework
- **Harnesses:** Prefer test harnesses for Angular component/directive/pipe tests
- **Use-Case Driven:** Create tests based on user scenarios and use cases, not implementation details
- **Coverage Requirements:**
  - **New code:** 100% coverage (Statements + Lines + Functions + Branches)
  - **Existing code:** Aim for at least 80% coverage, but don't spend excessive time on legacy code
  - Always check coverage when completing a subtask and add tests if needed
  - Output coverage results to the user
- **Organization:** Group tests logically with `describe` blocks (e.g., by tested method or feature)
- **Naming:** Use descriptive test names that explain the scenario and expected outcome

### Testing Rules

These rules apply to every new or changed `*.spec.ts` / `*.test.ts(x)` file. The Clean Code Guardrail rules below apply to tests as well (test functions up to 50 lines, files up to 250 lines: split by scenario, share setup through small factory functions).

- **Test behavior, not implementation.** Assert only what a user or a collaborator can observe: return values, emitted values, rendered DOM, and calls to injected collaborators that belong to the unit's contract. Do not assert private state, internal call order or call counts of internal steps, or timer arithmetic of an internal debounce.
- **Derive scenarios from intended behavior, not from the code.** Take them from the documentation (`docs/`, `dev-docs/`), public types and JSDoc contracts, and how callers use the unit. Never write a test only to "cover" a line or branch, and never name a test after a line or branch (no "covers remaining branch-only paths"). If the intended behavior is unclear, ask instead of recording what the code happens to do. A test that exposes a bug must fail until the bug is fixed.
- **Call only public API of the unit under test.** No `as any`, bracket access (`['member']`) or other access to private or protected members. If a line is only reachable through a private member, it is dead code (remove it) or the design needs a public entry point.
- **Mock only other classes, never the unit itself.** Use spies and mocks of the test framework (e.g. `jest.spyOn`) on injected collaborators and external modules only. Never spy on, stub or replace methods of the unit under test.
- **Name tests as scenarios** (`given <state>, when <action>, then <outcome>`), keep one scenario per test, and structure each test as arrange, act, assert without logic (no loops or conditionals) in the test body.
- **Coverage follows from behavior.** The target is 100% statement, branch, function and line coverage of non-generated code. Reach it by testing the scenarios above; remove unreachable code instead of testing it through private access.

### Test Execution Strategy

For component changes where browser verification adds value (such as interaction,
layout, styling, accessibility, or responsive behavior), use the
[test-component skill](../.agents/skills/test-component/SKILL.md) before committing.
It verifies uncommitted changes by copying fresh local library builds into a
temporary app and checking functionality and visuals with Playwright. This
complements, rather than replaces, Jest tests and harnesses.

1. Run tests for the current file only first: Use task `nx affected test (current work)`
2. Once tests pass, run the full test suite to ensure nothing else is broken
3. Review coverage report and add tests for uncovered branches
4. If unable to cover certain lines, evaluate if the code is needed or unreachable

### Testing Patterns

- Use AAA pattern (Arrange, Act, Assert)
- Mock external dependencies and services
- Use `TestBed` for Angular component/service testing
- Use component harnesses for interaction testing
- Test both success and error paths
- Test edge cases and boundary conditions
- Use `FakeTopic` for mocking topic behavior when testing services that depend on it

### Test Structure Example

```typescript
describe('ComponentName', () => {
  describe('methodName', () => {
    it('should handle success case correctly', () => {
      // Arrange
      // Act
      // Assert
    });

    it('should handle error case gracefully', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

## File Organization

- Keep related files together (component, template, styles, spec, harness)
- Use barrel exports (`index.ts`) for public APIs
- Follow the established folder structure in each library
- Separate concerns: components, services, models, utils, etc.

## Module Federation Considerations

- Be mindful of shared dependencies
- Avoid circular dependencies between micro-frontends
- Keep bundle sizes small
- Export only what's necessary from libraries

## Error Handling

- Provide user-friendly error messages
- Log errors appropriately for debugging
- Handle HTTP errors gracefully
- Consider retry logic for transient failures
- Use proper error boundaries

## Performance Considerations

- Use `OnPush` change detection strategy
- Lazy load features where appropriate
- Optimize bundle sizes
- Use virtual scrolling for large lists
- Memoize expensive computations
- Unsubscribe from observables to prevent memory leaks

## Accessibility (a11y)

- Use semantic HTML elements
- Provide proper ARIA labels and roles
- Ensure keyboard navigation works
- Maintain proper focus management
- Test with screen readers
- Ensure sufficient color contrast
- Provide text alternatives for images

## Clean Code Guardrail

After the work is done and **before every commit**, stage your changes (`git add <files>`) and run the OneCX guardrail on them. It is a deterministic Clean Code and architecture check (function and file size, complexity, nesting, parameters, boolean flags, fan-out, cycles, duplicates, suppressions). Any non-zero exit code means: do not commit (`1` = violations, `2` = tool error; fix the setup, do not skip the check). There is no workspace task for it; run the snippet directly from the repository root. It needs Node 20+ and, for the fallback, an authenticated `gh` CLI.

```sh
G="${TMPDIR:-/tmp}/onecx-guardrail"
if npm view @onecx/guardrail version >/dev/null 2>&1; then
  npx --prefer-offline -y @onecx/guardrail@latest --staged
else
  # not yet on npmjs.org: use the latest GitHub release (npm tarball) directly
  rm -rf "$G" && mkdir -p "$G" \
    && gh release download --repo onecx/onecx-guardrail --pattern 'onecx-guardrail-*.tgz' --dir "$G" \
    && npm install --silent --no-audit --no-fund --prefix "$G" "$G"/onecx-guardrail-*.tgz \
    && "$G/node_modules/.bin/onecx-guardrail" --staged
fi
```

Rules:

- **New code must be compliant.** New files and new functions/methods must meet all thresholds: functions and methods at most 25 non-blank, non-comment lines (50 in `*.spec.ts` / `*.test.ts`); files at most 250; cyclomatic complexity at most 10; cognitive complexity at most 15; nesting depth at most 3; at most 5 `case` branches per `switch`; at most 3 parameters; no boolean flag parameters; at most 15 non-type imports per file; no new circular dependencies; no new copy-paste.
- **Old code follows the boy scout rule.** Existing violations may stay, but no metric that is already over its limit may grow and nothing may newly cross a limit (compared against `HEAD`, or against `.guardrail-baseline.json` if present). A legacy file that is over 250 lines fails on any net growth, so put new code into a new file. Every time you touch legacy code, also leave it better than you found it: split the function you change, replace boolean flags or long parameter lists with options objects, remove a dependency cycle you run into. Keep such cleanups behaviour-neutral and covered by tests.
- **Never hide violations.** Do not add suppression comments (`eslint-disable`, `@ts-ignore`, `@ts-expect-error`, `jscpd:ignore`) and do not edit the guardrail configuration or a baseline to make the check pass. Fix the design instead, as described in the tool output (extract functions, guard clauses, parameter objects, strategy maps, smaller modules).
- Shell variables may not survive between commands: re-run the whole snippet above, not only its last line, until it prints `[ONECX-GUARDRAIL PASSED]`, then commit.

## Version Control

- Write clear, descriptive commit messages
- Keep commits focused and atomic
- Follow conventional commit format if established
- Review changes before committing

## Documentation

- Document complex algorithms or business logic
- Provide usage examples for utilities and services
- Keep documentation up-to-date with code changes
- Document breaking changes
- Use TSDoc for public APIs
