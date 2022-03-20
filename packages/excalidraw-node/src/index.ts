import path from "path"

import { registerFont, createCanvas, Canvas } from "canvas"

import type { AppState } from "../excalidraw/src/types"
import {
  exportToCanvas as exportSceneToCanvas,
  exportToSvg as exportSceneToSvg,
} from "../excalidraw/src/scene/export"
import { getDefaultAppState } from "../excalidraw/src/appState"
import type { NonDeletedExcalidrawElement } from "../excalidraw/src/element/types"

// Maybe load on demand instead?
// A cleaner solution would be to use require/require.resolve instead.
// But it seems like webpack doesn't want to copy the files.
registerFont(path.join(__dirname, "../../FG_Virgil.ttf"), { family: "Virgil" })
registerFont(path.join(__dirname, "../../Cascadia.ttf"), { family: "Cascadia" })

function mkCreateCanvas(scale: number = 1, type?: "svg" | "pdf") {
  return function wrappedCreateCanvas(width: number, height: number) {
    const canvas = createCanvas(width * scale, height * scale, type)

    // setAttribute is used internally for correctly rendering RTL
    // Ignore for now
    ;(canvas as any).setAttribute = function () {}

    return {
      canvas: canvas as any,
      scale,
    }
  }
}

/**
 * Calls `excalidraw/src/scene/export:exportToCanvas` with a custom canvas factory
 *
 * Accepts a new optional `type: "svg" | "pdf"` which gets passed to `createCanvas`
 *
 * See: https://github.com/Automattic/node-canvas#svg-output-support
 *
 * Example usage:
 * ```
 * const canvas = await excalidraw.exportToCanvas(elements)
 * await fs.writeFile("file.png", canvas.toBuffer())
 * ```
 */
export async function exportToCanvas(
  elements: readonly NonDeletedExcalidrawElement[],
  {
    exportScale = 1,
    exportBackground = true,
    viewBackgroundColor = "#ffffff",
    exportPadding = 10,
    type,
    ...options
  }: Partial<AppState> & {
    type?: "svg" | "pdf"
    exportPadding?: number
  } = {}
) {
  return exportSceneToCanvas(
    elements,
    {
      ...getDefaultAppState(),
      offsetTop: 0,
      offsetLeft: 0,
      width: 0,
      height: 0,
      ...options,
    },
    {}, // files
    {
      exportBackground,
      exportPadding,
      viewBackgroundColor,
    },
    mkCreateCanvas(exportScale, type)
  ) as unknown as Canvas
}

/**
 * Calls `excalidraw/src/scene/export:exportToSvg` with a replaced implementation of `document`
 *
 * Example usage:
 * ```
 * const svg = await exportToSvg(elements)
 * const svgString = svg.toString()
 * ```
 */
export async function exportToSvg(
  elements: readonly NonDeletedExcalidrawElement[],
  options?: Partial<Parameters<typeof exportSceneToSvg>[1]>
) {
  return exportSceneToSvg(elements, { ...getDefaultAppState(), ...options }, {})
}
