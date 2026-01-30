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

export function drawPC() {
  const w = "⬜";
  const d = "⚫";
  const s = "  ";
  const width = 18;
  const height = 12;

  // Animation frame sequences
  const frameSequences = [
    [
      "W ",
      "Wa",
      "Wak ",
      "Wake",
      "Wake u",
      "Wake up ",
      "Wake up,",
      "Wake up,  ",
      "Wake up, N",
      "Wake up, Ne ",
      "Wake up, Neo",
      "Wake up, Neo. ",
      "Wake up, Neo..",
      "Wake up, Neo... ",
    ],
    [
      "T ",
      "Th  ",
      "The ",
      "The M ",
      "The Ma  ",
      "The Mat ",
      "The Matr  ",
      "The Matri ",
      "The Matrix  ",
      "The Matrix h  ",
      "The Matrix ha ",
      "The Matrix has  ",
      "The Matrix has y  ",
      "The Matrix has yo ",
      "The Matrix has you  ",
      "The Matrix has you. ",
      "The Matrix has you..",
      "The Matrix has you... ",
    ],
    [
      "F ",
      "Fo  ",
      "Fol ",
      "Folo  ",
      "Folow ",
      "Folow t ",
      "Folow th  ",
      "Folow the ",
      "Folow the w ",
      "Folow the wh  ",
      "Folow the whi ",
      "Folow the whit  ",
      "Folow the white ",
      "Folow the white r ",
      "Folow the white ra  ",
      "Folow the white rab ",
      "Folow the white rabb  ",
      "Folow the white rabbi   ",
      "Folow the white rabbit  ",
      "Folow the white rabbit. ",
    ],
  ];

  // Generate a single frame
  function generateFrame(text) {
    return [
      `${w}${w.repeat(width)}${w}`,
      `${w}${s}\x1b[5m\x1b[32m${text}\x1b[0m${s.repeat(width - Math.ceil(text.length / 2) - 1)}${w}`,
      ...Array(height - 3).fill(`${w}${s.repeat(width)}${w}`),
      `${w}${w.repeat(width)}${w}`,
      `${w}${w.repeat(width-2)}${d}${w}${w}`,
    ];
  }

  // Run a sequence of frames
  function runFrameSequence(frameTexts, delay, nextSequence) {
    let i = 0;
    const interval = setInterval(() => {
      console.clear();
      console.log("\n\n");
      generateFrame(frameTexts[i]).forEach((line) => console.log(line));
      i++;
      if (i === frameTexts.length) {
        clearInterval(interval);
        if (nextSequence) setTimeout(nextSequence, 1500);
      }
    }, delay);
  }

  // Chain all sequences
  function runAllSequences(sequences, delay) {
    let seqIdx = 0;
    function next() {
      seqIdx++;
      if (seqIdx < sequences.length) {
        runFrameSequence(sequences[seqIdx], delay, next);
      }
    }
    runFrameSequence(sequences[0], delay, next);
  }

  function startMatrixRain(durationMs) {
    const rainChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const rainCols = width;
    const rainRows = height - 2;
    let drops = Array(rainCols).fill(0).map(() => Math.floor(Math.random() * rainRows));
    const start = Date.now();
    const interval = setInterval(() => {
      console.clear();
      console.log("\n\n");
      // Top border
      console.log(`${w}${w.repeat(width)}${w}`);
      // Rain rows
      for (let row = 0; row < rainRows; row++) {
        let line = w;
        for (let col = 0; col < rainCols; col++) {
          if (drops[col] === row) {
            const char = rainChars[Math.floor(Math.random() * rainChars.length)];
            line += `\x1b[32m${char}\x1b[0m${s.slice(1)}`;
          } else {
            line += s;
          }
        }
        line += w;
        console.log(line);
      }
      // Bottom border
      console.log(`${w}${w.repeat(width)}${w}`);
      console.log(`${w}${w.repeat(width-2)}${d}${w}${w}`);
      // Move drops
      for (let i = 0; i < rainCols; i++) {
        if (Math.random() > 0.975) {
          drops[i] = 0;
        } else {
          drops[i] = (drops[i] + 1) % rainRows;
        }
      }
      if (Date.now() - start > durationMs) {
        clearInterval(interval);
      }
    }, 75);
  }

  // Patch runAllSequences to call matrix rain after last sequence
  //const origRunAllSequences = runAllSequences;
  runAllSequences = function(sequences, delay) {
    let seqIdx = 0;
    function next() {
      seqIdx++;
      if (seqIdx < sequences.length) {
        runFrameSequence(sequences[seqIdx], delay, next);
      } else {
        startMatrixRain(5000);
      }
    }
    runFrameSequence(sequences[0], delay, next);
  };

  runAllSequences(frameSequences, 250);
}
