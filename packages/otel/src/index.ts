import { FastifyOtelInstrumentation } from "@fastify/otel";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { PinoInstrumentation } from "@opentelemetry/instrumentation-pino";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { logs, NodeSDK, tracing } from "@opentelemetry/sdk-node";
import { env } from "./config/env";

export { TEnvSchema } from "./config/env";

const instrumentations = [];
const spanProcessors = [];
const logRecordProcessors = [];
const metricReaders = [];

if (env.otlpTraceExporterUrl) {
	spanProcessors.push(
		new tracing.BatchSpanProcessor(
			new OTLPTraceExporter({
				url: env.otlpTraceExporterUrl,
			}),
		),
	);
}

if (env.otlpLogExporterUrl) {
	logRecordProcessors.push(
		new logs.BatchLogRecordProcessor(
			new OTLPLogExporter({
				url: env.otlpLogExporterUrl,
			}),
		),
	);
}

if (env.otlpMetricExporterUrl) {
	metricReaders.push(
		new PeriodicExportingMetricReader({
			exporter: new OTLPMetricExporter({
				url: env.otlpMetricExporterUrl,
			}),
		}),
	);
}

if (env.instrumentations.pino.enabled) {
	instrumentations.push(new PinoInstrumentation());
}
if (env.instrumentations.http.enabled) {
	instrumentations.push(new HttpInstrumentation());
}
if (env.instrumentations.fastify.enabled) {
	instrumentations.push(new FastifyOtelInstrumentation({ registerOnInitialization: true }));
}

const sdk = new NodeSDK({
	serviceName: env.serviceName,
	spanProcessors,
	logRecordProcessors,
	metricReaders,
	instrumentations,
});

sdk.start();
