import { log, LOG_LEVELS } from "../utils/logger.js";
import { reviewPrompt } from "../prompts.js";
import { getSuggestion } from "../copilot.js";
import { writeTempFile } from "../utils/utils.js";
import { getStagedDiff } from "../git.js";
import { measureWithSpinner } from "../utils/utils.js";
import { cleanAndFormatCopilotOutput } from "../utils/formatter.js";
import { COLOR_NAMES, logCopilotResponse, printBox } from "../utils/logger.js";
import { removeFile } from "../utils/utils.js";

export async function handleReview(flags) {
  const diff = await getStagedDiff();
  if (!diff) {
    log(LOG_LEVELS.INFO, "No staged changes to analyze.");
    return;
  }

  await analyzeDiff(diff, flags);
}

export async function analyzeDiff(diff, flags) {
  let focus = "clean";
  if (flags.hasFlag("--perf")) {
    focus = "perf";
  } else if (flags.hasFlag("--sec")) {
    focus = "sec";
  }

  log(LOG_LEVELS.INFO, "Generating review with GitHub Copilot...");
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

  logCopilotResponse(elapsedSeconds, rawSuggestion);

  const review = cleanAndFormatCopilotOutput(rawSuggestion, "-r");

  printBox("👀 REVIEW COMMAND RESULTS", review, COLOR_NAMES.CYAN);
}
