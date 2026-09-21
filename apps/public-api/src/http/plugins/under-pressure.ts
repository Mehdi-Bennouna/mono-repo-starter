import { fastifyUnderPressure } from "@fastify/under-pressure";
import { fastifyPlugin } from "fastify-plugin";

export const underPressurePlugin = fastifyPlugin(async function (server) {
	await server.register(fastifyUnderPressure, {
		maxEventLoopDelay: 1000,
		maxHeapUsedBytes: 100000000,
		maxRssBytes: 200000000,
		maxEventLoopUtilization: 0.98,
	});
});
