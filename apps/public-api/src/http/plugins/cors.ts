import { fastifyCors } from "@fastify/cors";
import { fastifyPlugin } from "fastify-plugin";
import { env } from "../../config/env";

export const corsPlugin = fastifyPlugin(async function (server) {
	await server.register(fastifyCors, {
		origin: env.http.cors.origins,
		allowedHeaders: env.http.cors.headers,
	});
});
