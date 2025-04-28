# nx-migration-utils

This library contains helpers for creating NX migrations.

Framework agnostic utility functions are located in the `src/lib/utils` directory and can be imported from `@onecx/nx-migration-utils`. 

Framework specific utilities are located in subdirectories of `src/lib` (e.g. `src/lib/angular`) and can be imported from `@onecx/nx-migration-utils/<framework>`.

## Building

Run `nx build nx-migration-utils` to build the library.

## Running unit tests

Run `nx test nx-migration-utils` to execute the unit tests via [Jest](https://jestjs.io).
