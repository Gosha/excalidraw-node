import * as fs from "node:fs/promises"
import type * as indexNode from "./src/index"

const excalidraw = require("./excalidraw/build/static/js/build-node.js") as typeof indexNode

async function getElements() {
  const { elements } = JSON.parse(await fs.readFile("./test.excalidraw", "utf-8"))
  return elements
}

async function renderCanvasSVG() {
  const res = await excalidraw.exportToCanvas(await getElements(), {
    type: "svg",
    exportScale: 2,
  })

  const filename = "test-canvas.svg"
  await fs.writeFile(filename, res.toBuffer())
  console.log("wrote", filename)
}

async function renderPNG() {
  const filename = "test.png"

  const elements = await getElements()
  const canvas = await excalidraw.exportToCanvas(elements)
  await fs.writeFile(filename, canvas.toBuffer())

  console.log("wrote", filename)
}

async function renderSVG() {
  const res = await excalidraw.exportToSvg(await getElements())
  const filename = "test-svg.svg"
  await fs.writeFile(filename, res.toString())
  console.log("wrote", filename)
}

async function main() {
  await Promise.all([renderSVG(), renderPNG(), renderCanvasSVG()])
}

main()
  .then(() => {
    process.exit(0)
  })
  .catch((e) => {
    console.error(e)
  })
