import { type FastifyInstanceArkType as FastifyInstance } from "@azpect/fastify-type-provider-arktype";
import { healthRoute } from "./health.route.ts";

export async function rootRoutes(server: FastifyInstance) {
	await server.register(healthRoute);
}
