import { createRequire } from "node:module";
import { type LevelWithSilentOrString, type Logger as PinoLogger } from "pino";

type LoggerOptions = {
	level: LevelWithSilentOrString;
};

export type Logger = PinoLogger;

const nodeRequire = createRequire(import.meta.url);
const pino = nodeRequire("pino") as typeof import("pino");
const { stdSerializers, stdTimeFunctions } = pino;

export function createLogger(options: LoggerOptions) {
	const targets = [
		{
			target: "pino-pretty",
			level: options.level,
			options: { colorize: true, translateTime: "SYS:standard", ignore: "pid,hostname" },
		},
	];

	return pino({
		level: options.level,
		timestamp: stdTimeFunctions.isoTime,
		serializers: { error: stdSerializers.err, err: stdSerializers.err },
		transport: { targets },
	});
}
