# msg-rocket 🚀

**msg-rocket** is a CLI tool that supercharges your Git workflow using GitHub Copilot CLI. It automates the generation of meaningless commit messages, insightful PR descriptions, and helps you understand complex diffs without leaving your terminal.

## Problem
Developers often struggle with:
- Writing consistent, conventional commit messages.
- Remembering to document breaking changes.
- Summarizing large changes for Pull Requests.
- Understanding complex diffs quickly.

**msg-rocket** solves this by integrating **GitHub Copilot CLI** directly into your git workflow. It reads your staged changes and leverages Copilot's AI to generate high-quality, structured text for you.

## Features
- **Smart Commit Messages**: Generates Conventional Commits based on your staged changes.
- **Breaking Change Detection**: Automatically flags potential breaking changes.
- **Deep Explanation**: Explains complex diffs in plain English using `gh copilot explain`.
- **PR Descriptions**: Drafts comprehensive PR bodies including summaries and testing notes.
- **Interactive Mode**: Review and edit generated messages before committing.

## Prerequisites
1. **Node.js**: v16 or higher.
2. **Git**: Installed and available in PATH.
3. **GitHub CLI (`gh`)**: Installed ([Installation Guide](https://cli.github.com/)).
4. **GitHub Copilot CLI**: Installed and authenticated.
   Ensure that `gh copilot` works in your terminal.

## Installation

Since this is a CLI tool, you can link it globally:

```bash
git clone <repo-url>
cd msg-rocket
npm install
npm link
```

Now `msg-rocket` should be available in your terminal.

## Usage

Stage your changes first:
```bash
git add .
```

### 1. Generate a Commit Message
```bash
msg-rocket commit
```
Use interactive mode to review/edit:
```bash
msg-rocket commit --interactive
```
Use a custom template:
```bash
msg-rocket commit --template ./my-template.txt
```

### 2. Analyze Changes
See a quick summary of what you are about to commit (type, breaking changes, files).
```bash
msg-rocket analyze
```

### 3. Explain Changes
Get a natural language explanation of the logic in your staged diff.
```bash
msg-rocket explain
```

### 4. Generate PR Description
Draft a Pull Request body.
```bash
msg-rocket pr
```

## How It Works
TODO

## Limitations
- **Context Limit**: Very large diffs may be truncated (currently ~3000 chars) to fit into CLI arguments.
- **Copilot Interaction**: `gh copilot` is designed for interactivity. `msg-rocket` attempts to automate this, but behavior may vary based on the specific version of the extension.

## Future Improvements
- Support for chunking large diffs.
- Integration with GitHub API to create PRs directly.
- Configuration file support (`.msg-rocketrc`) for persistent settings.

---
*Powered by GitHub Copilot*
