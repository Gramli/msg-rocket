import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function isGitRepository() {
  try {
    await execAsync('git rev-parse --is-inside-work-tree');
    return true;
  } catch (error) {
    return false;
  }
}

export async function getStagedDiff() {
  try {
    const { stdout } = await execAsync('git diff --staged');
    return stdout;
  } catch (error) {
    throw new Error('Failed to get staged diff: ' + error.message);
  }
}

export async function getStagedFiles() {
  try {
    const { stdout } = await execAsync('git diff --staged --name-only');
    return stdout.trim().split('\n').filter(Boolean);
  } catch (error) {
    throw new Error('Failed to get staged files: ' + error.message);
  }
}

export async function commitChanges(message) {
  try {
    const escapedMessage = message.replace(/"/g, '\\"');
    await execAsync(`git commit -m "${escapedMessage}"`);
    return true;
  } catch (error) {
    throw new Error('Failed to commit changes: ' + error.message);
  }
}
