import { type FastifyInstanceArkType as FastifyInstance } from "@azpect/fastify-type-provider-arktype";

export function healthRoute(server: FastifyInstance) {
	server.route({
		url: "/health",
		method: "GET",
		constraints: { version: "1.0.0" },
		handler: async (_, reply) => {
			await reply.code(200).send("OK");
		},
	});
}
