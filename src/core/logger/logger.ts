import { appendFile } from "node:fs/promises";
import { join } from "node:path";

export class Logger {
  private static logDir = join(process.cwd(), "logs");

  private static async writeToFile(level: string, message: string, context?: any) {
    const timestamp = new Date().toISOString();
    const logEntry = JSON.stringify({ timestamp, level, message, context }) + "\n";
    const fileName = `log-${new Date().toISOString().split("T")[0]}.log`;
    const filePath = join(this.logDir, fileName);

    try {
      await appendFile(filePath, logEntry);
    } catch (error) {
      console.error("Failed to write to log file:", error);
    }
  }

  static info(message: string, context?: any) {
    console.info(`[INFO] ${message}`, context || "");
    this.writeToFile("INFO", message, context);
  }

  static error(message: string, context?: any) {
    console.error(`[ERROR] ${message}`, context || "");
    this.writeToFile("ERROR", message, context);
  }

  static warn(message: string, context?: any) {
    console.warn(`[WARN] ${message}`, context || "");
    this.writeToFile("WARN", message, context);
  }
}
