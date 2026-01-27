import debug, { type Debugger } from "debug";

export type LogLevel = "debug" | "info" | "warn" | "error";

/**
 * Logger for a single component.
 *
 * Each property is a `debug` instance with a namespace of the form:
 * `<libName>:<componentName>:<level>`
 */
export interface ComponentLogger {
  /** Logs with namespace `<libName>:<componentName>:debug`. */
  debug: Debugger;

  /** Logs with namespace `<libName>:<componentName>:info`. */
  info: Debugger;

  /** Logs with namespace `<libName>:<componentName>:warn`. */
  warn: Debugger;

  /** Logs with namespace `<libName>:<componentName>:error`. */
  error: Debugger;
}

/**
 * Function that creates a {@link ComponentLogger} for a given component name.
 *
 * @param componentName - The component name used in the namespace.
 * @returns A logger whose namespaces include the component name.
 *
 * @example
 * ```ts
 * const createLogger = createLoggerFactory("myLib");
 * const log = createLogger("AuthPanel");
 * log.warn("token missing");
 * ```
 */
export interface CreateLogger {
  (componentName: string): ComponentLogger;
}

// Bind debug.log to console.log for proper output
debug.log = console.log.bind(console);

/**
 * Creates a {@link CreateLogger} function for a given library name.
 *
 * Namespaces will follow the schema:
 * `<libName>:<componentName>:<level>`
 *
 * @param libName - The library (or application) namespace prefix.
 * @returns A function that creates component loggers.
 */
export function createLoggerFactory(libName: string): CreateLogger {
  const prefix = libName.trim();
  if (!prefix) throw new Error("createLoggerFactory(libName): libName must be a non-empty string.");

  /**
   * Creates a logger for a specific component.
   *
   * Note: This function is produced by {@link createLoggerFactory}. Its TS-Doc is
   * provided via the {@link CreateLogger} interface so editors can show it in IntelliSense.
   */
  const createLogger: CreateLogger = (componentName: string) => {
    const component = componentName.trim();
    if (!component) throw new Error("createLogger(componentName): componentName must be a non-empty string.");

    const ns = (level: LogLevel) => `${prefix}:${component}:${level}`;

    return {
      debug: debug(ns("debug")),
      info: debug(ns("info")),
      warn: debug(ns("warn")),
      error: debug(ns("error")),
    };
  };

  return createLogger;
}