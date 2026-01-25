import path from 'path';
import fs from 'fs';
import os from 'os';

export class Config {
    constructor() {
        this.config = {};
    }

    loadConfig() {
        // Look for project-level config (.msgrocketrc) or user-level in home
        try {
            const home = os.homedir();
            const projectPath = path.join(process.cwd(), '.msgrocketrc');
            const userPath = path.join(home, '.msgrocketrc');
    
            if (fs.existsSync(projectPath)) {
                try { this.config = JSON.parse(fs.readFileSync(projectPath, 'utf-8')); } catch (e) { /* ignore */ }
            } else if (fs.existsSync(userPath)) {
                try { this.config = JSON.parse(fs.readFileSync(userPath, 'utf-8')); } catch (e) { /* ignore */ }
            }
    
        } catch (err) {
            console.warn('Warning: Could not load config file.', err);
        }
    }
}