import "winston-daily-rotate-file";
import { createLogger, format, transports } from "winston";
import colors from "colors/safe";
import moment from "moment";

// // custom formatting
// const { combine, timestamp, printf } = format;
// const formateSave = printf(({ level, message, timestamp }) => {
//   const time = moment(timestamp).format("HH:mm:ss");
//   return `[${level}] ${time}: ${message}`;
// });
// const sFormateLog = printf(({ level, message, timestamp }) => {
//   const time = moment(timestamp).format("HH:mm:ss");
//   return `## [${level}] ${time}: ` + `${message}`.green.bold;
// });
// const eFormateLog = printf(({ level, message, timestamp }) => {
//   const time = moment(timestamp).format("HH:mm:ss");
//   return `## [${level}] ${time}: ` + `${message}`.red.bold;
// });

// // success logger
// const sLogger = createLogger({
//   level: "info",
//   format: combine(timestamp(), formateSave, format.colorize()),
//   transports: [
//     new transports.DailyRotateFile({
//       filename: "log/winston/success/success-%DATE%.log",
//       datePattern: "YYYY-MM-DD-HH",
//       zippedArchive: true,
//       maxSize: "20m",
//       maxFiles: "14d",
//     }),
//   ],
// });

// // error logger
// const eLogger = createLogger({
//   level: "error",
//   format: combine(timestamp(), formateSave, format.colorize()),
//   transports: [
//     new transports.DailyRotateFile({
//       filename: "log/winston/error/error-%DATE%.log",
//       datePattern: "YYYY-MM-DD-HH",
//       zippedArchive: true,
//       maxSize: "20m",
//       maxFiles: "14d",
//     }),
//   ],
// });

// // for development only
// if (process.env.NODE_ENV !== "production") {
//   sLogger.add(
//     new transports.Console({
//       format: combine(timestamp(), sFormateLog, format.colorize()),
//     })
//   );
//   eLogger.add(
//     new transports.Console({
//       format: combine(timestamp(), eFormateLog, format.colorize()),
//     })
//   );
// }

// export const successLogger = (message: string) => sLogger.info(message);
// export const errorLogger = (message: string) => eLogger.error(message);

export const successLogger = (message: string) => console.log(colors.bold(colors.green(message)));

export const errorLogger = (message: string) => console.log(colors.bold(colors.red(message)));
