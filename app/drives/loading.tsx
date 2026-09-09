import { SiteHeader } from "../site-chrome";

export default function LoadingDrives() {
  return (
    <>
      <SiteHeader />
      <main className="prose" aria-busy="true">
        <p className="eyebrow">Bay Area driving guides</p>
        <p className="lede" role="status">Opening guide…</p>
      </main>
    </>
  );
}
