import { exportToSvg } from "@excalidraw/utils"
import * as fs from "node:fs/promises"

async function main() {
  const drawing = JSON.parse(await fs.readFile("./wordle mastermind.excalidraw", "utf-8"))
  const svg = exportToSvg({
    elements: drawing,
    files: {},
    appState: {},
  })

  console.log(svg)
}

main()
  .then((res) => {
    if (res as any) console.log(res)
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
