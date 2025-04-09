export function fromBase62ToNumber(num: string): number {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

  return num.split('').reverse()
    .map((char, i) => {
      const value = chars.indexOf(char)
      if (value === -1) {
        throw new Error("Invalid char");
      }
      return value * Math.pow(chars.length, i)
    }).reduce((a, b) => a + b);
}