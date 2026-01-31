import { hasGoodUnicodeSupport } from "../utils/term.js";

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
  ["Knock ", "Knock, Knock, Neo."],
];

class SceneState {
  constructor(width, height, terminalSupportsUnicode) {
    this.width = width;
    this.height = height;
    this.terminalSupportsUnicode = terminalSupportsUnicode;
    this.w = terminalSupportsUnicode ? "⬜" : "#";
    this.d = terminalSupportsUnicode ? "⚫" : "@";
    this.s = terminalSupportsUnicode ? "  " : " ";
  }
}

export function drawEasterEgg() {
  const terminalSupportsUnicode = hasGoodUnicodeSupport();
  const width = terminalSupportsUnicode ? 18 : 36;
  const height = 12;
  scene1(width, height, terminalSupportsUnicode);
  scene2(width, height, terminalSupportsUnicode);
}

// Generate a single frame
function generateFrame(sceneState, text) {
  return [
    `${sceneState.w}${sceneState.w.repeat(sceneState.width)}${sceneState.w}`,
    `${sceneState.w}${sceneState.s}\x1b[5m\x1b[32m${text}\x1b[0m${sceneState.s.repeat(repeatCount(sceneState, text.length))}${sceneState.w}`,
    ...Array(sceneState.height - 3).fill(
      `${sceneState.w}${sceneState.s.repeat(sceneState.width)}${sceneState.w}`,
    ),
    `${sceneState.w}${sceneState.w.repeat(sceneState.width)}${sceneState.w}`,
    `${sceneState.w}${sceneState.w.repeat(sceneState.width - 2)}${sceneState.d}${sceneState.w}${sceneState.w}`,
  ];
}

function repeatCount(sceneState, textLength) {
  return sceneState.terminalSupportsUnicode
    ? sceneState.width - Math.ceil(textLength / 2) - 1
    : sceneState.width - textLength - 1;
}

function generateArticleFrame(sceneState, text, articleText) {
  return [
    `${sceneState.w}${sceneState.w.repeat(sceneState.width)}${sceneState.w}`,
    `${sceneState.w}${sceneState.s}\x1b[5m\x1b[32m${text}\x1b[0m${sceneState.s.repeat(repeatCount(sceneState, text.length))}${sceneState.w}`,
    ...articleText.map(value =>
      `${sceneState.w}${sceneState.s}${value}${sceneState.s.repeat(repeatCount(sceneState, value.length))}${sceneState.w}`
    ),
    ...Array(sceneState.height - 3 - articleText.length).fill(
      `${sceneState.w}${sceneState.s.repeat(sceneState.width)}${sceneState.w}`,
    ),
    `${sceneState.w}${sceneState.w.repeat(sceneState.width)}${sceneState.w}`,
    `${sceneState.w}${sceneState.w.repeat(sceneState.width - 2)}${sceneState.d}${sceneState.w}${sceneState.w}`,
  ];
}

function startMatrixRain(sceneState, durationMs) {
  const rainChars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const rainCols = sceneState.width;
  const rainRows = sceneState.height - 2;
  let drops = Array(rainCols)
    .fill(0)
    .map(() => Math.floor(Math.random() * rainRows));
  const start = Date.now();
  const interval = setInterval(() => {
    console.clear();
    console.log("\n\n");
    // Top border
    console.log(
      `${sceneState.w}${sceneState.w.repeat(sceneState.width)}${sceneState.w}`,
    );
    // Rain rows
    for (let row = 0; row < rainRows; row++) {
      let line = sceneState.w;
      for (let col = 0; col < rainCols; col++) {
        if (drops[col] === row || Math.random() < 0.1) {
          const char = rainChars[Math.floor(Math.random() * rainChars.length)];
          line += `\x1b[32m${char}\x1b[0m${sceneState.s.slice(1)}`;
        } else {
          line += sceneState.s;
        }
      }
      line += sceneState.w;
      console.log(line);
    }
    // Bottom border
    console.log(
      `${sceneState.w}${sceneState.w.repeat(sceneState.width)}${sceneState.w}`,
    );
    console.log(
      `${sceneState.w}${sceneState.w.repeat(sceneState.width - 2)}${sceneState.d}${sceneState.w}${sceneState.w}`,
    );
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
  }, 100);
}

function scene1(width, height, terminalSupportsUnicode) {
  const sceneState = new SceneState(width, height, terminalSupportsUnicode);
  generateArticleFrame(sceneState, "Searching...", [
    "--------------------------------",
    "GLOBAL SEARCH ",
    "MORPHEUS ELUDES POLICE AT ",
    "HEATHROW AIRPORT",
    "Police have been unable to locate ",
    "Morpheus, who was last seen ",
    "boarding a flight to Zion.",
    "Authorities believe he may be ",
    "trying to contact Trinity.",
  ]).forEach((line) => console.log(line));
}

function scene2(width, height, terminalSupportsUnicode) {
  const sceneState = new SceneState(width, height, terminalSupportsUnicode);
  // Run a sequence of frames
  function runFrameSequence(frameTexts, delay, nextSequence) {
    let i = 0;
    const interval = setInterval(() => {
      console.clear();
      console.log("\n\n");
      generateFrame(sceneState, frameTexts[i]).forEach((line) =>
        console.log(line),
      );
      i++;
      if (i === frameTexts.length) {
        clearInterval(interval);
        if (nextSequence) setTimeout(nextSequence, 1500);
      }
    }, delay);
  }

  // Patch runAllSequences to call matrix rain after last sequence
  function runAllSequences(sequences, delay) {
    let seqIdx = 0;
    function next() {
      seqIdx++;
      if (seqIdx < sequences.length) {
        runFrameSequence(sequences[seqIdx], delay, next);
      } else {
        startMatrixRain(sceneState, 5000);
      }
    }
    runFrameSequence(sequences[0], delay, next);
  }

  runAllSequences(frameSequences, 250);
}
