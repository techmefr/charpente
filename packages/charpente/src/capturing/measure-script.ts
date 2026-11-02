export const MEASURE_SCRIPT = `(() => {
  const MEDIA = 'img, svg, video, canvas, picture, iframe'
  const CONTROL = 'button, input, select, textarea'
  const round = (value) => Math.round(value * 10) / 10

  const isBone = (element, zone) => {
    if (element.closest('svg') && element.tagName.toLowerCase() !== 'svg') return false
    const block = element.closest('[data-charpente-block]')
    if (block && block !== element && block !== zone && zone.contains(block)) return false
    if (element.matches(MEDIA + ', ' + CONTROL) || element.hasAttribute('data-charpente-block')) return true
    return element.children.length === 0 && element.textContent.trim() !== ''
  }

  const measure = (element, zoneBox) => {
    const box = element.getBoundingClientRect()
    const style = getComputedStyle(element)
    if (box.width < 1 || box.height < 1 || style.visibility === 'hidden' || style.display === 'none') return null
    return {
      x: round(box.left - zoneBox.left),
      y: round(box.top - zoneBox.top),
      width: round(box.width),
      height: round(box.height),
      radius: parseFloat(style.borderTopLeftRadius) || 0,
    }
  }

  const zones = {}
  for (const zone of document.querySelectorAll('[data-charpente-capture]')) {
    const zoneBox = zone.getBoundingClientRect()
    const bones = [...zone.querySelectorAll('*')]
      .filter((element) => isBone(element, zone))
      .map((element) => measure(element, zoneBox))
      .filter(Boolean)
    zones[zone.getAttribute('data-charpente-capture')] = { width: round(zoneBox.width), height: round(zoneBox.height), bones }
  }
  return zones
})()`
