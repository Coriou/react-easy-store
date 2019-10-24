module.exports = {
	extends: ["eslint:recommended", "plugin:react/recommended"],
	parser: "babel-eslint",
	parserOptions: {
		sourceType: "module"
	},
	env: {
		browser: true,
		node: false,
		es6: true
	},
	globals: {
		__static: true
	},
	plugins: ["react-hooks"],
	rules: {
		"react-hooks/rules-of-hooks": ["error"],
		"no-unused-vars": ["warn"]
	},
	settings: {
		react: {
			version: "detect"
		}
	}
}
