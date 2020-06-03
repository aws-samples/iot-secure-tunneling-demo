const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const myFormat = printf(info => {
    return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});

module.exports = {
    getLogger: function (processName) {
        return createLogger({
            transports: [
                new transports.Console()
            ],
            format: combine(
                label({ label: processName }),
                timestamp(),
                myFormat
                )
        });
    }
}