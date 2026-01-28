export function formatSection(title, content) {
    return `\n## ${title}\n${content}\n`;
}

export function cleanCopilotOutput(output) {
    if (!output) return "";
    
    // Remove "echo" or quotes if Copilot suggest returned a command like 'echo "message"'
    let clean = output.trim();
    if (clean.startsWith('echo')) {
        clean = clean.substring(4).trim();
    }
    if (clean.startsWith('"') && clean.endsWith('"')) {
        clean = clean.substring(1, clean.length - 1);
    }
    if (clean.startsWith("'") && clean.endsWith("'")) {
        clean = clean.substring(1, clean.length - 1);
    }
    // Handle escaped newlines
    clean = clean.replace(/\\n/g, '\n');
    return clean;
}
