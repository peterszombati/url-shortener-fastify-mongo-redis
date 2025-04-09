import {model, Schema} from "mongoose";

const schema = new Schema({
  userId: { type: String, required: true },
  key: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

schema.index({ userId: 1 });

export const apiKeyAuthentication = {
  schema,
  model: model('api-key-authentication', schema),
  init: async () => {
    if (await apiKeyAuthentication.model.countDocuments({}, {limit:1}) === 0) {
      apiKeyAuthentication.model.insertMany([
        {key: "f13aaa6528c7be63b74cf8df514d3a4cc5776caec4b76bc5ee294c981e05f90e", userId: "admin"}
      ])
    }
  }
}