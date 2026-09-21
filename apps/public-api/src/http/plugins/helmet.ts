import { fastifyHelmet } from "@fastify/helmet";
import { fastifyPlugin } from "fastify-plugin";

export const helmetPlugin = fastifyPlugin(async function (server) {
	await server.register(fastifyHelmet);
});
