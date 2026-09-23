import { defineConfig } from "tsdown";
import { config } from "@repo/tsdown-config";

export default defineConfig({
	...config,
	entry: ["./src/index.ts", "./src/instrumentation-hook.ts"],
});
