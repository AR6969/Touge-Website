import { SiteHeader } from "../site-chrome";

export default function LoadingDrives() {
  return (
    <>
      <SiteHeader current="drives" />
      <main className="prose" aria-busy="true">
        <p className="eyebrow">California driving guides</p>
        <p className="lede" role="status">Opening guide…</p>
      </main>
    </>
  );
}
