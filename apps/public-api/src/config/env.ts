import { type } from "arktype";

const TBaseConfigSchema = type({
	NODE_ENV: "string",
	LOG_LEVEL: "string",
});

const TApiConfigSchema = type({
	API_PORT: "string.integer.parse",
	API_HOST: "string",
	API_CORS_ORIGINS: "string.json.parse |> string[] > 0",
	API_CORS_HEADERS: "string.json.parse |> string[]",
});

const TEnvSchema = type.and(TBaseConfigSchema, TApiConfigSchema);

const parsedEnv = TEnvSchema(process.env);

if (parsedEnv instanceof type.errors) {
	// eslint-disable-next-line no-console
	console.error(parsedEnv.summary);
	process.exit(1);
}

export const env = {
	app: {
		log: {
			level: parsedEnv.LOG_LEVEL,
		},
	},
	http: {
		port: parsedEnv.API_PORT,
		host: parsedEnv.API_HOST,
		cors: {
			origins: parsedEnv.API_CORS_ORIGINS,
			headers: parsedEnv.API_CORS_HEADERS,
		},
	},
} as const;
