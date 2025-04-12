export function randomInteger({
                                max,
                                min,
                                range
                              }: { min: number, range?: number, max?: number }) {
  if (range === undefined) {
    if (max === undefined) {
      throw new Error("randomInteger: Invalid max")
    }
    return min + Math.floor(Math.random() * (max - min + 1))
  }
  return min + Math.floor(Math.random() * (range + 1))
}