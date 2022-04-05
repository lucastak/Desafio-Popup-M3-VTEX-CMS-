const webpack = require("webpack");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");

module.exports = merge(common, {
	devtool: "inline-source-map",
	mode: "development",
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /(node_modules|bower_components)/,
				include: path.resolve(__dirname, "..", "src/arquivos/js"),
				use: {
					loader: "@sucrase/webpack-loader",
					options: {
						transforms: ["jsx"],
					},
				},
			},
		],
	},
});
