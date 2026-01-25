import { spawn } from 'child_process';

const ANSI_REGEX = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;

function cleanOutput(output) {
  return output.replace(ANSI_REGEX, '').trim();
}

export async function getSuggestion(prompt) {
  return new Promise((resolve, reject) => {    
    // Use the standalone copilot CLI
    // User instruction: copilot "suggest <prompt>" (passed as single argument)
    const child = spawn('copilot.cmd', ['-p', `@${prompt}`], {
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true,
      env: { ...process.env } 
    });

    let stdoutData = '';
    let stderrData = '';
    
    child.stdout.on('data', (data) => {
        //console.log('[debug] copilot stdout:', data.toString());
      stdoutData += data.toString();
    });

    child.stderr.on('data', (data) => {
        //console.log('[debug] copilot stderr:', data.toString());
      stderrData += data.toString();
    });

    child.on('close', (code) => {
        // Fallback to stderr if stdout is empty
        //console.log('[debug] copilot close with code:', code);
        const output = stdoutData.trim() || stderrData.trim();
        
        if (code !== 0 && stderrData) {
            console.error(`[debug] Copilot CLI exited with code ${code}`);
            console.error(`[debug] stderr: ${stderrData}`);
        }
        
        resolve(output);
    });
    
    child.on('error', (err) => {
                //console.log('[debug] copilot error:', err);
        resolve(null);
    });
  });
}

export async function explain(prompt) {
    return new Promise((resolve, reject) => {
        // Use standalone copilot CLI
        // User instruction: copilot "explain <prompt>" (passed as single argument)
        const child = spawn('copilot.cmd', ['-p', `@${prompt}`], {
            stdio: ['pipe', 'pipe', 'pipe'],
            shell: true
        });

        let output = '';
        child.stdout.on('data', (data) => output += data.toString());
        child.stderr.on('data', (data) => output += data.toString());

        child.on('close', () => {
             resolve(cleanOutput(output));
        });
        
         child.on('error', (err) => {
            resolve(null);
        });
    });
}

export async function checkCopilotInstalled() {
    return new Promise((resolve) => {
        // Check for 'copilot' command
        const child = spawn('copilot.cmd', ['--version'], {
            stdio: ['ignore', 'ignore', 'ignore'],
            shell: true
        });
        
        child.on('close', (code) => {
            if (code === 0) {
                resolve('installed');
            } else {
                resolve('not_installed');
            }
        });
        
        child.on('error', () => {
             resolve('not_installed');
        });
    });
}
