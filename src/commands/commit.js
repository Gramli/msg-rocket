import fs from 'fs';
import path from 'path';
import { getStagedDiff, commitChanges } from '../git.js';
import { getSuggestion } from '../copilot.js';
import { generateCommitMessagePrompt, generateMinimalCommitMessagePrompt } from '../prompts.js';
import { cleanCopilotOutput } from '../formatter.js';
import readline from 'readline';
import { withSimpleSpinner, logDebug } from '../utils/utils.js';

export async function handleCommit(flags, config) {
    console.log('Preparing to generate commit message...');
    const diff = await getStagedDiff();
    if (!diff) {
        console.log('No staged changes to commit.');
        return;
    }

    const templatePath = flags.getFlagValue('--template');
    let template = '';
    if (templatePath && fs.existsSync(templatePath)) {
        template = fs.readFileSync(templatePath, 'utf-8');
    } else if (config && config.config.msgTemplate) {
        const ct = config.config.msgTemplate;
        if (typeof ct === 'string') {
            // if it's a path to existing file, read it
            if (fs.existsSync(ct)) {
                template = fs.readFileSync(ct, 'utf-8');
            } else {
                template = ct;
            }
        }
    }


    console.log('Generating commit message with GitHub Copilot.');
    const prompt = generateCommitMessagePrompt(diff, template);
        console.log(template);
    // Write prompt to a temporary file
    const os = await import('os');
    const tmpFilePath = path.join(os.default.tmpdir(), `copilot_${Date.now()}.prompt.md`);
    fs.writeFileSync(tmpFilePath, prompt, 'utf-8');
    
    logDebug('Prompt written to temporary file: ', tmpFilePath);

    const startTime = Date.now();
    const rawSuggestion = await withSimpleSpinner(getSuggestion(tmpFilePath), 'Waiting for Copilot response... ');
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    logDebug(`Copilot response time: ${elapsed} seconds`);
    logDebug('Raw suggestion from Copilot:', rawSuggestion);
    let commitMsg = cleanCopilotOutput(cleanCopilotCommitMessageOutput(rawSuggestion));

    try {
        fs.unlinkSync(tmpFilePath);
    } catch (err) {
        console.warn('Warning: Could not delete temp prompt file:', tmpFilePath);
    }

    if (!commitMsg) commitMsg = "chore: update (Copilot failed to generate)";

    if (flags.hasFlag('--interactive')) {
        commitMsg = await interactiveMode(commitMsg);
    } 
    
    if (commitMsg) {
        console.log('\nCommit Message:\n');
        console.log(commitMsg);
        console.log('\nCommitting...');
        await commitChanges(commitMsg);
        console.log('Success!');
    } else {
        console.log('Aborted.');
    }
}

function cleanCopilotCommitMessageOutput(commitMsg) {
    if (commitMsg) {
        return commitMsg
            .split('\n')
            .filter(line => line.trim().startsWith('-m'))
            .join('\n');
    }
    return commitMsg;
}

async function interactiveMode(initialMsg) {
    let currentMsg = initialMsg;
    
    while (true) {
        console.log('\n------------------------------------------------------------');
        console.log(currentMsg);
        console.log('------------------------------------------------------------');
        
        const answer = await new Promise(resolve => {
            const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
            rl.question('Accept? (y/n/edit): ', (ans) => {
                rl.close();
                resolve(ans.trim().toLowerCase());
            });
        });

        if (answer === 'y') return currentMsg;
        if (answer === 'n') return null;
        if (answer === 'edit') {
             const newMsg = await new Promise(resolve => {
                const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
                rl.question('Enter new commit message:\n', (ans) => {
                    rl.close();
                    resolve(ans);
                });
            });
            if (newMsg) currentMsg = newMsg;
        }
    }
}