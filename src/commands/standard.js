import { getStagedDiff } from "../git.js";
import { log, LOG_LEVELS } from "../utils/logger.js";
import fs from "fs";
import { codingStandardsPrompt } from "../prompts.js";
import { getSuggestion } from "../copilot.js";
import { writeTempFile, measureWithSpinner, removeFile } from "../utils/utils.js";
import { cleanAndFormatCopilotOutput } from "../utils/formatter.js";
import { COLOR_NAMES, printBox, logCopilotResponse } from "../utils/logger.js";

export async function handleStandard(config) {
  const diff = await getStagedDiff();
  if (!diff) {
    log(LOG_LEVELS.INFO, "No staged changes to analyze.");
    return;
  }

  const standardsPath = config.config.teamCodingStandards;
  if (!fs.existsSync(standardsPath)) {
    log(
      LOG_LEVELS.WARNING,
      `Team coding standards file not found at path: ${standardsPath}. Please check your configuration.`,
    );
  }

  const standardsContent = fs.readFileSync(standardsPath, "utf-8");
  if (!standardsContent) {
    log(
      LOG_LEVELS.WARNING,
      `Team coding standards file is empty or could not be read: ${standardsPath}.`,
    );
  }

  log(LOG_LEVELS.INFO, "Generating standards report with GitHub Copilot...");
  const prompt = codingStandardsPrompt(diff, standardsContent);
  const tmpFilePath = writeTempFile(prompt, "copilot_standard", ".prompt.md");
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

  const standardReview = cleanAndFormatCopilotOutput(rawSuggestion, "-s");

  printBox("📏 STANDARD COMMAND RESULTS", standardReview, COLOR_NAMES.GREEN);
}
