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
        showHelp();
        break;
      default:
        showHelp();
    }
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

async function checkGitAndCopilot() {
  const isGitRepo = await withSimpleSpinnerResult(
    isGitRepository(),
    "Checking git repository...",
  );
  if (!isGitRepo) {
    console.error("Error: Not a git repository.");
    process.exit(1);
  }

  const copilotInstalled = await withSimpleSpinnerResult(
    checkCopilotInstalledCached(),
    "Verifying Copilot CLI...",
  );
  if (!copilotInstalled) {
    console.error(
      'Error: Standalone "copilot" CLI is not installed or not working.',
    );
    console.error(
      'Please ensure the "copilot" command is available in your PATH.',
    );
    process.exit(1);
  }
}

function showHelp() {
  console.log(
    `\x1b[36m 🚀 msg-rocket: GitHub Copilot CLI powered git assistant\x1b[0m`,
  );
  console.log(`
Commands:
  📝 commit    Generate commit message for staged changes in interactive mode where you can review and edit the message before committing.
                Information:
                      : interactive mode where you can review and edit the message before committing
                  --f : force commit staged changes with generated message and skip interactive mode
                  --t <task1,task2,...> : Specify tasks or ticket references to include in the commit message.
                Usage:
                  msg-rocket commit [--f] [--t <task1,task2,...>]
                Example:
                  msg-rocket commit --t JIRA-123,GH-456
  👀 review    Review the code with focus on clean code, performance, or security. By default it focuses on clean code.
                Information:
                        :        Focus on clean code
                  --perf:        Focus on performance issues
                  --sec:         Focus on security issues
                Usage:
                  msg-rocket review [--perf|--sec]
                Example:
                  msg-rocket review --perf
  ✨ clean     Analyze debug artifacts (console.log/debugger/etc.) from staged diff and show report.
                Usage:
                  msg-rocket clean
  📏 standard  Check staged diff against team coding standards (rules injected in prompt). 
                File path for team coding standards rules have to be set in config.
                Usage:
                  msg-rocket standard
  ❓ help      Show this help message.
  \n`);
}

main();
