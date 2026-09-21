import {
	fastify,
	LogController,
	type FastifyInstance,
	type RawReplyDefaultExpression,
	type RawRequestDefaultExpression,
	type RawServerDefault,
} from "fastify";
import { v7 as uuid7 } from "uuid";
import { type ArkTypeProvider } from "@azpect/fastify-type-provider-arktype";
import { type Logger } from "@repo/logger";
import { env } from "../config/env";
import { arktypePlugin } from "./plugins/arktype";
import { cookiePlugin } from "./plugins/cookie";
import { corsPlugin } from "./plugins/cors";
import { helmetPlugin } from "./plugins/helmet";
import { openApiPlugin } from "./plugins/openapi";
import { rateLimitPlugin } from "./plugins/rate-limit";
import { requestLoggingPlugin } from "./plugins/req-logging";
import { underPressurePlugin } from "./plugins/under-pressure";
import { apiRoutes } from "./routes";

type ServerDeps = {
	logger: Logger;
};

export class Http {
	private readonly log: Logger;
	private server: FastifyInstance<RawServerDefault, RawRequestDefaultExpression, RawReplyDefaultExpression, Logger> | undefined;

	public constructor(deps: ServerDeps) {
		this.log = deps.logger.child({ module: "http" });
	}

	public async startServer() {
		this.server = fastify({
			loggerInstance: this.log,
			genReqId: () => uuid7(),
			connectionTimeout: 120_000,
			routerOptions: { ignoreTrailingSlash: true },
			pluginTimeout: 40_000,
			logController: new LogController({
				disableRequestLogging: true,
			}),
		}).withTypeProvider<ArkTypeProvider>();

		await this.server.register(arktypePlugin);
		await this.server.register(helmetPlugin);
		await this.server.register(cookiePlugin);
		await this.server.register(corsPlugin);
		await this.server.register(underPressurePlugin);
		await this.server.register(rateLimitPlugin);
		await this.server.register(requestLoggingPlugin);
		await this.server.register(openApiPlugin);

		await this.server.register(apiRoutes, { prefix: "/api" });

		await this.server.listen({ port: env.http.port, host: env.http.host });
	}
}
