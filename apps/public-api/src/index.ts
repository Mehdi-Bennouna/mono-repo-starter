import { createLogger } from "@repo/logger";
import { env } from "./config/env";
import { Http } from "./http";

const logger = createLogger({ level: env.app.log.level });

const http = new Http({ logger });

await http.startServer();
