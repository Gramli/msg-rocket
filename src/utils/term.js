/**
 * Detects if the current terminal supports Unicode well.
 * @returns {boolean}
 */
export function hasGoodUnicodeSupport() {
  const env = process.env;
  if (env.TERM_PROGRAM === 'vscode') return true;
  if (env.TERM_PROGRAM === 'Windows Terminal') return true;
  if (env.TERM_PROGRAM === 'iTerm.app') return true;
  if (env.TERM && /xterm|rxvt|screen|tmux|linux|vt100/i.test(env.TERM)) return true;
  if (env.ConEmuTask) return true;
  return false;
}