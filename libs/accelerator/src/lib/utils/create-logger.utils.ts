import debug, { type Debugger } from "debug";

export type LogLevel = "debug" | "info" | "warn" | "error";

/**
 * Logger for a single component.
 *
 * Each property is a `debug` instance with a namespace of the form:
 * `<libName>:<location>:<level>`
 */
export interface ComponentLogger {
  /** Logs with namespace `<libName>:<location>:debug`. */
  debug: Debugger;

  /** Logs with namespace `<libName>:<location>:info`. */
  info: Debugger;

  /** Logs with namespace `<libName>:<location>:warn`. */
  warn: Debugger;

  /** Logs with namespace `<libName>:<location>:error`. */
  error: Debugger;
}

/**
 * Function that creates a {@link ComponentLogger} for a given component name.
 *
 * @param location - Where the logger is used (e.g. component, service, directive, pipe, guard).
 * @returns A logger whose namespaces include the location.
 *
 * @example
 * ```ts
 * const createLogger = createLoggerFactory("myLib");
 * const log = createLogger("AuthPanel");
 * log.warn("token missing");
 * ```
 */
export interface CreateLogger {
  (location: string): ComponentLogger;
}

// Bind debug.log to console.log for proper output
debug.log = console.log.bind(console);

/**
 * Creates a {@link CreateLogger} function for a given library name.
 *
 * Namespaces will follow the schema:
 * `<libName>:<location>:<level>`
 *
 * @param libOrAppName - The library (or application) namespace prefix.
 * @returns A function that creates component loggers.
 */
export function createLoggerFactory(libOrAppName: string): CreateLogger {
  const prefix = libOrAppName.trim();
  if (!prefix) throw new Error("createLoggerFactory(libOrAppName): libOrAppName must be a non-empty string.");

  /**
   * Creates a logger for a specific location.
   *
   * Note: This function is produced by {@link createLoggerFactory}. Its TS-Doc is
   * provided via the {@link CreateLogger} interface so editors can show it in IntelliSense.
   */
  const createLogger: CreateLogger = (location: string) => {
    const trimmedLocation = location.trim();
    if (!trimmedLocation) throw new Error("createLogger(location): location must be a non-empty string.");

    const ns = (level: LogLevel) => `${prefix}:${trimmedLocation}:${level}`;

    return {
      debug: debug(ns("debug")),
      info: debug(ns("info")),
      warn: debug(ns("warn")),
      error: debug(ns("error")),
    };
  };

  return createLogger;
}