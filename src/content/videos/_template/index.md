---
# NEW VIDEO: copy this folder to src/content/videos/<url-slug>/ (no leading underscore).
# The folder name becomes the URL: /videos/<url-slug>/
# Fields marked (required) must be filled in or the build fails.

draft: true                      # set to false to publish
title: Video title               # (required) e.g. "Spring Open House Commercial"
client: Client Name              # (required) always filled in; public only when showClient is true
showClient: false                # show the client's name
approvalOnFile: false            # (required to name the client) written approval received
anonLabel: Atlanta-area law firm # (required when showClient is false)
summary: One or two sentences on what the video is for and what it did.  # (required)

videoUrl: https://www.youtube.com/watch?v=XXXXXXXXXXX  # (required) YouTube or Vimeo
thumbnail: ./thumbnail.jpg       # optional for YouTube, required for Vimeo. 1920×1080 (or 1080×1920 if vertical)
# thumbnailAlt: Custom alt text  # default: "[Client] [type] video by Hughes Media"
duration: "1:30"                 # (required) m:ss
vertical: false                  # true for 9:16 short-form

# (required) one of: brand-film, commercial, testimonial, short-form, event, explainer
type: brand-film
# (required) one of: home-services, education, legal, financial, healthcare, b2b, hospitality-events, other
industry: legal

deliverables: [Concept, Scripting, Production, Editing, Motion graphics]  # what we did
date: 2026-01-01                 # (required) release date
order: 100                       # lower shows first
featured: false                  # show on the homepage (up to 6)
reel: false                      # use as the homepage hero video

# Optional results (up to 4) — verified numbers only
# stats:
#   - number: "+40%"
#     label: Landing page conversions
# statsFootnote: Compares [period] to [period]. Figures from [source].
# testimonial:
#   quote: The quote, exactly as approved.
#   name: Jane Smith, Marketing Director
# caseStudyUrl: https://portfolio-site.com/work/client/   # full case study on the portfolio site
---

Optional: the story behind the video (Markdown). The goal, the idea, how it was shot,
and where it ran. Delete this text if you don't need it.
