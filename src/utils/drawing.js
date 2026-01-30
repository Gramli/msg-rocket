import { hasGoodUnicodeSupport } from "./term.js";

/**
 * Returns the character set for art based on terminal Unicode support.
 */
function getCharset(unicode) {
  if (unicode) {
    return {
      u: "🟦",
      d: "⚫",
      k: "⬛",
      w: "⬜",
      s: "  ",
      r: "🔸",
      borderH: "━",
      borderV: "┃",
      borderC: " ", // border chars
    };
  } else {
    return {
      u: "N",
      d: "@",
      k: "#",
      w: "W",
      s: " ",
      r: "*",
      borderH: "-",
      borderV: "|",
      borderC: " ",
    };
  }
}

/**
 * Draws a Tie Fighter ASCII/Unicode art, centered and boxed.
 */
export function drawTieFighter(packageInfo) {
  const terminalSupportsUnicode = hasGoodUnicodeSupport();
  const charset = getCharset(terminalSupportsUnicode);
  const textSpace = terminalSupportsUnicode ? "     " : "";

  const lines = [
    `${charset.k}${charset.s}${charset.s}${charset.s}${charset.s}${charset.s}${charset.s}${charset.s}${charset.s}${charset.k}`,
    `${charset.k}${charset.s}${charset.s}${charset.w}${charset.u}${charset.u}${charset.w}${charset.s}${charset.s}${charset.k}        \x1b[36m🚀 msg-rocket: ${packageInfo.description}\x1b[0m`,
    `${charset.k}${charset.s}${charset.w}${charset.s}${charset.d}${charset.d}${charset.s}${charset.w}${charset.s}${charset.k}        \x1b[36m${textSpace}Start with command or use help\x1b[0m`,
    `${charset.k}${charset.u}${charset.u}${charset.s}${charset.d}${charset.d}${charset.s}${charset.u}${charset.u}${charset.k}        \x1b[36m${terminalSupportsUnicode ? " " : ""}Version: v${packageInfo.version}\x1b[0m`,
    `${charset.k}${charset.s}${charset.w}${charset.s}${charset.d}${charset.d}${charset.s}${charset.w}${charset.s}${charset.k}        \x1b[36m${textSpace}Author: ${packageInfo.author}\x1b[0m`,
    `${charset.k}${charset.s}${charset.s}${charset.w}${charset.r}${charset.r}${charset.w}${charset.s}${charset.s}${charset.k}        \x1b[36m${textSpace}License: ${packageInfo.license}\x1b[0m`,
    `${charset.k}${charset.s}${charset.s}${charset.s}${charset.s}${charset.s}${charset.s}${charset.s}${charset.s}${charset.k}`,
  ];

  // Calculate centering and border
  const cols =
    process && process.stdout && process.stdout.columns
      ? process.stdout.columns
      : 60;
  const longestLineLength = Math.max(...lines.map((line) => line.length));
  const contentWidth = longestLineLength + 2;
  const padTotal = Math.max(0, cols - contentWidth);
  const padLeft = Math.floor(padTotal / 2);
  const padRight = padTotal - padLeft;
  const padL = " ".repeat(padLeft);
  const padR = " ".repeat(padRight);
  const borderTopBottom = charset.borderH.repeat(cols - 20);

  console.log("\n" + " ".repeat(10) + `\x1b[36m${borderTopBottom}\x1b[0m`);
  lines.forEach((line) => {
    const linePad = " ".repeat(longestLineLength - line.length);
    console.log(padL + line + linePad + padR);
  });
  console.log(" ".repeat(10) + `\x1b[36m${borderTopBottom}\x1b[0m`);
}
