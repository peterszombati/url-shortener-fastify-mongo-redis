import mongoose, {ClientSession} from 'mongoose';

const enabled = false
console.log(`MongoDB transactions:${JSON.stringify({enabled})}`)

export async function mongoTransaction<T>(transactionCallback: (session: ClientSession | null) => Promise<T>): Promise<T> {
  if (!enabled) {
    return await transactionCallback(null)
  }
  const session = await mongoose.startSession();

  let e = null, result = null;
  try {
    result = await session.withTransaction(async () => {
      return await transactionCallback(session)
    });
  } catch (err) {
    e = err
  } finally {
    await session.endSession();
  }
  if (e) {
    throw e
  }
  // @ts-ignore
  return result
}
