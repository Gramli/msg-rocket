export const generateCommitMessagePrompt = (diff, template) => {
    return `
You are generating ONLY git commit message arguments.

# Task:
Generate commit message parts (-m "...") using the Conventional Commits standard,
based ONLY on the provided git diff.


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

## CONVENTIONAL COMMIT RULES:
- Allowed types: feat, fix, refactor, perf, test, docs, chore, build, ci, revert
- Scope:
  - infer from filenames if possible
  - omit entirely if unclear
- Summary:
  - imperative mood
  - max 72 characters
  - no trailing period

## BODY RULES:
- Optional
- Use bullet points only if they add clarity
- LIMIT body to a maximum of 2 or 3 bullet points
- MERGE related changes into a single bullet when possible
- Prefer higher-level summaries over file-by-file descriptions
- Describe WHAT changed and WHY, not HOW
- If more than 3 related changes exist, summarize them into 1 or 2 bullets
- If body adds no meaningful value beyond the summary, OMIT the body entirely

## FOOTER RULES:
- Optional
- Include ONLY if applicable
- For breaking changes, include exactly:
  BREAKING CHANGE: <clear description>

## BREAKING CHANGE DETECTION:
- Include a BREAKING CHANGE footer ONLY if:
  - public API shape changes
  - function or field is renamed or removed
  - request/response schema changes
  - database schema changes
  - significant behavior changes that may impact users
  - other changes that would require users to modify their code
  - documentation updates alone do NOT justify BREAKING CHANGE
  - If unsure, choose NOT to include BREAKING CHANGE
- Otherwise, OMIT footer entirely

# IMPORTANT:
The following examples are for guidance only.
Do NOT repeat them in the output.

# EXAMPLES (NON-OUTPUT):
## Simple Change
-m "fix(validation): allow plus sign in email addresses"

## Feature with body
-m "feat(users): add GET /users endpoint"
-m "- return all users from in-memory store"

# Breaking change
-m "feat(users): rename email to contactEmail"
-m "- update validation and service layer"
-m "BREAKING CHANGE: user.email has been renamed to user.contactEmail"

TEMPLATE CONTEXT:
${template || "Conventional commit rules"}

# INPUT DIFF (SOURCE OF TRUTH):

GIT DIFF START:
${diff.trim()} 
GIT DIFF END`
};

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
