import { getStagedDiff } from "../git.js";
import { log, LOG_LEVELS, COLOR_NAMES, printBox } from "../utils/logger.js";
import { getSuggestion } from "../copilot.js";
import { generateCleanPrompt, generateCleanReportPrompt } from "../prompts.js";
import { writeTempFile, removeFile, measureWithSpinner  } from "../utils/utils.js";
import { cleanCopilotOutput } from "../utils/formatter.js";

export async function handleClean(flags) {
  const diff = await getStagedDiff();
  if (!diff) {
    log(LOG_LEVELS.INFO, "No staged changes to commit.");
    return;
  }

  let prompt = "";
  if (flags.hasFlag("--f")) {
    prompt = generateCleanPrompt(diff);
  } else {
    prompt = generateCleanReportPrompt(diff);
  }

  const tmpFilePath = writeTempFile(prompt, "copilot_clean", ".prompt.md");
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

  printBox("✨ CLEAN COMMAND RESULTS", review, COLOR_NAMES.MAGENTA);
}

function cleanCopilotCommitMessageOutput(commitMsg) {
  if (commitMsg) {
    return commitMsg
      .split("\n")
      .filter((line) => line.trim().startsWith("-c"))
      .map((line) => line.replace(/^-c\s*/, ""))
      .join("\n");
  }
  return commitMsg;
}
