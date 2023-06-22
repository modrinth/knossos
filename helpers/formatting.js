export const formatList = (strings, noAnd = false) => {
  if (strings.length === 0) {
    return ''
  }
  if (strings.length === 1) {
    return strings[0]
  }
  if (noAnd) {
    return strings.join(', ')
  }
  if (strings.length === 2) {
    return strings.join(' and ')
  }
  const lastString = strings.pop()
  return strings.join(', ') + ', and ' + lastString
}
