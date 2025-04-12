import { url } from './db/url';
import { ResponseError } from '../http-handler/ResponseError';
import { randomInteger } from '../utils/randomInteger';

export const generateUniqueId = async (
  id: number | undefined,
  indexRange: [number, number],
): Promise<number> => {
  let exists = true;
  let uniqueId = id;
  let tried = 0;
  const { min, max } = { min: indexRange[0] * 238329, max: indexRange[1] * 238329 - 1 };
  if (id !== undefined) {
    for (let i = 1; i < 4 && exists && min <= i && max >= i; i++) {
      uniqueId = id + i;
      exists = (await url.model.countDocuments({ generatedId: uniqueId })) > 0;
      tried += 1;
    }
  }

  while (exists) {
    if (tried > 20) {
      throw new ResponseError({
        statusCode: 500,
        message: 'Failed to get after 20 try',
      });
    }
    uniqueId = randomInteger({ min, max });
    exists = (await url.model.countDocuments({ generatedId: uniqueId })) > 0;
    tried += 1;
  }

  if (uniqueId === undefined) {
    throw new Error('Failed to get uniqueId');
  }

  return uniqueId;
};
