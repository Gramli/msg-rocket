import fs from 'fs';
import path from 'path';
import { getStagedDiff, commitChanges } from '../git.js';
import { getSuggestion } from '../copilot.js';
import { generateCommitMessagePrompt } from '../prompts.js';
import { cleanCopilotOutput } from '../formatter.js';
import { withSpinner } from '../utils/utils.js';
import readline from 'readline';

export async function handleCommit(flags, config) {
    const diff = await getStagedDiff();
    if (!diff) {
        console.log('No staged changes to commit.');
        return;
    }

    const templatePath = flags.getFlagValue('--template');
    let template = '';
    if (templatePath && fs.existsSync(templatePath)) {
        template = fs.readFileSync(templatePath, 'utf-8');
    } else if (config && config.config.commitTemplate) {
        // commitTemplate can be a path or the template content itself
        const ct = config.config.commitTemplate;
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

    // Write prompt to a temporary file
    const os = await import('os');
    const tmpFilePath = path.join(os.default.tmpdir(), `copilot_commit_prompt_${Date.now()}.md`);
    fs.writeFileSync(tmpFilePath, prompt, 'utf-8');

    // Show spinner while waiting for Copilot
    const rawSuggestion = await withSpinner(getSuggestion(tmpFilePath), 'Waiting for Copilot ... ');
    let commitMsg = cleanCopilotOutput(rawSuggestion);

    // Delete the temporary file
    try {
        fs.unlinkSync(tmpFilePath);
    } catch (err) {
        console.warn('Warning: Could not delete temp prompt file:', tmpFilePath);
    }

    // Fallback if empty
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


async function interactiveMode(initialMsg) {
    let currentMsg = initialMsg;
    
    // A simple interactive loop
    // We need to keep one readline instance or strictly manage it
    
    while (true) {
        console.log('\n------------------------------------------------');
        console.log(currentMsg);
        console.log('------------------------------------------------');
        
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