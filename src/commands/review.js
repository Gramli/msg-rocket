import { log, LOG_LEVELS } from "../utils/logger.js";
import { reviewPrompt } from "../prompts.js";
import { getSuggestion } from "../copilot.js";
import { writeTempFile } from "../utils/utils.js";
import { getStagedDiff } from "../git.js";
import { measureWithSpinner } from "../utils/utils.js";
import { cleanCopilotOutput } from "../utils/formatter.js";
import { COLOR_NAMES } from "../utils/logger.js";
import { removeFile } from "../utils/utils.js";

export async function handleReview(flags, config) {
  const diff = await getStagedDiff();
  if (!diff) {
    log(LOG_LEVELS.INFO, "No staged changes to review.");
    return;
  }

  log(LOG_LEVELS.INFO, "Reviewing changes...");
  await analyzeDiff(diff, flags);
}

export async function analyzeDiff(diff, flags) {
  let focus = "clean";
  if (flags.hasFlag("--perf")) {
    focus = "perf";
  } else if (flags.hasFlag("--sec")) {
    focus = "sec";
  }

  const prompt = reviewPrompt(diff, focus);
  const tmpFilePath = writeTempFile(prompt, "copilot_review", ".prompt.md");
  const { result: rawSuggestion, elapsedSeconds } = await measureWithSpinner(
    () => getSuggestion(tmpFilePath),
    "Waiting for Copilot response... ",
  );

   removeFile(tmpFilePath, (file) =>
    log(
      LOG_LEVELS.WARNING,
      "Warning: Could not delete temp prompt file:",
      file,
    ),
  );

  log(LOG_LEVELS.DEBUG, `Copilot response time: ${elapsedSeconds} seconds`);
  log(LOG_LEVELS.DEBUG, "Raw suggestion from Copilot:", rawSuggestion);

  const review = cleanCopilotOutput(
    cleanCopilotCommitMessageOutput(rawSuggestion),
  );

  printBox("👀 REVIEW COMMAND RESULTS", review, COLOR_NAMES.CYAN);
}

function cleanCopilotCommitMessageOutput(commitMsg) {
  if (commitMsg) {
    return commitMsg
      .split("\n")
      .filter((line) => line.trim().startsWith("-r"))
      .map((line) => line.replace(/^-r\s*/, "-"))
      .join("\n");
  }
  return commitMsg;
}
