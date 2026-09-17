// A drawn arrow rather than the Unicode ↗ it replaces everywhere: that glyph
// renders as a colored system emoji on iOS at normal text sizes, not a plain
// arrowhead — it looked like a little grey/blue icon, not punctuation. Sized
// off the surrounding font-size (1em) so it drops into existing text and CSS
// with no layout changes needed.
export default function ExternalArrow() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ flexShrink: 0, display: "inline", verticalAlign: "-0.05em" }}>
      <path d="M3 9L9 3M9 3H4M9 3V8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
