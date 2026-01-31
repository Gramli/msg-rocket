import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function isGitRepository() {
  try {
    await execAsync("git rev-parse --is-inside-work-tree");
    return true;
  } catch (error) {
    return false;
  }
}

export async function getStagedDiff() {
  try {
    const { stdout } = await execAsync("git diff --staged");
    return stdout;
  } catch (error) {
    throw new Error("Failed to get staged diff: " + error.message);
  }
}

export async function getStagedFiles() {
  try {
    const { stdout } = await execAsync("git diff --staged --name-only");
    return stdout.trim().split("\n").filter(Boolean);
  } catch (error) {
    throw new Error("Failed to get staged files: " + error.message);
  }
}

export async function isOnMasterBranch(master = "master") {
  try {
    const currentBranch = await getCurrentBranch();
    return currentBranch === master;
  } catch (error) {
    throw new Error("Failed to determine current branch: " + error.message);
  }
}

export async function getCurrentBranch() {
  try {
    const { stdout } = await execAsync("git rev-parse --abbrev-ref HEAD");
    return stdout.trim();
  } catch (error) {
    throw new Error("Failed to determine current branch: " + error.message);
  }
}

export async function fetchOrigin() {
  try {
    await execAsync("git fetch origin");
    return true;
  } catch (error) {
    throw new Error("Failed to fetch origin: " + error.message);
  }
}

export async function countBehindOrigin(branch = "master") {
  try {
    const { stdout } = await execAsync(
      `git rev-list --count ${branch}..origin/${branch}`,
    );
    return parseInt(stdout.trim(), 10);
  } catch (error) {
    throw new Error("Failed to fetch origin: " + error.message);
  }
}

export async function createStash(message = "msg-rocket stash") {
  try {
    const msg = `-m "${message}${Date.now()}"`;
    const { stdout } = await execAsync(`git stash push ${msg}`);
    const match = stdout.match(/stash@\{(\d+)\}/);
    if (match) {
      return `stash@{${match[1]}}`;
    }
    return "stash@{0}";
  } catch (error) {
    throw new Error("Failed to create stash: " + error.message);
  }
}

export async function pullOriginFFOnly(branch = "master") {
  try {
    await execAsync(`git pull --ff-only origin ${branch}`);
    return true;
  } catch (error) {
    throw new Error("Failed to pull with --ff-only: " + error.message);
  }
}

export async function applyStash(stashRef) {
  try {
    const ref = stashRef || "stash@{0}";
    await execAsync(`git stash apply ${ref}`);
    return true;
  } catch (error) {
    throw new Error("Failed to apply stash: " + error.message);
  }
}

export async function hasChanges() {
  try {
    const { stdout } = await execAsync("git status --porcelain");
    return stdout.trim().length > 0;
  } catch (error) {
    throw new Error("Failed to check for changes: " + error.message);
  }
}

export async function switchToBranch(branch = "master") {
  try {
    await execAsync(`git checkout ${branch}`);
    return true;
  } catch (error) {
    throw new Error("Failed to switch branch: " + error.message);
  }
}

export async function rebaseOntoMaster(master = "master") {
  try {
    await execAsync(`git rebase origin/${master}`);
    return true;
  } catch (error) {
    throw new Error("Failed to rebase onto master: " + error.message);
  }
}

export async function dropStash(stashRef = "stash@{0}") {
  try {
    await execAsync(`git stash drop ${stashRef}`);
    return true;
  } catch (error) {
    throw new Error("Failed to drop stash: " + error.message);
  }
}

export async function branchExistsRemotely(branch) {
  try {
    await execAsync('git fetch origin');
    const { stdout: remote } = await execAsync(`git branch -r --list origin/${branch}`);
    return !!remote.trim();
  } catch (error) {
    throw new Error(`Failed to check remote branch: ${error.message}`);
  }
}

export async function commitChanges(message) {
  try {
    const messages = String(message)
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (messages.length === 0) {
      throw new Error("Commit message is empty");
    }
    const flags = messages.join(" ");
    await execAsync(`git commit ${flags}`);
    return true;
  } catch (error) {
    throw new Error("Failed to commit changes: " + error.message);
  }
}
