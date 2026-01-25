#!/usr/bin/env node
import fs from 'fs';
import { isGitRepository, getStagedDiff, getStagedFiles } from '../src/git.js';
import { getSuggestion, explain, checkCopilotInstalled } from '../src/copilot.js';
import { generatePRDescriptionPrompt, explainDiffPrompt } from '../src/prompts.js';
import { analyzeDiff } from '../src/analyzer.js';
import { cleanCopilotOutput, formatSection } from '../src/formatter.js';
import { handleCommit } from '../src/commands/commit.js';
import { Flags } from '../src/utils/utils.js';
import { Config } from '../src/utils/config.js';

const args = process.argv.slice(2);
const command = args[0];
const flags = new Flags(args.slice(1));
const config = new Config();

async function main() {
    
    config.loadConfig();

    if (!await isGitRepository()) {
        console.error('Error: Not a git repository.');
        process.exit(1);
    }
    
    if (!await checkCopilotInstalled()) {
        console.error('Error: Standalone "copilot" CLI is not installed or not working.');
        console.error('Please ensure the "copilot" command is available in your PATH.');
        process.exit(1);
    }

    try {
        switch (command) {
            case 'commit':
                await handleCommit(flags, config);
                break;
            case 'analyze':
                await handleAnalyze();
                break;
            case 'explain':
                await handleExplain();
                break;
            case 'pr':
                await handlePR();
                break;
            default:
                showHelp();
        }
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

async function handleAnalyze() {
    const diff = await getStagedDiff();
    if (!diff) {
        console.log('No staged changes.');
        return;
    }
    
    console.log('Analyzing changes...');
    const files = await getStagedFiles();
    const result = await analyzeDiff(diff);
    
    console.log(formatSection('Files Involved', files.join('\n')));
    console.log(formatSection('Copilot Analysis', result.raw || "No analysis returned"));
    if (result.breakingDetected) {
        console.log('\n⚠️  POTENTIAL BREAKING CHANGE DETECTED\n');
    }
}

async function handleExplain() {
    const diff = await getStagedDiff();
    if (!diff) {
        console.log('No staged changes.');
        return;
    }
    
    console.log('Explaining changes with GitHub Copilot...');
    // Use the prompt wrap to ensure formatted query for copilot -i
    const prompt = explainDiffPrompt(diff);
    const result = await explain(prompt);
    console.log(result);
}

async function handlePR() {
    const diff = await getStagedDiff();
    if (!diff) {
        console.log('No staged changes.');
        return;
    }

    const templatePath = flags.getFlagValue('--template');
    let template = '';
    if (templatePath && fs.existsSync(templatePath)) {
        template = fs.readFileSync(templatePath, 'utf-8');
    }

    console.log('Generating PR description...');
    const prompt = generatePRDescriptionPrompt(diff, template);
    
    // Requirement: "pr -> gh copilot suggest"
    const query = `suggest a command to echo the generated PR description. ${prompt}`;
    const rawSuggestion = await getSuggestion(query);
    const prDesc = cleanCopilotOutput(rawSuggestion);
    
    console.log('\nProposed PR Description:\n');
    console.log(prDesc);
}

function showHelp() {
    console.log(`
msg-rocket: GitHub Copilot CLI powered git assistant

Usage:
  msg-rocket commit [--interactive] [--template <file>]
  msg-rocket analyze
  msg-rocket explain
  msg-rocket pr [--template <file>]
    `);
}

main();
