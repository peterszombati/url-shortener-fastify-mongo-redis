import { apiKeyAuthentication } from './db/api-key-authentication';

export async function resolveUser(headerKey: string | undefined): Promise<string | null> {
  if (!headerKey) {
    return null;
  }

  const [userId, ...key] = headerKey.split('Api-Key')?.[1].trim().split(':') || [];
  if (!userId || !key) {
    return null;
  }
  const result = await apiKeyAuthentication.model.findOne({ userId }, { key: 1, _id: 0 });
  if (result && result.key === key.join(':')) {
    return userId;
  }
  return null;
}
