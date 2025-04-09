import {analyticsRedirects} from "./db/analytics-redirects";

export async function saveRedirect(alias: string, date: Date) {
  const entity = new (analyticsRedirects.model)({
    alias,
    createdAt: date
  })
  await entity.save()
}