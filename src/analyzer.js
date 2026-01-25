import { explain } from './copilot.js';
import { analyzeDiffPrompt } from './prompts.js';

export async function analyzeDiff(diff) {
  // Use Copilot Explain for analysis as it generates natural language text, 
  // which works better for "Analysis" than "Suggest" (which tries to make a command).
  // We feed the diff as the 'code' to explain.
  
  const prompt = analyzeDiffPrompt(diff);
  const analysis = await explain(prompt);
  
  // Basic Regex fallback or enhancement
  const breaking = diff.includes('BREAKING CHANGE') || diff.includes('!');
  
  // Extract inferred details from Copilot output (simple string parsing)
  // assuming Copilot returns something like "Commit Type: feat"
  
  return {
    raw: analysis,
    breakingDetected: breaking
  };
}
