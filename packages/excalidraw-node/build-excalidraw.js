#!/usr/bin/env node

const path = require("path")

// Run inside the ./excalidraw folder
process.chdir("excalidraw")
require.main.paths.push(path.join(__dirname, "excalidraw", "node_modules"))

// In order to use this, you need to install Cairo on your machine. See
// instructions here: https://github.com/Automattic/node-canvas#compiling

const rewire = require("rewire")
const defaults = rewire("react-scripts/scripts/build.js")
const config = defaults.__get__("config")

// Disable multiple chunks
config.optimization.runtimeChunk = false
config.optimization.splitChunks = {
  cacheGroups: {
    default: false,
  },
}

// Set the filename to be deterministic
config.output.filename = "static/js/build-node.js"
config.output.libraryTarget = "commonjs"

// Don't choke on node-specific requires
config.target = "node"

// Set the node entrypoint
config.entry = "../src/index"

// Use new dependencies from node_modules instead of bundling them
config.externals = {
  "min-document": "commonjs min-document",
  canvas: "commonjs canvas",
}

// Allow use of __dirname. This is used to load bundled fonts
config.node.__dirname = false

const { DefinePlugin, ProvidePlugin, NormalModuleReplacementPlugin } = defaults.__get__("webpack")

config.plugins.push(
  // Avoid importing React components
  new NormalModuleReplacementPlugin(
    /src\/components\/App\.tsx/,
    path.join(__dirname, "replacements", "empty.js")
  ),
  // Ignore (S)CSS imports
  new NormalModuleReplacementPlugin(/.*\.s?css/, path.join(__dirname, "replacements", "empty.js")),
  // Replace utils.ts with a custom one that exports a supported subset
  new NormalModuleReplacementPlugin(/src\/utils\.ts/, path.join(__dirname, "replacements", "utils.js")),
  // Replace all instances of document.xyz with require('min-document').xyz
  new ProvidePlugin({
    document: "min-document",
  }),
  // Mock browser-specific constants
  new DefinePlugin({
    window: `(${JSON.stringify({
      navigator: {
        platform: "navigator.platform",
      },
      location: {
        origin: "location.origin",
      },
    })})`,
    navigator: `(${JSON.stringify({
      userAgent: "",
    })})`,
    devicePixelRatio: "1",
    DOMException: `(class DOMException extends Error {})`,
  })
)
