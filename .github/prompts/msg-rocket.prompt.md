# Project Prompt: msg-rocket – Copilot CLI–Powered Git Commit Assistant

## Role
You are an expert software engineer and CLI tool designer.  
Your task is to **design and fully implement a production-ready Node.js CLI tool** called **msg-rocket**.

The tool must explicitly integrate **GitHub Copilot CLI (`gh copilot`)** as a core dependency and demonstrate how Copilot CLI enhances developer workflows.

---

## Problem Statement

Writing high-quality Git commit messages is:
- Time-consuming
- Inconsistent across teams
- Often rushed and poorly structured

Developers already have the intent in their code changes (`git diff`), but translating that into:
- Conventional commits
- Breaking change notices
- PR descriptions

is repetitive and error-prone.

---

## Solution Overview

**msg-rocket** is a Node.js–based CLI that:
1. Reads the **staged git diff**
2. Uses **GitHub Copilot CLI** to analyze the diff
3. Generates:
   - Conventional commit messages
   - Optional breaking change notices
   - PR descriptions
   - Changelog entries
4. Provides optional explanation and interactive approval

Copilot CLI must be used as a **command-line collaborator**, not via direct LLM APIs.

---

## Hard Requirements (Must Follow)

### Technology
- Node.js (ES modules)
- No frameworks
- Use `child_process` to invoke:
  - `git`
  - `gh copilot`
- Do NOT call OpenAI or Gemini APIs directly
- Assume Copilot CLI is installed and authenticated
- Do NOT use external npm libraries (e.g. commander, inquirer, yargs)
- Argument parsing and prompts must be implemented using Node.js standard libraries only

### GitHub Copilot CLI
You must use:
- `gh copilot suggest`
- `gh copilot explain`

These commands must be clearly visible in the implementation.

---

## CLI Commands to Implement

### 1. `msg-rocket commit`
Generates a **conventional commit message** from staged changes.

Rules:
- Use `git diff --staged`
- Follow Conventional Commits:
  ```
  <type>(<scope>): <summary>

  - bullet points if useful
  ```
- Detect breaking changes and append:
  ```
  BREAKING CHANGE: ...
  ```

Commit message must be clear and structured. By default it uses a default template, but allow custom templates via a `--template <file>` option or it could be configured in a config file.

---

### 2. `msg-rocket analyze`
Displays:
- Inferred commit type (`feat`, `fix`, `refactor`, etc.)
- Whether the change is breaking
- Files involved

This command may use **lightweight heuristics** and/or Copilot CLI.

---

### 3. `msg-rocket explain`
Uses:
```bash
gh copilot explain
```

Purpose:
- Explain the staged diff in natural language
- Help developers understand large or unfamiliar changes

---

### 4. `msg-rocket pr`
Generates a **pull request description**, including:
- Summary
- Key changes
- Breaking changes (if any)
- Testing notes

Description must be clear and structured. By default it uses a default template, but allow custom templates via a `--template <file>` option or it could be configured in a config file.

If configuration is supported, use one of:
- `.msg-rocket.json`
- `.msg-rocketrc`

Configuration must be optional and minimal.

---

## Interactive Mode (Optional but Strong)

Support:
```bash
msg-rocket commit --interactive
```

Flow:
1. Generate commit message
2. Display it
3. Ask:
   ```
   Accept? (y/n/edit)
   ```
4. Allow editing before output

---

## Project Structure (Required)

Implement and explain this structure:

```
msg-rocket/
├─ bin/
│  └─ msg-rocket.js      # CLI entry point
├─ src/
│  ├─ git.js                   # git operations
│  ├─ copilot.js               # gh copilot wrapper
│  ├─ analyzer.js              # commit type inference
│  ├─ formatter.js             # output formatting
│  └─ prompts.js               # Copilot prompts
├─ package.json
└─ README.md
```

Each file must have a clear responsibility.

---

## Copilot CLI Usage Requirements

Each of the following commands must invoke GitHub Copilot CLI explicitly:
- `commit` → `gh copilot suggest`
- `pr` → `gh copilot suggest`
- `explain` → `gh copilot explain`

Copilot CLI must not be abstracted away or hidden from the code.

## Prompt Engineering (Critical)

Design **high-quality prompts** for Copilot CLI:
- Commit generation
- Breaking change detection
- PR description
- Diff explanation

Prompts should:
- Be explicit
- Be deterministic
- Avoid fluff
- Produce structured output

---

## Error Handling

Handle:
- No staged changes
- Not a git repository
- Copilot CLI not installed
- Copilot authentication errors
- Unexpected or non-structured Copilot output (e.g. missing commit header)

Errors must be:
- Human-readable
- Actionable

---

## README Requirements

Generate a complete `README.md` that includes:
- Problem description
- Why Copilot CLI is required
- Installation steps
- Usage examples
- Copilot CLI examples
- Limitations
- Future improvements

---

## Acceptance Criteria

The final solution must:
- Be runnable via `npm link`
- Produce real output using Copilot CLI
- Demonstrate Copilot CLI value explicitly
- Be understandable by reviewers without prior context
- Real, usable developer tool

---

## Output Format

Produce:
1. Full project structure
2. Complete source code for all files
3. Example CLI output
4. README.md

Do NOT provide partial snippets.
Do NOT skip implementation details.
