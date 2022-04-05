module.exports = {
	env: {
		browser: true,
		jquery: true,
	},
	globals: {
		Modulo: true,
	},
	extends: "eslint:recommended",
	parserOptions: {
		ecmaVersion: 10,
		sourceType: "module",
	},
	rules: {
		indent: ["warn", "tab", { SwitchCase: 1 }],
		"linebreak-style": ["warn", "unix"],
		"no-unused-vars": [
			"warn",
			{ vars: "all", args: "after-used", ignoreRestSiblings: false },
		],
		"valid-typeof": "warn",
		"no-dupe-keys": "warn",
		semi: "off",
		"no-console": "off",
		"no-useless-escape": "off",
		"no-case-declarations": "error",
		"no-undef": "off",
		"no-prototype-builtins": "off",
	},
};
