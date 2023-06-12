export function getArrayOrString(x) {
  if (typeof x === 'string' || x instanceof String)
    return [x]
  else
    return x
}
