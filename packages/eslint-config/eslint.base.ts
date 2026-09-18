import eslint from "@eslint/js";
import stylisticPlugin from "@stylistic/eslint-plugin";
import { type Linter } from "eslint";
import importPlugin from "eslint-plugin-import";
import unicornPlugin from "eslint-plugin-unicorn";
import { configs as tsConfigs, parser as tsParser } from "typescript-eslint";

export const config: Array<Linter.Config> = [
	{ ignores: ["**/dist/**"] },
	eslint.configs.recommended,
	importPlugin.flatConfigs.recommended,
	importPlugin.flatConfigs.typescript,
	...tsConfigs.recommendedTypeChecked,
	...tsConfigs.stylisticTypeChecked,
	...tsConfigs.strictTypeChecked,
	{
		languageOptions: {
			parser: tsParser,
			ecmaVersion: "latest",
			sourceType: "module",
			parserOptions: {
				projectService: true,
			},
		},
		plugins: {
			"unicorn": unicornPlugin,
			"@stylistic": stylisticPlugin,
		},
		settings: {
			"import/resolver": {
				typescript: true,
				node: true,
			},
		},
		rules: {
			// js
			"no-console": "error",

			// node
			"unicorn/prefer-node-protocol": "error",

			// style
			"@stylistic/spaced-comment": "error",

			// import
			"import/no-dynamic-require": "warn",
			"import/consistent-type-specifier-style": ["error", "prefer-inline"],
			"import/first": "error",
			"import/newline-after-import": "error",
			"import/no-commonjs": "error",
			"import/no-duplicates": "error",

			// typescript
			"@typescript-eslint/consistent-type-definitions": "off",
			"@typescript-eslint/explicit-function-return-type": "off",
			"@typescript-eslint/switch-exhaustiveness-check": "error",
			"@typescript-eslint/require-await": "error",
			"@typescript-eslint/array-type": ["error", { default: "generic", readonly: "generic" }],
			"@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
			"@typescript-eslint/explicit-member-accessibility": ["error", { accessibility: "explicit" }],
			"@typescript-eslint/no-empty-object-type": ["error", { allowInterfaces: "with-single-extends" }],
			"@typescript-eslint/strict-boolean-expressions": [
				"error",
				{
					allowString: true,
					allowNullableObject: true,
					allowNullableBoolean: true,
					allowNullableString: true,
					allowAny: true,
					allowNumber: false,
					allowNullableNumber: false,
				},
			],
		},
	},
] as const;
