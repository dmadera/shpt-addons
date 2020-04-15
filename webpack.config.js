const WebpackShellPlugin = require("webpack-shell-plugin")
const path = require("path")

module.exports = {
    entry: {
        addonsEshopPapiremCz: "./src/addons-eshop-papirem-cz.js",
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist"),
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: ["style-loader", "css-loader", "sass-loader"],
            },
        ],
    },
}
