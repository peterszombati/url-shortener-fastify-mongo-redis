import { apiKeyAuthentication } from './db/api-key-authentication';

export async function resolveUser(headerKey: string | undefined): Promise<string | null> {
  if (!headerKey) {
    return null;
  }

  const [userId, ...key] = headerKey.split('Api-Key')?.[1].trim().split(':') || [];
  if (!userId || !key) {
    return null;
  }
  const result = await apiKeyAuthentication.model.countDocuments({ userId, key: key.join(':') }, { limit: 1 });
  if (result > 0) {
    return userId;
  }
  return null;
}
