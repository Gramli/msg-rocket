import { getStagedDiff } from "../git.js";
import {
  log,
  LOG_LEVELS,
  COLOR_NAMES,
  printBox,
  logCopilotResponse,
} from "../utils/logger.js";
import { getSuggestion } from "../copilot.js";
import { generateCleanReportPrompt } from "../prompts.js";
import {
  writeTempFile,
  removeFile,
  measureWithSpinner,
} from "../utils/utils.js";
import { cleanAndFormatCopilotOutput } from "../utils/formatter.js";

export async function handleClean() {
  const diff = await getStagedDiff();
  if (!diff) {
    log(LOG_LEVELS.INFO, "No staged changes to analyze.");
    return;
  }

  const prompt = generateCleanReportPrompt(diff);

  log(LOG_LEVELS.INFO, "Generating clean report with GitHub Copilot...");
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

  logCopilotResponse(elapsedSeconds, rawSuggestion);

  const review = cleanAndFormatCopilotOutput(rawSuggestion, "-c");

  printBox("✨ CLEAN COMMAND RESULTS", review, COLOR_NAMES.MAGENTA);
}
