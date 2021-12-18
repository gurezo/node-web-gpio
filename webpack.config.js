module.exports = {
  mode: "production",
  entry: "./index.ts",
  output: {
    filename: "index.js",
    path: "/dist",
  },
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".js"],
  },
  target: "node",
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "babel-loader",
        options: {
          presets: [
            ["@babel/preset-env", { targets: "last 1 Chrome version" }],
          ],
          plugins: ["@babel/plugin-syntax-bigint"],
        },
      },
    ],
  },
};
