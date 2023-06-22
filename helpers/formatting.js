export const formatList = (strings) => {
  if (strings.length === 0) {
    return ''
  }
  if (strings.length === 1) {
    return strings[0]
  }
  if (strings.length === 2) {
    return strings.join(' and ')
  }
  const lastString = strings.pop()
  return strings.join(', ') + ', and ' + lastString
}
