export const generateCommitMessagePrompt = (diff, template) => {
  return `You generate ONLY git commit message arguments.

TASK:
Generate commit message parts (-m "...") from the provided git diff.

EXECUTION MODE:
- NON-INTERACTIVE
- Output only. No questions. No explanations.

OUTPUT RULES:
- Output ONLY lines starting exactly with: -m
- Do NOT output git commit
- Do NOT add extra text or blank lines

${
  template
    ? `
FORMAT:
Use EXACTLY this output template.
Follow it line-by-line.
Omit lines with no content.
Do NOT add, rename, or reorder lines.

${template}
`
    : ""
}

SEMANTICS (MANDATORY):
- Use Conventional Commits
- Allowed types: feat, fix, refactor, perf, test, docs, chore, build, ci, revert
- Scope: infer from filenames or omit
- Summary: imperative, ≤72 chars, no period

BODY:
- Optional
- Max 2 bullets
- Describe WHAT and WHY, not HOW
- Omit if redundant

SOURCE OF TRUTH:
Use ONLY the following git diff.

GIT DIFF:
${diff.trim()}
`;
};

export const generateCleanReportPrompt = (diff) => {
  return `Analyze the staged diff and report debug artifacts and temporary code.

Do NOT remove or modify any code.

Report only these items:
- console.log(...) if it contains: debug, temp, test, TODO, FIXME or is obviously temporary
- debugger;
- if (false) { ... } blocks (temporary code)
- hardcoded dummy data or mock objects (e.g., const user = { id: 1, name: 'test' })
- unused imports/usings (only if clearly unused in the diff)

Output format (exact):
- Output ONLY lines starting exactly with: -c
CLEAN REPORT:
TO REMOVE:
- <file>:<line> <description>
- ...
POTENTIAL:
- <file>:<line> <description>

If nothing removed and no potential items:
CLEAN REPORT: Nothing to remove.

GIT DIFF:
${diff.trim()}`;
};

export const codingStandardsPrompt = (diff, rules) => {
  return `You are a CLI tool that checks coding standards.

Do NOT modify code. Only analyze the staged diff.

TEAM CODING STANDARDS:
${rules}
TEAM CODING STANDARDS END

Output format (exact):
- Output ONLY lines starting exactly with: -s
STANDARDS REPORT:
- <file>:<line> <rule> <description>
- ...

If no violations:
STANDARDS REPORT: No violations found.

GIT DIFF:
${diff.trim()}
`;
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
      ? "Focus on clean code: readability, maintainability, naming, duplication, and code smells."
      : focus === "perf"
        ? "Focus on performance: complexity, inefficient loops, allocations, and unnecessary work."
        : "Focus on security: input validation, injection risks, secrets, auth/authorization, and data exposure.";

  return `You are a senior software engineer doing a focused code review.

FOCUS:
${focusText}

TASK:
Review the staged git diff and produce a concise report of issues and improvements.
Only include items that are clearly visible in the diff.

OUTPUT FORMAT (exact):
- Output ONLY lines starting exactly with: -r
${focusTitle} REVIEW REPORT:
- [<severity>] <file>:<line> <issue description>
- [<severity>] <file>:<line> <suggested improvement>
...

Severity levels: [LOW, MEDIUM, HIGH]

RULES:
- Do NOT output any explanations, markdown, or extra text.
- Do NOT invent issues not present in the diff.
- Do NOT mention Copilot, tools, or commands.
- Do NOT include code snippets.
- If there are no issues, output exactly:
REVIEW REPORT: No issues found.

GIT DIFF:
${diff.trim()}
`;
};
