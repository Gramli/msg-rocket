import path from "path";
import fs from "fs";
import os from "os";
import { log, LOG_LEVELS } from "./logger.js";

export class Config {
  constructor() {
    this.config = {};
  }

  loadConfig() {
    try {
      const home = os.homedir();
      const projectPath = path.join(process.cwd(), ".msgrocketrc");
      const userPath = path.join(home, ".msgrocketrc");

      if (fs.existsSync(projectPath)) {
        log(LOG_LEVELS.DEBUG, "Loading config from:", projectPath);
        try {
          this.config = JSON.parse(fs.readFileSync(projectPath, "utf-8"));
        } catch (e) {
          /* ignore */
        }
      } else if (fs.existsSync(userPath)) {
        log(LOG_LEVELS.DEBUG, "Loading config from:", userPath);
        try {
          this.config = JSON.parse(fs.readFileSync(userPath, "utf-8"));
        } catch (e) {
          /* ignore */
        }
      }

      if (this.config.DEBUG) {
        log(LOG_LEVELS.DEBUG, "Debug mode enabled via config.");
        process.env.DEBUG = this.config.DEBUG;
      }
    } catch (err) {
      console.warn("Warning: Could not load config file.", err);
    }
  }
}
