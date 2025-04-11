import { analyticsRedirects } from './db/analytics-redirects';

export async function handleAnalytics(alias: string) {
  const [totalRedirects, lastRedirects] = await Promise.all([
    analyticsRedirects.model.countDocuments({ alias }),
    analyticsRedirects.model
      .find({ alias }, {}, { projection: { createdAt: 1, _id: 0 } })
      .sort({ createdAt: -1 })
      .limit(5),
  ]);
  return { totalRedirects, lastRedirects: lastRedirects.map((i) => i.createdAt) };
}
