import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { fastifyPlugin } from "fastify-plugin";

export const openApiPlugin = fastifyPlugin(async function (server) {
	await server.register(fastifySwagger, {
		openapi: {
			openapi: "3.0.0",
			info: {
				title: "Public API",
				description: "Monorepo starter public api",
				version: "1.0.0",
			},
		},
	});

	await server.register(fastifySwaggerUi, {
		routePrefix: "/docs",
		uiConfig: {
			docExpansion: "full",
			deepLinking: false,
		},
		uiHooks: {
			onRequest: function (_request, _reply, next) {
				next();
			},
			preHandler: function (_request, _reply, next) {
				next();
			},
		},
		staticCSP: true,
		transformStaticCSP: (header) => header,
		transformSpecification: (swaggerObject, _request, _reply) => {
			return swaggerObject;
		},
		transformSpecificationClone: true,
	});
});
