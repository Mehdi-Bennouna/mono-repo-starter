import { type } from "arktype";

export const TEnvSchema = type({
	"SERVICE_NAME": "string",
	"OTLP_LOG_EXPORTER_URL?": "string",
	"OTLP_TRACE_EXPORTER_URL?": "string",
	"OTLP_METRIC_EXPORTER_URL?": "string",
	"PINO_INSTRUMENTATION_ENABLED": type("'true' | 'false'").pipe((s) => s === "true"),
	"HTTP_INSTRUMENTATION_ENABLED": type("'true' | 'false'").pipe((s) => s === "true"),
	"FASTIFY_INSTRUMENTATION_ENABLED": type("'true' | 'false'").pipe((s) => s === "true"),
});

const parsedEnv = TEnvSchema(process.env);

if (parsedEnv instanceof type.errors) {
	// eslint-disable-next-line no-console
	console.error(parsedEnv.summary);
	process.exit(1);
}

export const env = {
	serviceName: parsedEnv.SERVICE_NAME,
	otlpLogExporterUrl: parsedEnv.OTLP_LOG_EXPORTER_URL,
	otlpTraceExporterUrl: parsedEnv.OTLP_TRACE_EXPORTER_URL,
	otlpMetricExporterUrl: parsedEnv.OTLP_METRIC_EXPORTER_URL,
	instrumentations: {
		pino: { enabled: parsedEnv.PINO_INSTRUMENTATION_ENABLED },
		http: { enabled: parsedEnv.HTTP_INSTRUMENTATION_ENABLED },
		fastify: { enabled: parsedEnv.FASTIFY_INSTRUMENTATION_ENABLED },
	},
} as const;
