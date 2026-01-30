import { hasGoodUnicodeSupport } from "../utils/term.js";
import { drawTieFighter } from "../utils/drawing.js";
import { getPackageJson } from "../utils/utils.js";

export function showHelp(commandName) {
  const commands = [
    {
      name: "commit",
      icon: "📝",
      short: "Generate commit message for staged changes.",
      detail: `📝 commit - Generate commit message for staged changes in interactive mode where you can review and edit the message before committing.
  Information:
        :  Generate commit message based on staged changes
    --f :  Skip interactive review and directly commit the generated message
    --t <task1,task2,...> :  Include task references (e.g., JIRA, GitHub issues) in the commit message
  Usage:
    msg-rocket commit [--f] [--t <task1,task2,...>]
  Example:
    msg-rocket commit --t JIRA-123,GH-456`,
    },
    {
      name: "uptodate",
      icon: "🔄",
      short:
        "Update your branch with the newest code from the main branch and keep your changes safe.",
      detail: `🔄 uptodate - This command updates your branch with the newest code from the main branch and keeps your changes safe.
  Information:
        : Updates your branch with the latest code from the main branch while keeping your changes safe.
    --m <main-branch-name> : Specify the name of the main branch (default is 'master').
  Usage:
    msg-rocket uptodate [--m <main-branch-name>]
  Example:
    msg-rocket uptodate`,
    },
    {
      name: "review",
      icon: "👀",
      short: "Review the code for clean code, performance, or security.",
      detail: `👀 review - Review the code with focus on clean code, performance, or security. By default it focuses on clean code.
  Information:
          :        Focus on clean code
    --perf:        Focus on performance issues
    --sec:         Focus on security issues
  Usage:
    msg-rocket review [--perf|--sec]
  Example:
    msg-rocket review --perf`,
    },
    {
      name: "clean",
      icon: "✨",
      short:
        "Analyze debug artifacts (console.log/debugger/etc.) from staged diff and show report.",
      detail: `✨ clean - Analyze debug artifacts (console.log/debugger/etc.) from staged diff and show report.
  Usage:
    msg-rocket clean`,
    },
    {
      name: "standard",
      icon: "📏",
      short: "Check staged diff against team coding standards.",
      detail: `📏 standard - Check staged diff against team coding standards (rules injected in prompt).
  File path for team coding standards rules have to be set in config.
  Usage:
    msg-rocket standard`,
    },
    {
      name: "help",
      icon: "❓",
      short: "Show this help message.",
      detail: `❓ help - Show this help message.
  Usage:
  msg-rocket help [command-name]
  Example:
  msg-rocket help review`,
    },
  ];

  if (commandName) {
    const cmd = commands.find((c) => c.name === commandName);
    if (cmd) {
      console.log(cmd.detail);
      return;
    } else {
      console.log(`Unknown command: ${commandName}\n`);
    }
  }

  drawTieFighter(getPackageJson());

  console.log("\nCommands:");
  for (const cmd of commands) {
    console.log(`  ${hasGoodUnicodeSupport() ? cmd.icon : '#'} ${cmd.name.padEnd(10)}${cmd.short}`);
  }
  console.log("");
}