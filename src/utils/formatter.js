export function formatSection(title, content) {
    return `\n## ${title}\n${content}\n`;
}

export function cleanAndFormatCopilotOutput(commitMsg, prefix) {
  if (commitMsg) {
    return commitMsg
      .split("\n")
      .filter((line) => line.trim().startsWith(prefix))
      .map((line) => line.replace(new RegExp(`^${prefix}\\s*`), ""))
      .join("\n");
  }
  return cleanCopilotOutput(commitMsg);
}

export function cleanCopilotOutput(output) {
    if (!output) return "";
    
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
