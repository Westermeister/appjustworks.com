const path = require("path");

const { VueLoaderPlugin } = require("vue-loader");
const WebpackObfuscator = require("webpack-obfuscator");

const SCRIPTS_SRC = "./frontend/scripts/src";
const SCRIPTS_DIST = ["frontend", "scripts", "dist"];

module.exports = {
  mode: "production",
  entry: {
    "rank-a-list-of-items": `${SCRIPTS_SRC}/rank-a-list-of-items.tsx`,
    "postfix-rpn-calculator": `${SCRIPTS_SRC}/postfix-rpn-calculator.js`,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/],
        },
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
    ],
  },
  plugins: [new VueLoaderPlugin(), new WebpackObfuscator()],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    path: path.resolve(__dirname, ...SCRIPTS_DIST),
    filename: "[name].js",
  },
  externals: {
    "js-base64": "Base64",
    clipboard: "ClipboardJS",
    "lz-string": "LZString",
    react: "React",
    "react-dom": "ReactDOM",
    vue: "Vue",
  },
};
