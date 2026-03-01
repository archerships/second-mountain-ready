# Website Best Practice Checklist

Follow this checklist when building or updating high-performance, accessible landing pages.

## 1. Accessibility (ADA & Elderly Users)
- [ ] **Contrast:** Ensure text-to-background contrast ratio is at least 4.5:1 (use a contrast checker).
- [ ] **Legibility:** Base font size should be at least 18px-20px for aging eyes.
- [ ] **Semantic HTML:** Use `<header>`, `<main>`, `<section>`, and `<address>` instead of generic `<div>`s.
- [ ] **Keyboard Nav:** Include a "Skip to Content" link and visible `:focus-visible` outlines.
- [ ] **Screen Readers:** Add `alt` text to images and `aria-label` to buttons/icons.
- [ ] **ARIA Live:** Use `role="alert"` for form error messages so they are announced instantly.

## 2. Performance (Speed & Data)
- [ ] **Image Format:** Convert JPEGs/PNGs to **WebP** for 70-80% smaller file sizes.
- [ ] **Lazy Loading:** Don't load iFrames (YouTube) until the user clicks "Play." Use lightweight thumbnails instead.
- [ ] **Asset Cleanup:** Remove unused boilerplate files (e.g., `vite.svg`, `react.svg`).
- [ ] **Build Check:** Always run `npm run build` locally to check for production errors before deploying.

## 3. Data Integrity & Forms
- [ ] **Validation:** Use `validator.js` for syntax and specialized checkers for email typos.
- [ ] **Formatting:** Standardize phone numbers (e.g., `XXX-XXX-XXXX`) before they hit the database.
- [ ] **Robust Backends:** Include "Self-Healing" logic (like auto-creating spreadsheet headers) to prevent data loss.
- [ ] **Timestamps:** Include a SQL92 formatted `submissionTime` for easier data processing later.

## 4. Stability & Security
- [ ] **Unit Tests:** Protect business logic (formatting/validation) with **Vitest**.
- [ ] **E2E Tests:** Verify the "Money Path" (lead form) works in a real browser using **Playwright**.
- [ ] **Admin Protection:** Ensure management panels are password-protected and hidden from public view.
- [ ] **Local Storage Safety:** Wrap `localStorage` calls in `try-catch` blocks to prevent crashes in private browsers (like Brave).

## 5. Deployment
- [ ] **Subfolder Hosting:** Always set the `base` path in `vite.config.ts` if hosting on GitHub Pages.
- [ ] **Relative Paths:** Use relative paths (no leading `/`) for images and assets to ensure they load in subdirectories.
- [ ] **SEO:** Ensure meta titles and descriptions are customized for the specific brand.
