type query = string | null
export function arrayFromQuery(x?: query | query[] | undefined): string[] {
  if (typeof x === 'string') {
    return [x]
  } else {
    return (x ?? []) as string[]
  }
}

export function intersection(A: any[], B: any[]): any[] {
  return A.filter((x) => B.includes(x))
}
