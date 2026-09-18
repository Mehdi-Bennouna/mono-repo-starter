import { type Configuration } from "lint-staged";

export const config: Configuration = {
	"**/*.(js|jsx|ts|tsx|json|css|md)": ["pnpm exec prettier --check"],
	"**/*.(js|jsx|ts|tsx)": ["pnpm exec eslint"],
	"**/*.(ts|tsx)": () => "pnpm exec tsc --noEmit",
};
