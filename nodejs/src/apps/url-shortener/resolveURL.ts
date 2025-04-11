import { fromBase62ToNumber } from '../utils/fromBase62ToNumber';
import { url } from './db/url';
import { saveRedirect } from '../analytics/saveRedirect';

export async function resolveURL(alias: string): Promise<string | null> {
  const doc = alias.match(/^[a-zA-Z0-9]{6}$/g)
    ? await url.model.findOne({ generatedId: fromBase62ToNumber(alias) })
    : await url.model.findOne({ alias });

  if (!doc) {
    return null;
  }

  const date = new Date();
  saveRedirect(doc.alias, date).catch((e) => console.error(e));

  return doc.longUrl;
}
