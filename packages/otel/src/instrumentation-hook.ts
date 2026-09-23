import { register } from "node:module";

// eslint-disable-next-line @typescript-eslint/no-deprecated
register("@opentelemetry/instrumentation/hook.mjs", import.meta.url);
