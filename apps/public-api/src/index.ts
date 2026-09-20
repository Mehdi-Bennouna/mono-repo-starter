import { createLogger } from "@repo/logger";
import { env } from "./config/env";

const logger = createLogger({ level: "info" });

logger.info({ env });
