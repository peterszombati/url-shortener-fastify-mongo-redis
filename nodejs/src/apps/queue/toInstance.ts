import { ResponseError } from '../http-handler/ResponseError';

const instances: Record<string, any> = {
  Error: Error,
  ResponseError: ResponseError,
};

export function toInstance(name: string, data: Record<string, any>) {
  const e = new (instances[name] || Error)();
  for (const [key, value] of Object.entries(data)) {
    e[key] = value;
  }
  return e;
}
