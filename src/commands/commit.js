import fs from "fs";
import path from "path";
import { getStagedDiff, commitChanges } from "../git.js";
import { getSuggestion } from "../copilot.js";
import { generateCommitMessagePrompt } from "../prompts.js";
import { cleanCopilotOutput } from "../utils/formatter.js";
import readline from "readline";
import { measureWithSpinner } from "../utils/utils.js";
import os from "os";
import { spawnSync } from "child_process";
import { log, LOG_LEVELS, printBox, COLOR_NAMES } from "../utils/logger.js";
import { writeTempFile } from "../utils/utils.js";
import { removeFile } from "../utils/utils.js";

const force = "--f";
const taskFlag = "--t";

export async function handleCommit(flags, config) {
  log(LOG_LEVELS.INFO, "Preparing to generate commit message...");

  const diff = await getStagedDiff();
  if (!diff) {
    log(LOG_LEVELS.INFO, "No staged changes to commit.");
    return;
  }

  const template = getTemplateIfExists(config);

  log(LOG_LEVELS.INFO, "Generating commit message with GitHub Copilot...");
  const prompt = generateCommitMessagePrompt(diff, template);

  const tmpFilePath = writeTempFile(prompt, "copilot_commit", ".prompt.md");

  const { result: rawSuggestion, elapsedSeconds } = await measureWithSpinner(
    () => getSuggestion(tmpFilePath),
    "Waiting for Copilot response... ",
  );
  log(LOG_LEVELS.DEBUG, `Copilot response time: ${elapsedSeconds} seconds`);
  log(LOG_LEVELS.DEBUG, "Raw suggestion from Copilot:", rawSuggestion);

  let commitMsg = cleanCopilotOutput(
    cleanCopilotCommitMessageOutput(rawSuggestion),
  );

  removeFile(tmpFilePath, (file) =>
    log(
      LOG_LEVELS.WARNING,
      "Warning: Could not delete temp prompt file:",
      file,
    ),
  );

  if (!commitMsg) {
    commitMsg = "chore: update (Copilot failed to generate)";
  }

  commitMsg = appendTicketRefs(flags, commitMsg);

  if (!flags.hasFlag(force)) {
    commitMsg = await interactiveMode(commitMsg);
  }

  if (commitMsg) {
    log(LOG_LEVELS.INFO, "\nCommit Message:\n");
    log(LOG_LEVELS.INFO, commitMsg);
    log(LOG_LEVELS.INFO, "\nCommitting...");
    await commitChanges(commitMsg);
    log(LOG_LEVELS.INFO, "Success!");
  } else {
    log(LOG_LEVELS.INFO, "Aborted.");
  }
}

function getTemplateIfExists(config) {
  let template = "";
  if (config && config.config.msgTemplate) {
    const ct = config.config.msgTemplate;
    if (typeof ct === "string") {
      if (fs.existsSync(ct)) {
        template = fs.readFileSync(ct, "utf-8");
      } else {
        template = ct;
      }
    }
  }

  return template;
}

function appendTicketRefs(flags, commitMsg) {
  const ticketRefs = flags.getArrayArgs(taskFlag) || [];

  if (ticketRefs.length > 0) {
    const formattedTickets = ticketRefs.map((t) =>
      t.startsWith("#") ? t : `#${t}`,
    );
    commitMsg = `${commitMsg.trim()}\n-m "- Tickets: ${formattedTickets.join(" ")}"`;
  }
  return commitMsg;
}

function cleanCopilotCommitMessageOutput(commitMsg) {
  if (commitMsg) {
    return commitMsg
      .split("\n")
      .filter((line) => line.trim().startsWith("-m"))
      .join("\n");
  }
  return commitMsg;
}

async function interactiveMode(initialMsg) {
  let currentMsg = initialMsg;

  while (true) {
    printBox("📝 COMMIT COMMAND RESULTS",currentMsg, COLOR_NAMES.YELLOW);
    const answer = await new Promise((resolve) => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      rl.question("Accept? (y/n/edit): ", (ans) => {
        rl.close();
        resolve(ans.trim().toLowerCase());
      });
    });

    if (answer === "y") return currentMsg;
    if (answer === "n") return null;
    if (answer === "edit") {
      // Open the user's default editor with the current commit message for editing
      const tmpEditPath = path.join(
        os.tmpdir(),
        `copilot_edit_${Date.now()}.msg.txt`,
      );
      fs.writeFileSync(tmpEditPath, currentMsg, "utf-8");
      const editor =
        process.env.EDITOR || (process.platform === "win32" ? "notepad" : "vi");
      spawnSync(editor, [tmpEditPath], { stdio: "inherit" });
      let newMsg = "";
      try {
        newMsg = fs.readFileSync(tmpEditPath, "utf-8");
        fs.unlinkSync(tmpEditPath);
      } catch (err) {
        log(
          LOG_LEVELS.WARNING,
          "Warning: Could not read or delete temp edit file:",
          tmpEditPath,
        );
      }
      if (newMsg && newMsg.trim()) {
        currentMsg = newMsg.trim();
      }
    }
  }
}
