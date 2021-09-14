const path = require("path");

const { VueLoaderPlugin } = require("vue-loader");
const WebpackObfuscator = require("webpack-obfuscator");

const SCRIPTS_SRC = "./src/frontend/assets/scripts";

module.exports = {
  mode: "production",
  entry: {
    rank: `${SCRIPTS_SRC}/rank.tsx`,
    postfix: `${SCRIPTS_SRC}/postfix.js`,
    character: `${SCRIPTS_SRC}/character.js`,
    homepage: `${SCRIPTS_SRC}/homepage.tsx`,
    age: `${SCRIPTS_SRC}/age.js`,
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
    path: path.resolve(__dirname, "dist", "frontend", "assets", "scripts"),
    filename: "[name].js",
  },
  externals: {
    "js-base64": "Base64",
    clipboard: "ClipboardJS",
    "lz-string": "LZString",
    react: "React",
    "react-dom": "ReactDOM",
    vue: "Vue",
    sbd: "tokenizer",
    luxon: "luxon",
  },
};
