# Tutorial: Building the "Second Mountain Ready" Landing Page

This tutorial provides a step-by-step guide to replicating the "Second Mountain Ready" landing page—a high-aesthetic, functional React application designed for personal trainers.

## Prerequisites
- **Node.js** (v18+) installed on your machine.
- **Terminal/Command Line** access.
- A basic understanding of **React** and **CSS**.

---

## Step 1: Scaffold the Project
We use **Vite** for a fast, modern development environment.

1. Open your terminal and create the project:
   ```bash
   npm create vite@latest second-mountain-ready -- --template react-ts
   cd second-mountain-ready
   npm install
   ```
2. Install **Lucide React** for professional iconography:
   ```bash
   npm install lucide-react
   ```

---

## Step 2: Define the Design System (CSS)
Create a professional look using **Vanilla CSS Variables**. Open `src/App.css` and replace its content with a system that defines:
- **Primary Colors:** Deep blues (`#2c5282`) for trust and authority.
- **Accent Colors:** Health-focused greens (`#48bb78`) for action.
- **Responsive Layouts:** Using CSS Grid for the video gallery and Flexbox for the header.

*Key Concept:* Use `:root` variables to make it easy to change the brand's "look and feel" in one place.

---

## Step 3: Build the Core Application logic
Open `src/App.tsx`. We use React **Functional Components** and **Hooks** to manage the site.

### 1. State Management
We use the `useState` hook for:
- **Admin Mode:** Toggling the ability to edit the site.
- **Videos:** Storing a list of YouTube/Trainerize links.
- **Form Data:** Tracking user input in the intake form.

### 2. Persistence with LocalStorage
To ensure Heather's video links aren't lost when she refreshes the page, we use the `useEffect` hook to save and load the `videos` array to the browser's `localStorage`.

### 3. Video Handling
Create a function that takes a standard YouTube URL and converts it into an **Embed URL** (e.g., changing `watch?v=ID` to `embed/ID`) so it can play directly on the page inside an `<iframe>`.

---

## Step 4: Create the "Admin" Experience
A key requirement was allowing the trainer to manage her own videos without touching code.
1. Add an "Admin" button in the header.
2. Create a conditional "Add Video" form that only appears when `isAdmin` is true.
3. Add a "Delete" button (trash icon) to each video card that is only visible in Admin mode.

---

## Step 5: Implement the Lead Capture Form
The intake form collects:
- Name, Email, Phone.
- **GLP-1 Duration:** A specialized field for Heather's niche.
- **Fitness Goals:** A text area for qualitative data.

*Developer Note:* The form uses a "controlled component" pattern, where every keystroke updates the React state.

---

## Step 6: Connect to Google Sheets (The Backend)
Since we want to avoid a complex database, we use **Google Apps Script** as a "serverless" backend.

1. **The Spreadsheet:** Create a Google Sheet with headers.
2. **The Script:** Write a `doPost(e)` function in the Apps Script editor that parses incoming JSON and appends it as a new row.
3. **The Deployment:** Deploy the script as a **Web App** with access set to "Anyone."
4. **The Connection:** Paste the resulting URL into your React `handleFormSubmit` function.

---

## Step 7: Adding Real Assets
To replace placeholders with real photos:
1. Place your image files in the `public/` folder of your project.
2. Reference them in your code using a simple absolute path (e.g., `<img src="/my-photo.jpg" />`).

---

## Running the Site
To see your work in action:
```bash
npm run dev
```
Navigate to `http://localhost:5173/` in your browser.

---

## Summary of Architecture
- **Frontend:** React + TypeScript (Vite).
- **Styling:** Vanilla CSS (Modern CSS Grid/Flex).
- **Icons:** Lucide-React.
- **Persistence:** Browser LocalStorage (for videos).
- **Backend:** Google Apps Script + Google Sheets (for leads).

---

## Step 8: Get a Free Domain & Hosting
Once your site is ready locally, you need to make it available to the world.

### 1. Free Domain Options
*   **Subdomains (Truly Free):** The easiest way to get a free domain is using your host's subdomain. For example, if you use GitHub Pages, your site will be `yourusername.github.io/second-mountain-ready`. This is professional, secure (HTTPS), and permanent.
*   **Educational (GitHub Student Pack):** If you are a student, you can get a free `.me` or `.tech` domain for 1 year through the GitHub Student Developer Pack.
*   **Low-Cost TLDs:** If you want a custom name like `secondmountainready.com`, providers like Namecheap often offer `.site` or `.online` domains for ~$1.00 for the first year.

### 2. Hosting with GitHub Pages (Free)
GitHub Pages is the best free host for static sites like this one.

**Method A: Using GitHub Desktop or Web (Beginner)**
1.  **Initialize Git:**
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```
2.  **Create a Repository:** Go to GitHub.com and create a new repository named `second-mountain-ready`.
3.  **Push to GitHub:**
    ```bash
    git remote add origin https://github.com/yourusername/second-mountain-ready.git
    git branch -M main
    git push -u origin main
    ```

**Method B: Using GitHub CLI (Advanced/Faster)**
If you have the `gh` tool installed and authenticated:
```bash
git init
git add .
git commit -m "Initial commit"
gh repo create second-mountain-ready --public --source=. --remote=origin --push
```

### 3. Automated Deployment Configuration
To make deployment a one-command process, you must configure your `package.json`:

1.  **Install the deployment package:**
    ```bash
    npm install gh-pages --save-dev
    ```
2.  **Update `package.json`:** Add the `homepage` field and the deployment scripts.
    ```json
    {
      "homepage": "https://yourusername.github.io/second-mountain-ready/",
      "scripts": {
        "predeploy": "npm run build",
        "deploy": "gh-pages -d dist"
      }
    }
    ```
3.  **Deploy:** Run the command:
    ```bash
    npm run deploy
    ```

---

## Step 9: Common Build Issues (TypeScript)
When running `npm run deploy`, the process might fail if your code has "lint" or "type" errors. React's strict mode ensures only high-quality code reaches the web.

**Common Error:** `error TS6133: 'Variable' is declared but its value is never read.`
- **Why?** You imported a component (like an icon) or defined a variable but didn't use it in your UI.
- **Fix:** Either remove the unused import or comment out the unused variable until you need it.

---

## Step 10: Pointing a Custom Domain
If you purchased a domain (e.g., `heathercooper.com`), here is how to point it to your GitHub site:

1.  **In your Domain Registrar (DNS Settings):**
    *   **Add 4 "A" Records** pointing to GitHub's IPs:
        *   `185.199.108.153`
        *   `185.199.109.153`
        *   `185.199.110.153`
        *   `185.199.111.153`
    *   **Add a CNAME Record** for `www` pointing to `yourusername.github.io`.
2.  **In GitHub Repository Settings:**
    *   Go to **Settings** > **Pages**.
    *   Under **Custom Domain**, type your domain name and click **Save**.
    *   Check **Enforce HTTPS** (Wait a few hours for the SSL certificate to issue).

---

## Step 10: Updating Your Website
Updating the site is a simple three-step process:

1.  **Make Changes:** Edit your code locally (e.g., adding a new video or changing text).
2.  **Test Locally:** Run `npm run dev` to ensure everything looks right.
3.  **Deploy:** Run the command:
    ```bash
    npm run deploy
    ```
    This will automatically build the new version and push it to the live web. Your changes will appear online within 1-2 minutes.
