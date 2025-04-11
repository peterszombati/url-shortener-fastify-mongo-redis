import { model, Schema } from 'mongoose';

const schema = new Schema({
  count: { type: Number, required: true },
  utcDate: { type: Date, required: true },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

schema.index({ userId: 1 });

export const urlRatelimit = {
  schema,
  model: model('url-ratelimit', schema),
};
