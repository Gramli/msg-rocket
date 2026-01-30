import os from "os";
import fs from "fs";
import path from "path";
import { log, LOG_LEVELS, logInfoInline } from "./logger.js";
import { fileURLToPath } from "url";

// Ensure the msgrocket temp directory exists and return its path
export function ensureMsgrocketTmpDir() {
  const dir = path.join(os.tmpdir(), "msgrocket");
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch (e) {
      // ignore
    }
  }
  return dir;
}
// Remove a file, logging a warning if it fails
export function removeFile(filePath, logFn) {
  try {
    fs.unlinkSync(filePath);
  } catch (err) {
    if (logFn) {
      logFn(filePath);
    }
    // Otherwise silent fail
  }
}

export function writeTempFile(content, prefix = "copilot_", postfix = ".tmp") {
  const dir = ensureMsgrocketTmpDir();
  log(LOG_LEVELS.DEBUG, "Writing prompt to temporary file for Copilot CLI.");
  const tmpFilePath = path.join(dir, `${prefix}${Date.now()}${postfix}`);
  fs.writeFileSync(tmpFilePath, content, "utf-8");
  log(LOG_LEVELS.DEBUG, "Prompt written to temporary file: ", tmpFilePath);
  return tmpFilePath;
}

function runWithSpinner(promise, message, handleResult) {
  const spinnerChars = ["|", "/", "-", "\\"];
  let i = 0;
  // Print the spinner message with log formatting, but inline (no newline)
  logInfoInline(message);
  const interval = setInterval(() => {
    process.stdout.write("\b" + spinnerChars[i++ % spinnerChars.length]);
  }, 100);
  const cleanup = () => {
    clearInterval(interval);
    process.stdout.write("\b\n"); // Move to new line after spinner ends
  };
  return handleResult(promise, cleanup);
}

// Simple spinner utility (does not return value)
export function withSimpleSpinner(promise, message = "Working...") {
  return runWithSpinner(promise, message, (p, cleanup) => p.finally(cleanup));
}

// Spinner utility for promise-returning functions that return a value
export async function withSimpleSpinnerResult(promise, message = "Working...") {
  return runWithSpinner(promise, message, async (p, cleanup) => {
    try {
      return await p;
    } finally {
      cleanup();
    }
  });
}

// Measure the elapsed time (in seconds) of an async function while showing a spinner.
// Returns: { result, elapsedSeconds }
export async function measureWithSpinner(
  asyncFn,
  spinnerMessage = "Working...",
) {
  const start = Date.now();
  const result = await withSimpleSpinnerResult(asyncFn(), spinnerMessage);
  const elapsed = ((Date.now() - start) / 1000).toFixed(2);
  return { result, elapsedSeconds: parseFloat(elapsed) };
}

export function shellescape(a) {
  var ret = [];

  a.forEach(function (s) {
    if (/[^A-Za-z0-9_\/:=-]/.test(s)) {
      s = "'" + s.replace(/'/g, "'\\''") + "'";
      s = s
        .replace(/^(?:'')+/g, "") // unduplicate single-quote at the beginning
        .replace(/\\'''/g, "\\'"); // remove non-escaped single-quote if there are enclosed between 2 escaped
    }
    ret.push(s);
  });

  return ret.join(" ");
}

/**
 * Loads version, author, and description from package.json
 * @returns {{version: string, author: string, description: string}}
 */
export function getPackageJson() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const pkgPath = path.resolve(__dirname, "../../package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  return {
    version: pkg.version || "",
    author: pkg.author || "",
    description: pkg.description || "",
    license: pkg.license || "",
  };
}
