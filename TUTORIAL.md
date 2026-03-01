# Tutorial: Building the "Second Mountain Ready" Landing Page

This tutorial provides a step-by-step guide to replicating the "Second Mountain Ready" landing page—a high-aesthetic, high-performance React application designed for professional personal trainers.

## Prerequisites
- **Node.js** (v18+) installed.
- **Terminal/Command Line** access.
- A **GitHub Account** (for free hosting).
- A **Google Account** (for the lead spreadsheet).

---

## Step 1: Scaffold the Project
We use **Vite** for a fast development environment and **TypeScript** for reliability.

1. Create the project:
   ```bash
   npm create vite@latest second-mountain-ready -- --template react-ts
   cd second-mountain-ready
   npm install
   ```
2. Install Core Libraries:
   ```bash
   # Icons, Validation, and Deployment tools
   npm install lucide-react validator @zootools/email-spell-checker
   npm install -D gh-pages vitest jsdom @playwright/test @google/clasp
   ```

---

## Step 2: High-Aesthetic & Accessible Design
Open `src/App.css`. Use **Vanilla CSS Variables** to define a professional, high-contrast palette that meets ADA standards for the elderly.

*Key Tip:* Increase the base `font-size` to `1.125rem` (18px) and use a dark text-light color (`#4a5568`) to ensure readability.

---

## Step 3: Performance Optimization
To ensure the site loads instantly:
1. **Optimize Images:** Convert JPEGs to **WebP**. Use the `compress.py` utility in your workspace.
2. **Lazy-Load Videos:** Create a custom `VideoCard` component. Show a static YouTube thumbnail first; only load the heavy `<iframe>` player when the user clicks "Play."

---

## Step 4: The Lead Capture System (Google Sheets)
We use **Google Apps Script** as a serverless backend.

1. **The Code:** Create an `apps-script/Code.js` with a `doPost(e)` function to append data to your spreadsheet.
2. **Self-Healing Headers:** Add a function that automatically creates and freezes headers (`Google Timestamp`, `First Name`, etc.) if they are missing.
3. **The Deployment:**
   - Run `npx clasp login` to authorize.
   - Run `npx clasp create --type sheets --title "Leads"` once.
   - Run `npx clasp push` and `npx clasp deploy` to get your Web App URL.
   - **Crucial:** Open the URL once in a browser to click **"Allow"** for Google's one-time safety check.

---

## Step 5: Advanced Form Validation
Protect your spreadsheet from "bad data":
- **Phone:** Auto-format to `208‑283‑3707` using non-breaking hyphens.
- **Email:** Use `validator.js` and an email spell-checker to catch "gnail.com" typos.
- **Hidden Fields:** Include a `submissionTime` in SQL92 format (`YYYY-MM-DD HH:MM:SS`) for your records.

---

## Step 6: Multi-Layer Testing
To ensure the site never breaks during future updates:
1. **Unit Tests (Vitest):** Create `formUtils.test.ts` to verify your formatting and validation logic.
2. **E2E Tests (Playwright):** Create `intake.spec.ts`. This script opens a real browser, fills out the form, and then **calls the backend API** to verify the data actually landed in the spreadsheet.

---

## Step 7: Free Hosting (GitHub Pages)
1. **Vite Config:** Set `base: '/repo-name/'` in `vite.config.ts`.
2. **Relative Paths:** Ensure all images use relative paths (e.g., `src="photo.webp"`, NO leading slash).
3. **Deploy:** Run `npm run deploy`. Your site will be live at `username.github.io/repo-name`.

---

## Maintenance & Updates
Updating is a 3-step loop:
1. **Edit:** Change code locally.
2. **Verify:** Run `npm test` and `npx playwright test`.
3. **Push:** Run `npm run deploy`. Your changes go live in 60 seconds.
