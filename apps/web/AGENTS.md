<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Design language

This app uses the **Nike design system** installed via `npx getdesign@latest add nike`.

- **Spec:** `DESIGN.md` — colors, typography, components, spacing
- **Tokens:** `src/styles/nike-tokens.css` — CSS variables (`--nike-*`)
- **Utilities:** `src/app/globals.css` — typography classes (`.text-display-campaign`, `.nike-pill-primary`, etc.)
- **Fonts:** Bebas Neue (display) + Inter (UI) via `next/font/google` in `[locale]/layout.tsx`

When building UI, prefer Nike tokens and utilities over ad-hoc colors. Use pill buttons, soft-cloud surfaces, and campaign display type for heroes.
