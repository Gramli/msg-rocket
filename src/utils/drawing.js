export function drawTieFighter() {
      const u = '🟦' ;
      const d = '⚫';
      const k = '⬛';
      const w = '⬜';
      const s = '  ';
      const r = '🔸';

      const lines = [
        `${k}${s}${s}${s}${s}${s}${s}${s}${s}${k}`,
        `${k}${s}${s}${w}${u}${u}${w}${s}${s}${k}        \x1b[36m🚀 msg-rocket: GitHub Copilot CLI powered git assistant\x1b[0m`,
        `${k}${s}${w}${s}${d}${d}${s}${w}${s}${k}        \x1b[36m     Start with command or use help\x1b[0m`,
        `${k}${u}${u}${s}${d}${d}${s}${u}${u}${k}        \x1b[36m Version: v0.0.1\x1b[0m`,
        `${k}${s}${w}${s}${d}${d}${s}${w}${s}${k}        \x1b[36m     Author: Gramli\x1b[0m`,
        `${k}${s}${s}${w}${r}${r}${w}${s}${s}${k}        \x1b[36m     Rocket Pilot: User\x1b[0m`,
        `${k}${s}${s}${s}${s}${s}${s}${s}${s}${k}`,
      ];

      const cols = (process && process.stdout && process.stdout.columns) ? process.stdout.columns : 60;
      const longestLineLength = Math.max(...lines.map(line => line.length));
      const contentWidth = longestLineLength + 2; // +2 for border chars
      const padTotal = Math.max(0, cols - contentWidth);
      const padLeft = Math.floor(padTotal / 2);
      const padRight = padTotal - padLeft;
      const padL = ' '.repeat(padLeft);
      const padR = ' '.repeat(padRight);
      const borderTopBottom = '━'.repeat(cols-20);
      console.log('\n' + ' '.repeat(10) + `\x1b[36m${borderTopBottom}\x1b[0m`);
      lines.forEach(line => {
        const linePad = ' '.repeat(longestLineLength - line.length);
        console.log(padL + line + linePad + padR);
      });
      console.log(' '.repeat(10) + `\x1b[36m${borderTopBottom}\x1b[0m`);
}

function drawPC(){
    const u = '🟩' ;
    const d = '⚫';
    const k = '⬛';
    const w = '⬜';
    const s = '  ';
    const r = '🔶';

      const lines = [
        `${k}${s}${s}${s}${s}${s}${s}${s}${s}${k}       🚀 msg-rocket: GitHub Copilot CLI powered git assistant`,
        `${k}${s}${s}${w}${u}${u}${w}${s}${s}${k}`,
        `${k}${s}${w}${s}${d}${d}${s}${w}${s}${k}`,
        `${k}${u}${u}${s}${d}${d}${s}${u}${u}${k}`,
        `${k}${s}${w}${s}${d}${d}${s}${w}${s}${k}`,
        `${k}${s}${s}${w}${r}${r}${w}${s}${s}${k}`,
        `${k}${s}${s}${s}${s}${s}${s}${s}${s}${k}`,
      ];

      lines.forEach(line => console.log(line));
}