Make sure to change the directory to the repository root before running commands.

When creating new files make sure they are included in the appropriate index.ts files (if this makes sense).

Make sure to avoid linter errors.

Make sure to avoid sonarqube errors or code smells.

Only use comments if it is not directly obvious why something is done a certain way but never to explain what the code is doing. TS-docs are excluded from this rule.  

This is very important: ALWAYS prefer running lint, test, coverage, build and all other tasks defined in .vscode/tasks.json via the workspace tasks! Reduce the usage of direct terminal commands. You are not allowed to run commands which are in the tasks via commandline. This also holds for equivalents of them. If a task is not fitting your needs or is missing and if it is a repeating tasks, suggest a change of the tasks to the user. Some of the tasks are taking much time, so please wait for them to finish before making further changes (up to 15min).

When reading information about packages from npm, always prefer using the npm MCP server instead of reading directly from the npm registry.

When writing tests use the following guidelines:

- Use Jest as the testing framework.
- Prefer the usage of test harnesses for Angular component/directive/pipe tests.
- Create use case driven tests
- Test statement coverage has be 100% (Statements + Lines + Functions + Branches) for new code. Check it when you think you are done with a subtask and add more tests if needed. If you are not able to cover some lines think about if the code is needed or if it is unreachable. For existing code, try to increase the coverage if it is below 80% but do not spend too much time on it. Output the coverage to the user.
- Group the tests logically with describe blocks (e.g. by tested method) and use descriptive test names.
- Consider using the class FakeTopic to mock the behavior of a topic when testing services that depend on it.
- Run the tests first for the file you are working on only (task: "nx affected test (current work)"). Once they pass, run the full test suite to ensure nothing else is broken.

For components consider the following guidelines:

- For buttons add pButton pRipple
- Prefer using primeflex/tailwind (depending on the project) for styling over custom css classes
- Consider the knowledge in the PrimeNg MCP Server
- Always make sure the component is responsive
- Always make sure the component is accessible (a11y)
- Prefer using existing components from the Angular Accelerator library or PrimeNg over creating new ones.
- When creating forms use Reactive Forms approach
- When creating inputs use ControlValueAccessor pattern
- Prefer using signals (input, output, model) over old style inputs/outputs where possible
- All strings have to be translatable using ngx-translate
- All components have to provide a harness for testing. Place it in the folder with the other harnesses.
