const winston = require('winston');

// Create a logger instance
const logger = winston.createLogger({
  level: 'info', // Set the default log level
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }), // Add a timestamp to logs
    winston.format.printf(({ level, message, timestamp }) => {
      return `${level} - ${timestamp} - ${message}`;
    }) // Format logs as JSON
  ),
  transports: [
    new winston.transports.Console(), // Log to the console
    new winston.transports.File({ filename: 'combined.log' }), // Log to a file
  ],
});
module.exports = logger;
