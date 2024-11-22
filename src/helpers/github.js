import { exec, execSync } from 'child_process';
import { promisify } from 'util';
import { logger } from '#helpers/logger.js';
import path from 'path';
import { quoteFetcher } from './fetch.js';

const execPromise = promisify(exec);

logger.defineOptions({ debugMode: false });

export async function executor(...commands) {

    if (commands.length) {
        for (const command of commands) {
            logger.debug(`📦 Executing command: ${command}`);

            await execPromise(command, { env: process.env })
                .then(() => logger.debug('✅ Command successfully executed'))
                .catch(error => logger.error(error instanceof Error ? error.message : error));
        }
    }
}
export async function configureGit() {
    execSync('git config --global user.name "Github Actions"', { stdio: 'inherit'})
    execSync('git config --global user.email "actions@github.com"', { stdio: 'inherit'})
    execSync('`git remote set-url origin https://x-access-token:${process.env.GITHUB_TOKEN}@github.com/${process.env.GITHUB_REPOSITORY}.git`', { stdio: 'inherit' });
}
;
export async function gitCommit(pathToFile, message = "Update markdown file") {
    const { stdout: userName } = await execPromise('git config --global user.name');
    const { stdout: userEmail } = await execPromise('git config --global user.email');

    if (!userName || !userEmail) {
        logger.debug('⚙️ Git is not configured. Configuring now...');
        await configureGit();
    }
    else
        logger.debug(`⚙️ Git is already configured. User: ${userName.trim()}, Email: ${userEmail.trim()}`);

    const { stdout: modifiedFiles } = await execPromise('git diff --name-only');
    const modifiedFilesArray = modifiedFiles.split('\n').map(file => file.trim());

    if (modifiedFilesArray.includes(path.relative(process.cwd(), pathToFile))) {
        logger.debug(`✍️ Markdown file ${pathToFile} has been modified. Proceeding with commit...`);
    }
    else {
        logger.debug(`📜 No changes detected in the markdown file. Skipping commit.`);
        return;
    }

    const { stdout: changesInRepo } = await execPromise('git diff');

    if (changesInRepo) {
        logger.debug('🔄 Changes detected in the repository. Refetching and redoing everything...');
        
        await quoteFetcher();
        return;
    }

    await executor(`git add ${pathToFile}`, `git commit -m "${message}"`, 'git push');
}
