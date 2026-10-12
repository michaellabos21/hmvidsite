---
# NEW PROJECT: copy this folder to src/content/projects/<url-slug>/ (no leading underscore).
# The folder name becomes the URL: /work/<url-slug>/
# Replace hero.jpg (2400×1125 or larger, any format; the build converts to WebP).
# Fields marked (required) must be filled in or the build fails.

draft: true                      # set to false to publish
client: Client Name              # (required) always filled in; public only when approved
showClient: false                # show the client name, logo and live site link
approvalOnFile: false            # (required to name the client) written approval received
anonLabel: Atlanta-area law firm # (required when showClient is false)
outcome: More qualified leads at a lower cost  # (required) "[Client]: [Outcome]"
summary: One or two sentences on what we did and what changed.  # (required)
heroImage: ./hero.jpg            # (required)
# heroAlt: Custom alt text       # default: "[Client] [service] project by Hughes Media"

# (required) one or more of: seo, ppc, paid-social, web-design-development, video, branding, email, programmatic
services: [seo]
# (required) one of: home-services, education, legal, financial, healthcare, b2b, hospitality-events, other
industry: legal

date: 2026-01-01                 # (required) completion date, used for ordering
order: 100                       # lower shows first on Work and the homepage
featured: false                  # show on the homepage (up to 6)
period: 2025–2026                # timeframe shown in the hero

stats:                           # (required) 1–4 measurable results; the first shows on the card
  - number: "+00%"
    label: Qualified leads
statsFootnote: Results compare [period] to [period]. Figures from Google Ads and [source].

# The three sections below are Markdown.
challenge: |
  What wasn't working, in the client's terms.
approach: |
  What we did and why.
results: |
  What changed, with numbers.

# Optional
# gallery:
#   - src: ./gallery-1.jpg
#     alt: Describe the image
# videoUrl: https://www.youtube.com/watch?v=XXXXXXXXXXX   # from the HM video site
# testimonial:
#   quote: The quote, exactly as approved.
#   name: Jane Smith, Marketing Director
# liveUrl: https://client-site.com
# canonicalUrl: https://hughesmedia.us/case-study/        # if this duplicates a main-site case study
---
