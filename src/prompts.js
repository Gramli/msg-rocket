export const generateCommitMessagePrompt = (diff, template) => {
    return `You generate ONLY git commit message arguments.

TASK:
Generate commit message parts (-m "...") from the provided git diff.

EXECUTION MODE:
- NON-INTERACTIVE
- Output only. No questions. No explanations.

OUTPUT RULES:
- Output ONLY lines starting exactly with: -m "
- Each line must be a valid standalone git -m argument
- Do NOT output git commit
- Do NOT add extra text or blank lines

${template ? `
FORMAT:
Use EXACTLY this output template.
Follow it line-by-line.
Omit lines with no content.
Do NOT add, rename, or reorder lines.

${template}
` : ''}

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
`
}

export const generatePRDescriptionPrompt = (diff, template) => {
    return `
Write a Pull Request description for the following changes.
Structure it with: Summary, Key Changes, Breaking Changes, Testing Notes.
Output via 'echo' command or similar so I can copy it.
Template: ${template || 'standard PR structure'}

Changes:
${diff.slice(0, 3000)}
`.trim();
};

export const explainDiffPrompt = (diff) => {
    return `
Explain these git changes in plain English. Focus on the "why" and "what".
Changes:
${diff.slice(0, 3000)}
`.trim();
};

export const analyzeDiffPrompt = (diff) => {
    return `
Analyze these changes.
Identify:
1. Commit Type (feat, fix, refactor, etc.)
2. Breaking Change (yes/no)
3. Main files involved
Output the result as a simple summary.

Changes:
${diff.slice(0, 3000)}
`.trim();
};
