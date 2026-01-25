// Color name constants for autocompletion and to avoid typos
export const COLOR_NAMES = {
  RESET: "reset",
  BLACK: "black",
  RED: "red",
  GREEN: "green",
  YELLOW: "yellow",
  BLUE: "blue",
  MAGENTA: "magenta",
  CYAN: "cyan",
  WHITE: "white",
  GRAY: "gray",
  ORANGE: "orange",
};

const COLORS = {
  reset: "\x1b[0m",
  black: "\x1b[30m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[38;5;100m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  gray: "\x1b[90m",
  orange: "\x1b[38;5;208m", // closest to orange in 256-color
};

export const LOG_LEVELS = {
  INFO: "info",
  ERROR: "error",
  WARNING: "warning",
  DEBUG: "debug",
};

/**
 * Log a message with a specific color.
 * @param {string} message - The message to log.
 * @param {string} color - The color name (from COLORS).
 */
export function logWithColor(message, color) {
  const colorCode = COLORS[color] || COLORS.reset;
  console.log(`${colorCode}${message}${COLORS.reset}`);
}

export function log(logLevel, ...args) {
  const now = new Date().toISOString();
  const msg = args.map(String).join(" ");

  switch (logLevel) {
    case "info":
      console.log(`${COLORS.cyan}[${now}] [info]${COLORS.reset} ${msg}`);
      break;
    case "error":
      console.error(`${COLORS.red}[${now}] [error]${COLORS.reset} ${msg}`);
      break;
    case "warning":
      console.warn(`${COLORS.orange}[${now}] [warning]${COLORS.reset} ${msg}`);
      break;
    case "debug":
      if (process.env.DEBUG) {
        console.warn(`${COLORS.gray}[${now}] [debug]${COLORS.reset} ${msg}`);
      }
      break;
    default:
      console.log(`[${now}] [info] ${COLORS.reset}${msg}${COLORS.reset}`);
  }
}
