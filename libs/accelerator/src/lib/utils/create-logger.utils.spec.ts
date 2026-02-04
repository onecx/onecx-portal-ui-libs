import debug from "debug";

import { createLoggerFactory } from "./create-logger.utils";

describe("createLoggerFactory", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("creates loggers with the expected namespace format", () => {
    const debugSpy = jest.spyOn(debug, "default");

    const createLogger = createLoggerFactory("my-lib");
    const log = createLogger("MyComponent");

    log.debug("d");
    log.info("i");
    log.warn("w");
    log.error("e");

    expect(debugSpy).toHaveBeenCalledWith("my-lib:MyComponent:debug");
    expect(debugSpy).toHaveBeenCalledWith("my-lib:MyComponent:info");
    expect(debugSpy).toHaveBeenCalledWith("my-lib:MyComponent:warn");
    expect(debugSpy).toHaveBeenCalledWith("my-lib:MyComponent:error");
  });

  it("trims libOrAppName and componentName", () => {
    const debugSpy = jest.spyOn(debug, "default");

    const createLogger = createLoggerFactory("  accelerator  ");
    createLogger("  Topic  ").info("x");

    expect(debugSpy).toHaveBeenCalledWith("accelerator:Topic:info");
  });

  it("throws for an empty libOrAppName", () => {
    expect(() => createLoggerFactory("  ")).toThrow(
      "createLoggerFactory(libOrAppName): libOrAppName must be a non-empty string."
    );
  });

  it("throws for an empty componentName", () => {
    const createLogger = createLoggerFactory("my-lib");

    expect(() => createLogger("\n\t ")).toThrow(
      "createLogger(location): location must be a non-empty string."
    );
  });
});
