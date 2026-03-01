# Tutorial: Building the "Second Mountain Ready" Landing Page

This tutorial provides a step-by-step guide to replicating the "Second Mountain Ready" landing page—a high-aesthetic, high-performance, and secure React application designed for professional personal trainers.

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
   npm install -D gh-pages vitest jsdom @playwright/test @google/clasp @faker-js/faker
   ```

---

## Step 2: High-Aesthetic & Accessible Design
Open `src/App.css`. Use **Vanilla CSS Variables** to define a professional, high-contrast palette that meets ADA standards for the elderly.

*Key Tip:* Increase the base `font-size` to `1.125rem` (18px) and use a dark text-light color (`#4a5568`) to ensure readability for visually impaired users.

---

## Step 3: Performance Optimization
To ensure the site loads instantly:
1. **Optimize Images:** Convert JPEGs to **WebP** using high-compression logic.
2. **Lazy-Load Videos:** Only load the heavy YouTube `<iframe>` when the user clicks "Play." Show a lightweight thumbnail initially.

---

## Step 4: The Lead Capture System (Google Sheets)
We use **Google Apps Script** as a serverless backend.

1. **Secure Backend:** Move logic like password checks and data purging to the script.
2. **Secrets Management:** Use Google's `PropertiesService` to store sensitive data like the `ADMIN_PASSWORD` and `API_KEY`. Never hardcode these in your frontend code!
3. **Self-Healing Headers:** The script automatically creates and freezes headers if they are deleted or modified.

---

## Step 5: Advanced Form Validation
Protect your spreadsheet from "bad data":
- **Phone:** Auto-format to `XXX‑XXX‑XXXX` using non-breaking hyphens.
- **Email:** Use `validator.js` and an email spell-checker to catch typos.
- **Hidden Fields:** Include a `submissionTime` in SQL92 format for your records.

---

## Step 6: Multi-Layer Testing
1. **Unit Tests (Vitest):** Verify your formatting and validation logic in `src/utils/formUtils.test.ts`.
2. **E2E Tests (Playwright + Faker):** Create scripts that open a real browser, generate realistic identities using **Faker**, and verify that data flows through to the spreadsheet.

---

## Step 7: Security Hardening
1. **API Key:** Require a secret `key` parameter for all administrative `GET` requests (clear, setup, verify).
2. **Backend Auth:** Handle "Admin Login" by sending the password to the backend via `POST`. This prevents the password from being visible in the site's source code.

---

## Step 8: Free Hosting (GitHub Pages)
1. **Vite Config:** Set `base: '/repo-name/'` in `vite.config.ts`.
2. **Deploy:** Run `npm run deploy`. Your site will be live at `username.github.io/repo-name`.

---

## Maintenance & Updates
Updating is a 3-step loop:
1. **Edit:** Change code locally.
2. **Verify:** Run `npm test` and `npx playwright test`.
3. **Push:** Run `npm run deploy`. Your changes go live in 60 seconds.
