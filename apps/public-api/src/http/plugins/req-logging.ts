import { type IncomingHttpHeaders } from "node:http";
import { fastifyPlugin } from "fastify-plugin";

type SafeBody = Record<string, unknown> | Array<unknown> | string | null;

const MAX_PAYLOAD_SIZE_BYTES = 200 * 1024;

const SENSITIVE_HEADERS = new Set(["authorization", "cookie", "set-cookie", "x-api-key", "proxy-authorization"]);

function maskHeaders(headers: IncomingHttpHeaders): Record<string, unknown> {
	const masked: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(headers)) {
		masked[key] = SENSITIVE_HEADERS.has(key.toLowerCase()) ? "[Redacted]" : value;
	}
	return masked;
}

function maskCookies(cookies: Record<string, string | undefined>): Record<string, string> {
	const masked: Record<string, string> = {};
	for (const key of Object.keys(cookies)) {
		masked[key] = "[Redacted]";
	}
	return masked;
}

function getContentType(headerValue: unknown): string {
	return typeof headerValue === "string" ? headerValue : "";
}

function isPipeable(value: unknown): value is { pipe: unknown } {
	return typeof value === "object" && value !== null && "pipe" in value && typeof value.pipe === "function";
}

function parseJson(text: string): Record<string, unknown> | Array<unknown> {
	const parsed: unknown = JSON.parse(text);
	return parsed as Record<string, unknown> | Array<unknown>;
}
function extractJsonStringBody(body: string): SafeBody {
	if (Buffer.byteLength(body, "utf8") > MAX_PAYLOAD_SIZE_BYTES) {
		return `<Large JSON Payload: ${body.length.toString()} characters omitted>`;
	}
	try {
		return parseJson(body);
	} catch {
		return "<Malformed JSON String>";
	}
}

function extractPlainStringBody(body: string): SafeBody {
	return body.length > 1000 ? `${body.slice(0, 1000)}... [truncated]` : body;
}

function extractObjectBody(body: object): SafeBody {
	try {
		const stringified = JSON.stringify(body);
		if (Buffer.byteLength(stringified, "utf8") > MAX_PAYLOAD_SIZE_BYTES) {
			return `<Large Object: ${stringified.length.toString()} bytes omitted>`;
		}
		return parseJson(stringified);
	} catch {
		return "<Unserializable Object>";
	}
}

function safeExtractBody(body: unknown, contentType: string): SafeBody {
	if (body === undefined || body === null) return null;

	if (Buffer.isBuffer(body)) {
		return `<Binary Data: ${body.length.toString()} bytes>`;
	}

	if (isPipeable(body)) {
		return `<Binary Stream: Unknown bytes>`;
	}

	if (typeof body === "string" && contentType.includes("application/json")) {
		return extractJsonStringBody(body);
	}

	if (typeof body === "object") {
		return extractObjectBody(body);
	}

	if (typeof body === "string") {
		return extractPlainStringBody(body);
	}

	return `<Unknown Type: ${typeof body}>`;
}

export const requestLoggingPlugin = fastifyPlugin(function (server, _opts, done) {
	server.addHook("preHandler", async (request, _reply) => {
		const contentType = getContentType(request.headers["content-type"]);
		request.log.info(
			{
				request: {
					method: request.method,
					url: request.url,
					routePath: request.routeOptions.url,
					headers: maskHeaders(request.headers),
					query: request.query,
					params: request.params,
					cookies: maskCookies(request.cookies),
					body: safeExtractBody(request.body, contentType),
				},
			},
			"incoming request",
		);
	});

	server.addHook("onSend", async (request, reply, payload) => {
		const contentType = getContentType(reply.getHeader("content-type"));
		request.log.info(
			{
				response: {
					statusCode: reply.statusCode,
					headers: maskHeaders(reply.getHeaders() as IncomingHttpHeaders),
					body: safeExtractBody(payload, contentType),
				},
				responseTime: reply.elapsedTime,
			},
			"request completed",
		);
		return payload;
	});

	done();
});
