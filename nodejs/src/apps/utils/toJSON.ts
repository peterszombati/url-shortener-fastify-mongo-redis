export function toJSON(instance: any) {
  const keys = Object.getOwnPropertyNames(instance);
  const result: any = {};
  for (const key of keys) {
    // @ts-ignore
    result[key] = instance[key];
  }
  return result;
}
