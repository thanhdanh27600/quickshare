import chalk from "chalk";

export type LogLevel = "R" | "G" | "B" | "Y" | "D";

export function log(text: string | string[], level: LogLevel = "D") {
	let chalkLog;
	switch (level) {
		case "R":
			chalkLog = chalk.red;
			break;
		case "G":
			chalkLog = chalk.green;
			break;
		case "B":
			chalkLog = chalk.blue;
			break;
		case "Y":
			chalkLog = chalk.yellow;
			break;
		default:
			chalkLog = chalk.dim;
	}
	return console.log(chalkLog(text));
}
