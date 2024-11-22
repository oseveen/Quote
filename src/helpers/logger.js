const LOG_COLORS = {
    success: ['\x1b[32m', '\x1b[39m'],
    warning: ['\x1b[33m', '\x1b[39m'],
    debug: ['\x1b[35m', '\x1b[39m'],
    error: ['\x1b[31m', '\x1b[39m'],
    info: ['\x1b[34m', '\x1b[39m']
};

export var ExitCode;
(function (ExitCode) {
    ExitCode[ExitCode["Success"] = 0] = "Success";
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode || (ExitCode = {}));

export function resolveLogger(options) {
    let { debugMode, timestamp } = options;
    const loggers = {};

    loggers['defineOptions'] = function (options) {
        const { debugMode: enabled, timestamp: date } = options;
        debugMode = enabled ? enabled : debugMode;
        timestamp = date ? date : timestamp;
    };

    for (const [name, [startColor, endColor]] of Object.entries(LOG_COLORS)) {
        loggers[name] = function (input, exitcode) {
            const tag = timestamp
                ? `[${new Date().toISOString()}] ${startColor}${name}${endColor}`
                : `${startColor}${name}${endColor}`;

            if (!debugMode && name === 'debug') return;

            console.log(`${tag} ${input}`);

            if (exitcode !== undefined) process.exit(exitcode);
        };
    }

    return loggers;
}

export const logger = resolveLogger({ debugMode: false, timestamp: false });