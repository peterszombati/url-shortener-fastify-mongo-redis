import {model, Schema} from "mongoose";

const schema = new Schema({
  alias: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

schema.index({ alias: 1 });

export const analyticsRedirects = {
  schema,
  model: model('analytics-redirects', schema)
}