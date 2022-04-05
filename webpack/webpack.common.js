const webpack = require("webpack");
const path = require("path");
var shopName = require("../package.json").shopName;
/**
 * Configuração do webpack
 */

const isProd = process.env.NODE_ENV === "production";

module.exports = {
	entry: {
		main: "./src/arquivos/js/main.js",
		checkout: "./src/arquivos/js/checkout.js",
	},
	output: {
		path: path.resolve(__dirname, "..", "dist/arquivos"),
		filename: shopName + "--[name]-bundle.js",
	},
	resolve: {
		alias: {
			Helpers: path.resolve(__dirname, "..", "src/arquivos/js/helpers"),
			Lib: path.resolve(__dirname, "..", "src/arquivos/js/lib"),
			Config: path.resolve(__dirname, "..", "src/arquivos/js/config"),
			App: path.resolve(__dirname, "..", "src/arquivos/js/app"),
		},
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery",
		}),
	],
};
