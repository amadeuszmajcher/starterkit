module.exports = {
    output: {
        filename: "main.js"
    },
    mode: "production",
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                        plugins: ['@babel/plugin-transform-modules-commonjs'],
                    }
                }
            }
        ]
    }
}