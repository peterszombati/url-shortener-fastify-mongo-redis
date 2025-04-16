import { model, Schema } from 'mongoose';

const schema = new Schema({
  userId: { type: String, required: true, index: true },
  key: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const apiKeyAuthentication = {
  schema,
  model: model('api-key-authentication', schema),
  init: async () => {
    if (process.env.DEV === '1') {
      if ((await apiKeyAuthentication.model.countDocuments({}, { limit: 1 })) === 0) {
        apiKeyAuthentication.model.insertMany([
          {
            key: 'f13aaa6528c7be63b74cf8df514d3a4cc5776caec4b76bc5ee294c981e05f90e',
            userId: 'admin',
          },
        ]);
      }
    }
  },
};
