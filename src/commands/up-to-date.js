import {
  applyStash,
  hasChanges,
  branchExistsRemotely,
  getCurrentBranch,
  countBehindOrigin,
  createStash,
  pullOriginFFOnly,
  switchToBranch,
  rebaseOntoMaster,
  isOnMasterBranch,
  dropStash,
} from "../git.js";
import { log, LOG_LEVELS } from "../utils/logger.js";

const mainBranchFlag = "--m";

export async function handleUpToDate(flags) {
  const masterBranch = flags.hasFlag(mainBranchFlag)
    ? flags.getFlagValue(mainBranchFlag)
    : "master";

  const branchExists = await branchExistsRemotely(masterBranch);
  if (!branchExists) {
    log(
      LOG_LEVELS.ERROR,
      `The specified main branch '${masterBranch}' does not exist on the remote.`,
    );
    return;
  }

  const isMaster = await isOnMasterBranch(masterBranch);
  if (isMaster && branchExists) {
    if ((await hasChanges()) && (await countBehindOrigin(masterBranch)) > 0) {
      log(LOG_LEVELS.INFO, "Staged changes that are not committed.");
      const stashRef = await createStash();
      log(LOG_LEVELS.INFO, "Stashed staged changes.");
      await pullOriginFFOnly(masterBranch);
      log(
        LOG_LEVELS.INFO,
        `Pulled latest changes from origin/${masterBranch}.`,
      );
      await applyStash(stashRef);
      log(LOG_LEVELS.INFO, "Re-applied stashed changes.");
      await dropStash(stashRef);
      log(LOG_LEVELS.INFO, "Dropped the stash.");
    } else {
      log(
        LOG_LEVELS.INFO,
        `Repository is up-to-date with origin/${masterBranch}. No staged changes.`,
      );
    }
  } else {
    const branch = await getCurrentBranch();
    log(LOG_LEVELS.INFO, `Current branch is '${branch}'`);
    if (await hasChanges() && (await countBehindOrigin(masterBranch)) > 0) {
      log(LOG_LEVELS.INFO, "Staged changes that are not committed.");
      const stashRef = await createStash();
      log(LOG_LEVELS.INFO, "Stashed staged changes.");
      await switchToBranch(masterBranch);
      log(LOG_LEVELS.INFO, `Switched to '${masterBranch}' branch.`);
      await pullOriginFFOnly(masterBranch);
      log(
        LOG_LEVELS.INFO,
        `Pulled latest changes from origin/${masterBranch}.`,
      );
      await switchToBranch(branch);
      log(LOG_LEVELS.INFO, `Switched back to '${branch}' branch.`);
      await rebaseOntoMaster(masterBranch);
      log(LOG_LEVELS.INFO, `Rebased '${branch}' onto '${masterBranch}'.`);
      await applyStash(stashRef);
      log(LOG_LEVELS.INFO, "Re-applied stashed changes.");
      await dropStash(stashRef);
      log(LOG_LEVELS.INFO, "Dropped the stash.");
    } else {
      log(
        LOG_LEVELS.INFO,
        `Repository is up-to-date with origin/${masterBranch}. No staged changes.`,
      );
    }
  }
  log(LOG_LEVELS.INFO, "Up-to-date job completed.");
}
