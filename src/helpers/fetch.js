import { ExitCode, logger } from "#helpers/logger.js";
import { gitCommit } from '#helpers/github.js';
import { existsSync, readFileSync, writeFileSync } from "fs";
import path from "path";

logger.defineOptions({ debugMode: false });

function getInput(input, required = false) {
    const inputName = input;

    input = input.replace(/[- ]/g, '_').toUpperCase();
    input = process.env['INPUT_' + input] || '';

    if (required && !input) {
        logger.error(`Input required and not supplied: ${inputName}`, ExitCode.Failure);
    }

    return input;
};

export async function quoteFetcher() {
    logger.info('📖 Updating the markdown with the new quote...');

    const pathInput = getInput('pathQuote');
    logger.debug(`Path input: ${pathInput}`);

    const absolutePath = path.resolve(pathInput);
    logger.debug(`Resolved absolute path: ${absolutePath}`);

    if (!existsSync(absolutePath)) {
        logger.error('📁 Markdown file does not exist', ExitCode.Failure);
    }

    const quotesKeywords = [
        "Anxiety", "Change", "Choice", "Confidence", "Courage", "Death", "Dreams", "Excellence",
        "Failure", "Fairness", "Fear", "Forgiveness", "Freedom", "Future", "Happiness", "Inspiration", "Kindness",
        "Leadership", "Life", "Living", "Love", "Pain", "Past", "Success", "Time", "Today", "Truth", "Work", "Random"
    ];
    logger.debug(`Quotes keywords: ${quotesKeywords}`);

    const typeInput = getInput('typeQuote');
    logger.debug(`Type input: ${typeInput}`);

    const typeOfQuote = quotesKeywords.find(quote => quote.toLowerCase() === typeInput.toLowerCase());
    logger.debug(`Resolved type of quote: ${typeOfQuote}`);

    const response = await fetch(`https://zenquotes.io/api/random/${typeOfQuote}`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });
    logger.debug(`API response status: ${response.status}`);

    if (response.status !== 200) {
        const errorMessage = (await response.json()).q;
        logger.error(`🚨 ${errorMessage}`, ExitCode.Failure);
    }

    const data = await response.json();
    logger.debug(`API response data: ${JSON.stringify(data)}`);

    const quote = data[0];
    logger.debug(`Selected quote: ${JSON.stringify(quote)}`);

    const startTag = '<!--- quote@start --->';
    const endTag = '<!--- quote@end --->';

    let markdownContent = readFileSync(absolutePath, 'utf-8');
    logger.debug(`Original markdown content read`);

    const startIndex = markdownContent.indexOf(startTag);
    const endIndex = markdownContent.indexOf(endTag);

    logger.debug(`Start tag index: ${startIndex}, End tag index: ${endIndex}`);
    if (startIndex === -1) {
        logger.error('🏷️ Tag not found in readme. No update made.', ExitCode.Failure);
    }

    const beforeTag = markdownContent.slice(0, startIndex + startTag.length);
    const afterTag = endIndex !== -1 ? markdownContent.slice(endIndex + endTag.length) : markdownContent.slice(startIndex + startTag.length);
    logger.debug(`Content split into beforeTag and afterTag`);
    
    const updatedQuoteContent = `\n\n\`\`\`\n"${quote.q}"\n- ${quote.a}\n\`\`\`\n\n`;
    markdownContent = beforeTag + updatedQuoteContent + endTag + afterTag;
    logger.debug(`Updated markdown content created`);
    
    writeFileSync(absolutePath, markdownContent, 'utf-8');
    logger.debug(`Markdown file written to disk`);
    
    const commitMessage = getInput('commitMessage');
    logger.debug(`Commit message: ${commitMessage}`);

    await gitCommit(absolutePath, commitMessage);
    logger.success('📖 markdown file written with updated content.', ExitCode.Success);
}
;
