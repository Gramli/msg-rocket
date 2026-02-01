export const generateCommitMessagePrompt = (diff, template) => {
  return `OUTPUT ONLY. NO EXPLANATIONS. NO ANALYSIS.
Every single line MUST start with: -m
Any line without -m prefix will break the parser.
ONLY output -m lines. NOTHING else.

Example output format:
-m "feat: add feature"
-m "- implement authentication"
-m "- add tests"

RULES:
- Use Conventional Commits (feat, fix, refactor, perf, test, docs, chore, build, ci, revert)
- Summary: imperative, ≤72 chars, no period
- If trivial: ONE -m line only
- If complex: add body (max 3-4 bullets)
${
  template
    ? `TEMPLATE (follow exactly):\n${template}\n`
    : ""
}
GIT DIFF:
${diff.trim()}`;
};

export const generateCleanReportPrompt = (diff) => {
  return `OUTPUT ONLY LINES STARTING WITH: -c
NO explanations. NO analysis. NO markdown. ONLY -c lines.
Any output without -c prefix is INVALID.

Output format (STRICT):
-c CLEAN REPORT:
-c TO REMOVE:
-c <file>:<line> <description>
-c POTENTIAL:
-c <file>:<line> <description>

If nothing found:
-c CLEAN REPORT: Nothing to remove.

ONLY report:
- console.log() with: debug, temp, test, TODO, FIXME
- debugger;
- if (false) blocks
- hardcoded dummy data

GIT DIFF:
${diff.trim()}`;
};

export const codingStandardsPrompt = (diff, rules) => {
  return `OUTPUT ONLY LINES STARTING WITH: -s
NO explanations. NO analysis. NO markdown. ONLY -s lines.

Output format (STRICT):
-s STANDARDS REPORT:
-s <file>:<line> <rule> <description>

If no violations:
-s STANDARDS REPORT: No violations found.

TEAM CODING STANDARDS:
${rules}

GIT DIFF:
${diff.trim()}`;
};

export const reviewPrompt = (diff, focus = "clean") => {
  const focusTitle =
    focus === "clean"
      ? "CLEAN CODE"
      : focus === "perf"
        ? "PERFORMANCE"
        : "SECURITY";

  const focusText =
    focus === "clean"
      ? "readability, maintainability, naming, duplication, code smells"
      : focus === "perf"
        ? "complexity, loops, allocations, unnecessary work"
        : "input validation, injection, secrets, auth, data exposure";

  return `OUTPUT ONLY LINES STARTING WITH: -r
NO explanations. NO analysis. NO markdown. ONLY -r lines.

Output format (STRICT):
-r ${focusTitle} REVIEW REPORT:
-r [<severity>] <file>:<line> <issue>

Severity: [LOW, MEDIUM, HIGH]

If no issues:
-r REVIEW REPORT: No issues found.

FOCUS: ${focusText}

GIT DIFF:
${diff.trim()}`;
};