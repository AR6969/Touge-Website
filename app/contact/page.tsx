import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../site-chrome";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact California Touge.",
};

const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT?.trim();

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="prose contact-page">
        <Link className="back-link" href="/">← Back to the map</Link>
        <p className="eyebrow">California Touge</p>
        <h1>Contact</h1>
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
          <p className="contact-unavailable">The contact form is being set up. Please check back shortly.</p>
        )}
      </main>
      <SiteFooter />
    </>
  );
}