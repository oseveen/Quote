import 'dotenv/config'
import { execSync } from "child_process";

export function getInput(input: string, required: boolean = false) {
    const inputFormated = input.replace(/ |\-/g, '_').toUpperCase().trim();
    const variable = process.env['INPUT_' + inputFormated] || '';

    if (required && !variable) 
        actionLog(`Input required and not supplied: ${input}`, 1);

    return variable.trim();
}

export function actionLog(text: unknown, exit?: number): void {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    console.log(`[${hours}:${minutes}:${seconds}] ` + text);

    if (exit) process.exit(exit);
};

export async function executeGitCommand(command: string) {
    try {
        execSync(command, { stdio: 'inherit' });
    } catch (error) {
        actionLog(`🚨 Failed to execute command: ${command}`, 1);
    }
}