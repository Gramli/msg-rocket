import { hasGoodUnicodeSupport } from "../utils/term.js";

export function drawEasterEgg() {
  const terminalSupportsUnicode = hasGoodUnicodeSupport();
  const w = terminalSupportsUnicode ? "⬜" : "#";
  const d = terminalSupportsUnicode ? "⚫" : "@";
  const s = terminalSupportsUnicode ? "  " : " ";
  const width = terminalSupportsUnicode ? 18 : 36;
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
  function generateFrame(text, terminalSupportsUnicode) {
    const repeatCount = terminalSupportsUnicode
      ? width - Math.ceil(text.length / 2) - 1
      : width - text.length - 1;
    return [
      `${w}${w.repeat(width)}${w}`,
      `${w}${s}\x1b[5m\x1b[32m${text}\x1b[0m${s.repeat(repeatCount)}${w}`,
      ...Array(height - 3).fill(`${w}${s.repeat(width)}${w}`),
      `${w}${w.repeat(width)}${w}`,
      `${w}${w.repeat(width - 2)}${d}${w}${w}`,
    ];
  }

  // Run a sequence of frames
  function runFrameSequence(frameTexts, delay, nextSequence) {
    let i = 0;
    const interval = setInterval(() => {
      console.clear();
      console.log("\n\n");
      generateFrame(frameTexts[i], terminalSupportsUnicode).forEach((line) =>
        console.log(line),
      );
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
    const rainChars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const rainCols = width;
    const rainRows = height - 2;
    let drops = Array(rainCols)
      .fill(0)
      .map(() => Math.floor(Math.random() * rainRows));
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
          if (drops[col] === row || Math.random() < 0.1) {
            const char =
              rainChars[Math.floor(Math.random() * rainChars.length)];
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
      console.log(`${w}${w.repeat(width - 2)}${d}${w}${w}`);
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

  // Patch runAllSequences to call matrix rain after last sequence
  runAllSequences = function (sequences, delay) {
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