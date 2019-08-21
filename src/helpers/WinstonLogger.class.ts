import winston, { LoggerOptions, format } from 'winston';
import chalk from 'chalk';


const octopusFormat = format.printf((info): string => `${chalk.yellowBright('[BONOBO CRAWLER]')} | ${info.timestamp} | ${info.level}: ${info.message}`);

const options: LoggerOptions = {
  level: 'debug',
  exitOnError: true,
  transports: [
    new winston.transports.File({ filename: 'error.log.json', level: 'error' }),
    new winston.transports.Console({
      handleExceptions: true,
      format: format.combine(
        format.colorize(),
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.prettyPrint(),
        format.errors({ stack: true }),
        octopusFormat,
      ),
    }),
  ],
};

export default winston.createLogger(options);
