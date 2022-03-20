const FONT_FAMILY = {
  Virgil: 1,
  Helvetica: 2,
  Cascadia: 3,
}
const WINDOWS_EMOJI_FALLBACK_FONT = "Segoe UI Emoji"

const getFontFamilyString = ({ fontFamily }) => {
  for (const entry of Object.entries(FONT_FAMILY)) {
    if (entry[1] === fontFamily) {
      return `${entry[0]}, ${WINDOWS_EMOJI_FALLBACK_FONT}`
    }
  }
  return WINDOWS_EMOJI_FALLBACK_FONT
}

module.exports = {
  getDateTime() {
    const date = new Date()
    const year = date.getFullYear()
    const month = `${date.getMonth() + 1}`.padStart(2, "0")
    const day = `${date.getDate()}`.padStart(2, "0")
    const hr = `${date.getHours()}`.padStart(2, "0")
    const min = `${date.getMinutes()}`.padStart(2, "0")

    return `${year}-${month}-${day}-${hr}${min}`
  },
  supportsEmoji() {
    return false
  },
  distance: (x, y) => Math.abs(x - y),
  viewportCoordsToSceneCoords: ({ clientX, clientY }, { zoom, offsetLeft, offsetTop, scrollX, scrollY }) => {
    const invScale = 1 / zoom.value
    const x = (clientX - offsetLeft) * invScale - scrollX
    const y = (clientY - offsetTop) * invScale - scrollY

    return { x, y }
  },
  isRTL: () => false,
  getFontString: ({ fontSize, fontFamily }) => `${fontSize}px ${getFontFamilyString({ fontFamily })}`,
  getFontFamilyString,
}
