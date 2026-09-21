import { fastifyRateLimit } from "@fastify/rate-limit";
import { fastifyPlugin } from "fastify-plugin";

export const rateLimitPlugin = fastifyPlugin(async function (server) {
	await server.register(fastifyRateLimit, {
		max: 300,
		timeWindow: 60 * 1000,
		// make use of the "redis" property in case of multiple nodes
	});
});
