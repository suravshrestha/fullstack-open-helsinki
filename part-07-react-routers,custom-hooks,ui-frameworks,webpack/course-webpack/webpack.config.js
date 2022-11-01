const path = require("path");
const webpack = require("webpack");

const config = (env, argv) => {
  console.log("argv", argv.mode);

  const backend_url =
    argv.mode === "production"
      ? "https://obscure-harbor-49797.herokuapp.com/api/notes"
      : "http://localhost:3001/notes";

  return {
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, "build"),
      filename: "main.js",
    },
    devServer: {
      // webpack-dev-server
      static: path.resolve(__dirname, "build"),
      compress: true,
      port: 3000,
    },
    devtool: "source-map",
    module: {
      rules: [
        {
          // babel-loader (for JS compatibility)
          // loader for files
          test: /\.js$/,

          // processing will be done by
          loader: "babel-loader",

          // parameters to the loader
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },

        {
          // css-loader and style-loader
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        BACKEND_URL: JSON.stringify(backend_url),
      }),
    ],
  };
};

module.exports = config;
