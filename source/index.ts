import 'dotenv/config';
import axios from 'axios';

import fs from 'fs';
import path from 'path';

import { actionLog, executeGitCommand, getInput } from "./utils";

interface Quote {
    q: string,
    a: string,
    h: string
}

actionLog('📖 Updating the markdown with the new quote...');

const pathInput = getInput('pathQuote');
const pathQuote = path.resolve(pathInput);

if (!fs.existsSync(pathQuote))
    actionLog('📁 Markdown file does not exist', 1);

const quotesKeywords = [
    "Anxiety", "Change", "Choice", "Confidence", "Courage", "Death", "Dreams", "Excellence",
    "Failure", "Fairness", "Fear", "Forgiveness", "Freedom", "Future", "Happiness", "Inspiration", "Kindness",
    "Leadership", "Life", "Living", "Love", "Pain", "Past", "Success", "Time", "Today", "Truth", "Work", "Random"
];

const typeInput = getInput('typeQuote');
const typeQuote = quotesKeywords.find(q => q.toLowerCase() === typeInput.toLowerCase());

if (!typeQuote)
    actionLog('📖 The quote type provided is invalid', 1);

const response = await axios.get<Quote[]>(`https://zenquotes.io/api/random/${typeQuote}`);

if (response.status !== 200)
    actionLog(`🚨 ${response.data[0].q}`, response.status);


const quote = response.data[0];

const startTag = '<!--- quote@start --->';
const endTag = '<!--- quote@end --->';

let markdownContent = fs.readFileSync(pathQuote, 'utf-8');

const startIndex = markdownContent.indexOf(startTag);
const endIndex = markdownContent.indexOf(endTag);

if (startIndex === -1)
    actionLog('🏷️ Tag not found in readme. No update made.', 1);

const beforeTag = markdownContent.slice(0, startIndex + startTag.length);
const afterTag = endIndex !== -1 ? markdownContent.slice(endIndex + endTag.length) : markdownContent.slice(startIndex + startTag.length);

const updatedQuoteContent = `\n\n\`\`\`\n"${quote.q}"\n- ${quote.a}\n\`\`\`\n\n`;
markdownContent = beforeTag + updatedQuoteContent + endTag + afterTag;

fs.writeFileSync(pathQuote, markdownContent, 'utf-8');

const commitMessage = getInput('commitMessage');

executeGitCommand(`git add ${pathQuote}`);
executeGitCommand(`git commit -m "${commitMessage}"`);
executeGitCommand('git push -f');

actionLog('📖 markdown file written with updated content.', 0);
