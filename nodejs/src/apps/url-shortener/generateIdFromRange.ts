export function generateIdFromRange(numbers: number[], indexRange: [number, number]) {
  const range = (indexRange[1] - indexRange[0] + 1) * 238329 - 1;

  let r = range;
  let bytesCanBeUsed = 0;
  for (let i = 0; i < numbers.length; i++) {
    r = (r - (r % 256)) / 256;
    bytesCanBeUsed += 1;
    if (r < 1) {
      break;
    }
  }

  const max = numbers.slice(0, bytesCanBeUsed).reduce((_p, _c, i) => 255 * Math.pow(256, i));
  const divider = max / range;
  const generatedId = Math.floor(
    numbers.slice(0, bytesCanBeUsed).reduce((p, c, i) => p + c * Math.pow(256, i)) / divider,
  );
  return {
    result: indexRange[0] + generatedId,
    debug: {
      divider,
      max,
      range,
    },
  };
}
