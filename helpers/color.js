export const toRgba = (decimal) => {
  let color = decimal

  color >>>= 0
  const b = color & 0xff
  const g = (color & 0xff00) >>> 8
  const r = (color & 0xff0000) >>> 16
  return 'rgba(' + [r, g, b, 1].join(',') + ')'
}
