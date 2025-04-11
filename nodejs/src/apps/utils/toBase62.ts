export function toBase62(num: number): string {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (num === 0) return '0';

  let result = '';
  while (num > 0) {
    const remainder = num % 62;
    result = chars[remainder] + result;
    num = Math.floor(num / 62);
  }

  return result;
}
