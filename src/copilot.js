import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import { shellescape, ensureMsgrocketTmpDir } from "./utils/utils.js";
import { log, LOG_LEVELS } from "./utils/logger.js";

const COPILOT_CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

// Use a fixed name for the Copilot CLI check cache file in the msgrocket temp dir
function getCopilotCacheFilePath() {
  const dir = ensureMsgrocketTmpDir();
  return path.join(dir, "copilot_cli_check.json");
}

export async function checkCopilotInstalledCached() {
  // Try to read cache
  try {
    const cacheFile = getCopilotCacheFilePath();
    if (fs.existsSync(cacheFile)) {
      const data = JSON.parse(fs.readFileSync(cacheFile, "utf-8"));
      if (
        data &&
        data.ok !== undefined &&
        data.ts &&
        Date.now() - data.ts < COPILOT_CACHE_TTL_MS
      ) {
        return data.ok;
      }
    }
  } catch (e) {
    // Ignore cache errors, fallback to check
  }
  // Fallback: run real check
  const ok = await checkCopilotInstalled();
  // Write cache
  try {
    const cacheFile = getCopilotCacheFilePath();
    // Use writeTempFile but with fixed name, so we overwrite the cache file
    fs.writeFileSync(cacheFile, JSON.stringify({ ok, ts: Date.now() }), "utf-8");
  } catch (e) {
    // Ignore write errors
  }
  return ok;
}

export async function getSuggestion(prompt) {
  return new Promise((resolve) => {
    const args = ["copilot", "-p", `@${prompt}`];
    const escapedCommand = shellescape(args);

    const child = spawn(escapedCommand, {
      stdio: ["pipe", "pipe", "pipe"],
      shell: true,
      env: { ...process.env },
    });

    let stdoutData = "";
    let stderrData = "";

    child.stdout.on("data", (data) => {
      stdoutData += data.toString();
    });

    child.stderr.on("data", (data) => {
      stderrData += data.toString();
    });

    child.on("close", (code) => {
      log(LOG_LEVELS.DEBUG, "copilot close with code:", code);
      const output = stdoutData.trim() || stderrData.trim();

      if (code !== 0 && stderrData) {
        log(LOG_LEVELS.DEBUG, `Copilot CLI exited with code ${code}`);
        log(LOG_LEVELS.DEBUG, `stderr: ${stderrData}`);
      }

      resolve(output);
    });

    child.on("error", (err) => {
      log(LOG_LEVELS.DEBUG, "copilot error:", err);
      log(LOG_LEVELS.DEBUG, "Error executing Copilot CLI:", err.message);
      resolve(null);
    });
  });
}

export async function checkCopilotInstalled() {
  return new Promise((resolve) => {
    const args = ["copilot", "--version"];
    const escapedCommand = shellescape(args);

    const child = spawn(escapedCommand, {
      stdio: ["ignore", "ignore", "ignore"],
      shell: true,
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve("installed");
      } else {
        resolve("not_installed");
      }
    });

    child.on("error", () => {
      resolve("not_installed");
    });
  });
}
