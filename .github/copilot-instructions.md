Make sure to change the directory to the repository root before running commands.

When creating new files make sure they are included in the appropriate index.ts files (is this makes sense).

Make sure to avoid linter errors.

Only use comments if it is not directly obvious why something is done a certain way but never to explain what the code is doing.

When writing tests use the following guidelines:
- Use Jest as the testing framework.
- Prefer the usage of test harnesses for Angular component/directive/pipe tests.
- Create use case driven tests
- Test statement coverage should be 100% for new code.
- Group the tests logically with describe blocks (e.g. by tested method) and use descriptive test names.
- Run the tests first for the file you are working on only. Once they pass, run the full test suite to ensure nothing else is broken.