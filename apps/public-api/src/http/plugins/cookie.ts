import { fastifyCookie } from "@fastify/cookie";
import { fastifyPlugin } from "fastify-plugin";

export const cookiePlugin = fastifyPlugin(async function (server) {
	await server.register(fastifyCookie);
});
