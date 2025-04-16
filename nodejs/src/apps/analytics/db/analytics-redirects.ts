import { model, Schema } from 'mongoose';

const schema = new Schema({
  alias: { type: String, required: true, index: true },
  createdAt: { type: Date, default: Date.now },
});

export const analyticsRedirects = {
  schema,
  model: model('analytics-redirects', schema),
};
