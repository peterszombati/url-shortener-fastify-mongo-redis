import { analyticsRedirects } from './db/analytics-redirects';

export async function handleAnalytics(alias: string) {
  const totalRedirects = await analyticsRedirects.model.countDocuments({ alias });
  const lastRedirects =
    totalRedirects > 0
      ? await analyticsRedirects.model
          .find({ alias }, {}, { projection: { createdAt: 1, _id: 0 } })
          .sort({ createdAt: -1 })
          .limit(5)
      : [];
  return {
    totalRedirects,
    lastRedirects: lastRedirects.map((i) => i.createdAt),
  };
}
