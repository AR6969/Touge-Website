import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../site-chrome";
import { contactEmail } from "../lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact California Touge with a road suggestion, correction or question about TougeMap.",
  alternates: { canonical: "/contact" },
  openGraph: {
    url: "/contact",
    title: "Contact California Touge",
    description: "Send a road suggestion, correction or question about TougeMap.",
  },
};

const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT?.trim();

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="prose contact-page">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link> <span aria-hidden="true">/</span> Contact
        </nav>
        <h1>Contact</h1>
        <p className="lede">Found a road we&apos;re missing, a correction, or something wrong on the site? Tell us directly.</p>
        <div className="contact-card">
          {endpoint ? (
            <form className="contact-form" action={endpoint} method="POST">
              <label>
                Name
                <input name="name" type="text" autoComplete="name" required />
              </label>
              <label>
                Email for reply
                <input name="email" type="email" autoComplete="email" required />
              </label>
              <label>
                Message
                <textarea name="message" rows={7} required />
              </label>
              <input type="hidden" name="_subject" value="California Touge contact" />
              <button type="submit">Send message</button>
            </form>
          ) : (
            // No form backend configured (NEXT_PUBLIC_FORMSPREE_ENDPOINT unset).
            // A mailto link needs no third-party account, so this is never a
            // dead end while that's being set up.
            <div className="contact-fallback">
              <p>Send a road suggestion, correction or question straight to our inbox:</p>
              <a className="contact-email-cta" href={`mailto:${contactEmail}?subject=${encodeURIComponent("California Touge contact")}`}>
                Email {contactEmail} →
              </a>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
