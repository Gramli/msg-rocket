# :rocket: msg-rocket

`msg-rocket` is a customized CLI assistant powered by GitHub Copilot CLI. It streamlines your git workflow by leveraging AI to generate commit messages, conduct code reviews, ensuring your branches stay up-to-date, and enforcing team coding standards.

## ✨ Features

- **AI-Generated Commit Messages**: Automatically analyzes staged changes and generates descriptive commit messages using GitHub Copilot.
- **Code Reviews**: Performs AI-driven code reviews on your staged changes, with optional focus on performance or security.
- **Clean Reports**: suggestions for code cleanup and refactoring improvements.
- **Standards Compliance**: Validates your code changes against your team's specific coding standards.
- **Smart Syncing**: Keeps your branches up-to-date with the remote main branch, handling stashes and rebases automatically.
- **Easter Egg**: Includes a fun Matrix-style digital rain effect.

## ⚙️ Installation

### Prerequisites

- **Node.js**: Version 14 or higher (must support ES modules).
- **Git**: Installed and available in your PATH.
- **GitHub Copilot CLI**: You must have the `copilot` command installed and authenticated.

### Install via npm (Recommended)

```bash
npm install -g msg-rocket
```

### Install from Source

1. Clone the repository:
   ```bash
   git clone https://github.com/Gramli/msg-rocket.git
   cd msg-rocket
   ```

2. Link the package globally:
   ```bash
   npm link
   ```

Now you can run the tool using the `msg-rocket` command.

## :computer: Usage

Run the tool from your terminal within a git repository:

```bash
msg-rocket <command> [flags]
```

### Commands

- **`commit`**: Generates a commit message for staged changes.
  - `--t <ticket>`: Appends ticket references (e.g., `#123`).
  - `--f`: Force commit without interactive confirmation.

- **`review`**: Generates a code review for staged changes.
  - `--perf`: Focus review on performance optimizations.
  - `--sec`: Focus review on security implications.

- **`clean`**: Generates a report with cleanup and refactoring suggestions.

- **`standard`**: Checks staged changes against your configured coding standards file.

- **`uptodate`**: Syncs the current branch with the remote main branch.
  - `--m <branch>`: Specify the main branch name (default: `master`).

- **`help`**: Displays help information.

## :hammer_and_wrench: Configuration

You can configure `msg-rocket` by creating a `.msgrocketrc` file in your project root or user home directory. The file should contain valid JSON.

### Configuration Options

| Option | Type | Description |
|--------|------|-------------|
| `msgTemplate` | `string` | Path to a file or a string containing a custom commit message template. |
| `teamCodingStandards` | `string` | Absolute path to a markdown or text file containing your team's coding standards. |
| `DEBUG` | `string` | Set to `"true"` to enable debug logging. |

### Example `.msgrocketrc`

```json
{
  "msgTemplate": "/path/to/my/template.txt",
  "teamCodingStandards": "/Users/developer/docs/coding-standards.md",
  "DEBUG": "false"
}
```

## :test_tube: Examples

**Generate a commit message with ticket references:**

```bash
msg-rocket commit --t "JIRA-123" --t "#456"
```

**Review staged changes for security issues:**

```bash
msg-rocket review --sec
```

**Sync with a specific main branch:**

```bash
msg-rocket uptodate --m main
```

**Check against coding standards:**

Ensure `teamCodingStandards` is set in your `.msgrocketrc`, then run:

```bash
msg-rocket standard
```

## :zap: Tips for Free Copilot Models
When using **free Copilot models**, I noticed unstable behavior when passing prompts via files (e.g. `copilot -p @prompt.md`), including misinterpreting the file path as a user question.

In practice, the CLI behaved **more consistently** when the **Reasoning Effort** was set to **High**:
```bash
/model gpt-5-mini high
```

## :memo: Planned Improvements

The following items describe potential future enhancements based on real usage and performance considerations:

- [ ] **Token-efficient prompts**  
  Further reduce prompt size and Copilot processing time by dynamically trimming diffs, collapsing trivial changes, and reusing shared prompt fragments across commands.

- [ ] **Command chaining**  
  Allow combining multiple operations in a single run (e.g. `review → clean → commit`) while reusing context to avoid repeated Copilot calls.

- [ ] **Partial diff analysis**  
  Support analyzing selected files or hunks to improve performance on large repositories and provide more targeted feedback.

- [ ] **Optional Git hook integration**  
  Enable lightweight pre-commit or pre-push checks using existing commands, fully opt-in.

- [ ] **Context reuse between commands**  
  Share analysis results across commands (e.g. commit + review) to minimize repeated reasoning and token usage.

