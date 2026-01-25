#!/usr/bin/env node
import fs from "fs";
import { isGitRepository, getStagedDiff, getStagedFiles } from "../src/git.js";
import {
  getSuggestion,
  explain,
  checkCopilotInstalled,
} from "../src/copilot.js";
import {
  generatePRDescriptionPrompt,
  explainDiffPrompt,
} from "../src/prompts.js";
import { analyzeDiff } from "../src/analyzer.js";
import { cleanCopilotOutput, formatSection } from "../src/formatter.js";
import { handleCommit } from "../src/commands/commit.js";
import { Flags } from "../src/utils/flags.js";
import { Config } from "../src/utils/config.js";
import { log, LOG_LEVELS } from "../src/utils/logger.js";

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
      case "analyze":
        await checkGitAndCopilot();
        await handleAnalyze();
        break;
      case "explain":
        await checkGitAndCopilot();
        await handleExplain();
        break;
      case "pr":
        await checkGitAndCopilot();
        await handlePR();
        break;
      default:
        showHelp();
    }
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

async function checkGitAndCopilot(){
  console.log("Checking git repository...");
  if (!(await isGitRepository())) {
    console.error("Error: Not a git repository.");
    process.exit(1);
  }

  console.log("Checking Copilot installation...");
  if (!(await checkCopilotInstalled())) {
    console.error(
      'Error: Standalone "copilot" CLI is not installed or not working.',
    );
    console.error(
      'Please ensure the "copilot" command is available in your PATH.',
    );
    process.exit(1);
  }
}

async function handleAnalyze() {
  const diff = await getStagedDiff();
  if (!diff) {
    console.log("No staged changes.");
    return;
  }

  console.log("Analyzing changes...");
  const files = await getStagedFiles();
  const result = await analyzeDiff(diff);

  console.log(formatSection("Files Involved", files.join("\n")));
  console.log(
    formatSection("Copilot Analysis", result.raw || "No analysis returned"),
  );
  if (result.breakingDetected) {
    console.log("\n⚠️  POTENTIAL BREAKING CHANGE DETECTED\n");
  }
}

async function handleExplain() {
  const diff = await getStagedDiff();
  if (!diff) {
    console.log("No staged changes.");
    return;
  }

  console.log("Explaining changes with GitHub Copilot...");
  // Use the prompt wrap to ensure formatted query for copilot -i
  const prompt = explainDiffPrompt(diff);
  const result = await explain(prompt);
  console.log(result);
}

async function handlePR() {
  const diff = await getStagedDiff();
  if (!diff) {
    console.log("No staged changes.");
    return;
  }

  const templatePath = flags.getFlagValue("--template");
  let template = "";
  if (templatePath && fs.existsSync(templatePath)) {
    template = fs.readFileSync(templatePath, "utf-8");
  }

  console.log("Generating PR description...");
  const prompt = generatePRDescriptionPrompt(diff, template);

  // Requirement: "pr -> gh copilot suggest"
  const query = `suggest a command to echo the generated PR description. ${prompt}`;
  const rawSuggestion = await getSuggestion(query);
  const prDesc = cleanCopilotOutput(rawSuggestion);

  console.log("\nProposed PR Description:\n");
  console.log(prDesc);
}

function showHelp() {
console.log(`\x1b[36m 🚀 msg-rocket: GitHub Copilot CLI powered git assistant\x1b[0m`);
console.log(`
Commands:
  commit     Generate commit message for staged changes and commit them.
             Information:
                --i : Interactive mode to edit the generated message.
                --template <file> : Use custom template for commit message generation.
                --t <task1,task2,...> : Specify tasks or ticket references to include in the commit message.
             Usage:
                msg-rocket commit [--i] [--template <file>] [--t <task1,task2,...>]
             Example:
                msg-rocket commit --i --template ./commit_template.md --t JIRA-123,GH-456

  analyze    Analyze staged changes for potential issues.\n
  explain    Explain the staged changes in detail.\n
  pr         Generate a pull request description for staged changes. \n`);
}

main();
