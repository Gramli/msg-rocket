export const generateCommitMessagePrompt = (diff, template) => {
  return `TASK: Generate git commit message flags from a diff.

OUTPUT FORMAT (MANDATORY):
- ONLY output lines starting with: -m
- NO explanations, NO analysis, NO chat
- Each line is a git -m flag

WHAT TO DO:
1. Analyze the diff
2. Write commit message using Conventional Commits (feat, fix, refactor, perf, test, docs, chore, build, ci, revert)
3. Output as -m lines only

EXAMPLE OUTPUT:
-m "feat: add user authentication"
-m "- implement JWT validation"
-m "- add login endpoint"

${
  template
    ? `TEMPLATE (follow exactly):\n${template}\n`
    : ""
}
GIT DIFF:
${diff.trim()}`;
};

export const generateCleanReportPrompt = (diff) => {
  return `TASK: Find debug artifacts and temporary code in a diff.

OUTPUT FORMAT (MANDATORY):
- ONLY output lines starting with: -c
- NO explanations, NO analysis, NO chat

WHAT TO FIND:
- console.log() with: debug, temp, test, TODO, FIXME
- debugger statements
- if (false) blocks
- hardcoded dummy/test data
- unused imports

EXAMPLE OUTPUT:
-c CLEAN REPORT:
-c TO REMOVE:
-c src/app.js:45 console.log with TODO
-c src/server.js:12 hardcoded test user object

GIT DIFF:
${diff.trim()}`;
};

export const codingStandardsPrompt = (diff, rules) => {
  return `TASK: Check if code violates team coding standards.

OUTPUT FORMAT (MANDATORY):
- ONLY output lines starting with: -s
- NO explanations, NO analysis, NO chat

WHAT TO DO:
1. Read the team standards below
2. Check if the diff violates any rule
3. Report violations as -s lines only

EXAMPLE OUTPUT:
-s STANDARDS REPORT:
-s src/api.js:10 missing error handling: should use try-catch
-s src/utils.js:5 naming convention: use camelCase not snake_case

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

  const focusDescription =
    focus === "clean"
      ? "Find readability, maintainability, naming, duplication, code smells"
      : focus === "perf"
        ? "Find complexity, inefficient loops, allocations, unnecessary work"
        : "Find input validation gaps, injection risks, secrets, auth/authorization issues";

  return `TASK: Review code diff for ${focusDescription}.

OUTPUT FORMAT (MANDATORY):
- ONLY output lines starting with: -r
- NO explanations, NO analysis, NO chat

WHAT TO DO:
1. Analyze the diff for ${focusDescription}
2. Report issues as -r lines with severity [LOW/MEDIUM/HIGH]
3. Include file:line and description only

EXAMPLE OUTPUT:
-r ${focusTitle} REVIEW REPORT:
-r [HIGH] src/auth.js:12 hardcoded password in plaintext
-r [MEDIUM] src/api.js:5 missing error handling
-r [LOW] src/utils.js:20 variable name unclear

GIT DIFF:
${diff.trim()}`;
};