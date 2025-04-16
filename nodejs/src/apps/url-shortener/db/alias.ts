import { model, Schema } from 'mongoose';

const schema = new Schema({
  alias: { type: String, required: true, unique: true, index: true },
  longUrl: { type: String, required: true },
  generatedId: { type: Number, required: true, index: true },
  userId: { type: String, required: true },
  expireAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

schema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

export const alias = {
  schema,
  model: model('alias', schema),
};
