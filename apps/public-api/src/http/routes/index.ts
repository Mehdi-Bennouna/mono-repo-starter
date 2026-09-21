import { type FastifyInstanceArkType as FastifyInstance } from "@azpect/fastify-type-provider-arktype";
import { rootRoutes } from "./_";

export async function apiRoutes(server: FastifyInstance) {
	await server.register(rootRoutes);
}
