import { fromBase62ToNumber } from '../utils/fromBase62ToNumber';
import { alias as aliasMongo } from './db/alias';
import { saveRedirect } from '../analytics/saveRedirect';
import { customAlias } from './db/custom-alias';

export async function resolveURL(alias: string): Promise<string | null> {
  const doc = alias.match(/^[a-zA-Z0-9]{6}$/g)
    ? await aliasMongo.model.findOne({ generatedId: fromBase62ToNumber(alias) })
    : await customAlias.model.findOne({ alias });

  if (!doc) {
    return null;
  }

  saveRedirect.add({ alias: doc.alias, date: new Date() }).catch((e) => console.error(e));

  return doc.longUrl;
}
