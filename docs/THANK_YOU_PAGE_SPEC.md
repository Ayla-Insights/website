# Post-call "Thank You" page — spec

## Why
Cal.com can redirect an attendee to a custom URL when they leave a meeting. Right now that's
either unset (Cal.com's generic "meeting ended" screen) or pointed at the homepage as a
placeholder. Neither closes the loop after the highest-trust moment in the funnel — a live call
with the founder. This is a small, static page: no forms, no backend, no PHI, no SA gate.

## Route
`/thank-you` — **not** linked from nav or footer (destination-only, reached via Cal.com
redirect). `noindex` — not meant to rank or be found organically.

## Copy (exact)

```
CALL COMPLETE

Thanks for the time.

I'll follow up by email with next steps. If anything comes up before then, just reply
to that email — it comes straight to me.

In the meantime, here's more on how we handle your data:
→ See how we protect your data   (links to /security)

Questions? hello@heymandi.ai
```

## Tone / constraints
- No pricing push, no secondary CTA beyond the /security link — matches the low-pressure,
  founder-led tone used in the nurture sequence (`docs/NURTURE_SEQUENCE.md`). The call already
  did the selling; this page just confirms what happens next.
- No name/personalization — don't assume the Cal.com "leave meeting" redirect passes booking
  data as query params; write it to read correctly with no name filled in.
- Zero third-party scripts, consistent with the rest of the site.
- Simple `Layout`-free or minimal-`Layout` static page is fine — doesn't need SEO/prerender
  treatment since it's never linked publicly.

## Acceptance
- [ ] `/thank-you` renders with the copy above.
- [ ] Not present in `navLinks` or footer in `Layout.tsx`.
- [ ] `noindex` meta tag set.
- [ ] Once merged/deployed, Fitch sets the Cal.com Discovery Call event's "redirect on leaving
  meeting" field to `https://heymandi.ai/thank-you`.
