#!/usr/bin/env node
import { isGitRepository } from "../src/git.js";
import { checkCopilotInstalledCached } from "../src/copilot.js";
import { handleCommit } from "../src/commands/commit.js";
import { Flags } from "../src/utils/flags.js";
import { Config } from "../src/utils/config.js";
import { withSimpleSpinnerResult } from "../src/utils/utils.js";
import { handleReview } from "../src/commands/review.js";
import { handleClean } from "../src/commands/clean.js";
import { handleStandard } from "../src/commands/standard.js";
import { handleUpToDate } from "../src/commands/up-to-date.js";
import { showHelp } from "../src/commands/help.js";
import { log, LOG_LEVELS } from "../src/utils/logger.js";
import { drawPC } from "../src/utils/drawing.js";

const args = process.argv.slice(2);
const command = args[0];
const flags = new Flags(args.slice(1));
const config = new Config();

async function main() {
  config.loadConfig();

  try {
    switch (command) {
      case "commit":
        await checkGitAndCopilot();
        await handleCommit(flags, config);
        break;
      case "uptodate":
        await checkGitAndCopilot();
        await handleUpToDate(flags);
        break;
      case "review":
        await checkGitAndCopilot();
        await handleReview(flags, config);
        break;
      case "clean":
        await checkGitAndCopilot();
        await handleClean(flags);
        break;
      case "standard":
        await checkGitAndCopilot();
        await handleStandard(config);
        break;
      case "help":
        showHelp(args[1]);
        break;
      case "draw":
        drawPC();
        break;
      default:
        showHelp();
    }
  } catch (error) {
    log(LOG_LEVELS.ERROR, error.message);
    process.exit(1);
  }
}

async function checkGitAndCopilot() {
  const isGitRepo = await withSimpleSpinnerResult(
    isGitRepository(),
    "Checking git repository...",
  );
  if (!isGitRepo) {
    log(LOG_LEVELS.ERROR, "Current directory is not a git repository.");
    process.exit(1);
  }

  const copilotInstalled = await withSimpleSpinnerResult(
    checkCopilotInstalledCached(),
    "Verifying Copilot CLI...",
  );
  if (!copilotInstalled) {
    log(LOG_LEVELS.ERROR,
      'Standalone "copilot" CLI is not installed or not working.',
    );
    log(LOG_LEVELS.ERROR,
      'Please ensure the "copilot" command is available in your PATH.',
    );
    process.exit(1);
  }
}

main();
