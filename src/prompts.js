const ConventionalCommitsRules = `
## CONVENTIONAL COMMIT RULES:
- Allowed types: feat, fix, refactor, perf, test, docs, chore, build, ci, revert
- Scope:
  - infer from filenames if possible
  - omit entirely if unclear
- Summary:
  - imperative mood
  - max 72 characters
  - no trailing period
`

const customTemplate = (template) =>  `# OUTPUT FORMAT (MANDATORY):
You MUST generate output EXACTLY matching this template:
${template}

## RULES:
- Follow the template line-by-line
- OMIT a line entirely if no meaningful content exists
- Do NOT add, rename, or reorder lines
- Content MUST follow Conventional Commit semantics
`;

export const generateCommitMessagePrompt = (diff, template) => {
    return `You are generating ONLY git commit message arguments.

# Task:
Generate commit message parts (-m "...") using the Conventional Commits standard,
based ONLY on the provided git diff.

# EXECUTION MODE (MANDATORY):
- This is a NON-INTERACTIVE generation task.
- Generate output only. No explanations.
- Your ONLY responsibility is to generate the required output text.

# OUTPUT CONTRACT:
- Output ONLY lines that start exactly with: -m "
- Each line must be a valid standalone git -m argument
- Do NOT output git commit
- Do NOT repeat or reference examples
- Do NOT include explanations, markdown, headings, or blank lines

# GLOBAL RULES:
- Do NOT invent changes not present in the diff
- Prefer clarity and determinism over creativity
- If information is ambiguous, choose the simplest valid commit message
- Do NOT escape quotes unless required for shell safety

## BODY RULES:
- Optional
- Use bullet points only if they add clarity
- LIMIT body to a maximum of 2 or 3 bullet points
- MERGE related changes into a single bullet when possible
- Prefer higher-level summaries over file-by-file descriptions
- Describe WHAT changed and WHY, not HOW
- If more than 3 related changes exist, summarize them into 1 or 2 bullets
- If body adds no meaningful value beyond the summary, OMIT the body entirely


${template ? customTemplate(template) : ConventionalCommitsRules}

# INPUT DIFF (SOURCE OF TRUTH):

GIT DIFF START:
${diff.trim()} 
GIT DIFF END`
};

export const generateMinimalCommitMessagePrompt = (diff, template) => {
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

FORMAT:
${template ? `
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
