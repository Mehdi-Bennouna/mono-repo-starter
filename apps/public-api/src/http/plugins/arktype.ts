import { fastifyPlugin } from "fastify-plugin";
import { serializerCompiler, validatorCompiler } from "@azpect/fastify-type-provider-arktype";

export const arktypePlugin = fastifyPlugin(function (server, _opts, done) {
	server.setValidatorCompiler(validatorCompiler);
	server.setSerializerCompiler(serializerCompiler);
	done();
});
