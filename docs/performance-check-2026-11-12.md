# Performance check: 2026-11-12

Sources: Vercel Web Analytics (last 30 days), Vercel Speed Insights, Google
Analytics, and a crawl of every URL in the live sitemap.

## Traffic (Vercel Analytics, last 30 days)

| Metric | Value | vs. prior 30 days |
|---|---|---|
| Visitors | 849 | -28% |
| Page views | 1,381 | -25% |
| Bounce rate | 83% | +3 pts |

**Top pages (visitors):** `/` 216, `/southern-appalachians` 32, `/drives` 25,
`/roads/redwood` 25, `/oregon` 22, `/roads` 21,
`/roads/richard-russell-scenic-highway` 21.

**Referrers:** google.com 112, duckduckgo.com 38, bing.com 31,
search.yahoo.com 17, facebook.com 8, reddit.com 8, twistedmotoring.org 5.

**Countries:** US 53%, China 22%, Singapore 15%, Hong Kong 7%, Brazil 1%.

**Devices:** desktop 60%, mobile 40%. iOS 35%, Windows 33%, Mac 24%, Android 5%.

## What the numbers say

- **~44% of visitors are likely bots.** China + Singapore + Hong Kong add up to
  44% of visitors for a site about US driving roads. That's typical of
  scrapers and crawlers, and it inflates the bounce rate. Real human traffic is
  closer to ~450 visitors/month.
- **New states pull traffic.** Southern Appalachians and Oregon (both added in
  September) are the #2 and #5 pages. Appalachia's Richard Russell page is in
  the top 7. Adding states is working.
- **Search is the main channel.** Almost all known referrals are search engines.
  Each new state and road page is another way in from search.
- **Traffic is down ~25%** month over month. No new roads or states have
  shipped since Sep 23, so there's been no new content for search to pick up.

## Gaps found

1. **Google Analytics is not running.** `app/lib/analytics.ts` only loads GA
   when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set, and it isn't set in Vercel. No
   GA property exists on the owner's Google account either. All `track()` map
   events are no-ops. Fix: create a GA4 property, add its `G-...` ID as
   `NEXT_PUBLIC_GA_MEASUREMENT_ID` in Vercel env vars, redeploy.
2. **Vercel Speed Insights is not installed.** Its dashboard shows no data.
   Fix: `npm i @vercel/speed-insights` and render `<SpeedInsights />` from
   `@vercel/speed-insights/next` in `app/layout.tsx` next to `<Analytics />`.
   Free on Hobby.
3. **Custom events need Vercel Pro**, so map interactions can only be tracked
   through GA (gap 1).

## Site health

- All **242** sitemap URLs return HTTP 200.
- Slowest server response: 0.35s (`/roads/old-topanga-canyon`). Everything else
  is under 0.3s.
- `tougemap.com` → `https://www.tougemap.com/` (308), correct.
- Vercel Hobby usage is well under limits (CDN requests 104K / 1M, function
  invocations 11K / 1M, Web Analytics events 1.3K / 50K).

## Suggested next steps

1. Ship more states. That's the clearest growth lever in the data.
2. Turn on Speed Insights (5-minute change).
3. Set up GA4 (needs the owner to create the property).
4. Optional: add a Vercel Firewall rule or bot filtering if the bot share keeps
   climbing.
