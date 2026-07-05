# Git DNA - Polish & Improvement Plan

This document outlines the step-by-step implementation plan for fixing bugs, adding core features, and polishing the overall Git DNA application.

## 🛠️ 1. Immediate Code Fixes (Linting & TypeScript)
These are minor issues caught by the linter that should be cleaned up before production deployment.

### **InteractiveBackground.tsx**
- **Issue:** Several variables (`mouse`, `dx`, `dy`, `distance`, `forceDirectionX`, `forceDirectionY`, `maxDistance`, `force`, `springForceX`, `springForceY`) are declared with `let` but never reassigned.
- **Implementation:** Change these `let` declarations to `const` to comply with `prefer-const` ESLint rules.

### **OpenCardView.tsx**
- **Issue:** Unescaped quotes (`"`) around the archetype description.
- **Implementation:** Replace `"` with `&quot;` in the JSX text nodes.
- **Issue:** The standard `<img>` tag is being used for the level badge.
- **Implementation:** Replace `<img>` with Next.js's optimized `<Image />` component. We will need to set fixed dimensions or `fill` with `sizes` and ensure `src` handles external or internal routes correctly.
- **Issue:** In the Journey tab, `repo` is mapped with an `any` type (`repo: any`).
- **Implementation:** Import `GitHubRepo` from `../lib/engine` and type the `repo` parameter as `GitHubRepo`.

### **IdentityCard.tsx**
- **Issue:** `earnedMedals` variable is declared but never used.
- **Implementation:** Remove the unused `earnedMedals` variable to clean up the code.

---

## 🚀 2. Missing Core Features & Setup

### **Environment Variables (`.env.local`)**
- **Issue:** `GITHUB_TOKEN` and `GEMINI_API_KEY` are required for scale, otherwise 429 Rate Limits and default AI text will occur.
- **Implementation:** 
  1. Add a `env.example` file with placeholder keys.
  2. Implement an immediate warning on the UI or terminal if these keys are missing when the app boots in development mode.
  3. Update `README.md` instructions explicitly emphasizing the need for these environment variables.

### **Download Card as Image**
- **Issue:** Users want to download their Git DNA card as an image for sharing on X/Twitter.
- **Implementation:**
  1. Install `html-to-image` via `npm install html-to-image`.
  2. Add a `ref` to the main wrapper of `IdentityCard` or `OpenCardView`.
  3. Create a "Download Image" button next to the LinkedIn share button.
  4. Use `toPng` from `html-to-image` to generate a data URL and trigger an automatic file download (`git-dna-[username].png`).

---

## 📈 3. Long-Term Improvements & Polish

### **Database & Caching**
- **Issue:** The API fetches data from GitHub and Gemini on every single request, leading to potential rate-limit exhaustion.
- **Implementation:** 
  1. Set up Vercel KV (Redis) or Supabase.
  2. In `/api/analyze/route.ts`, before fetching GitHub, check the cache for the username (e.g., `redis.get(\`dna:\${username}\`)`).
  3. If cached data exists and is less than 24 hours old, return it immediately.
  4. If not, proceed with the API fetch and cache the result with a TTL (Time To Live) of 24 hours.

### **SEO & Metadata**
- **Issue:** `layout.tsx` lacks custom metadata for social sharing.
- **Implementation:**
  1. Export a custom `Metadata` object in `app/layout.tsx`.
  2. Define `title`, `description`, `openGraph` (title, description, images), and `twitter` card configurations.
  3. Add a high-quality OG image to the `public/` directory for link previews.

### **Empty State Handling**
- **Issue:** "Ghost" accounts (0 repos, 0 activity) might crash the engine or return strange calculations.
- **Implementation:**
  1. In `/api/analyze/route.ts`, detect if `originalRepos.length === 0`.
  2. Return a specific "Ghost" archetype gracefully, bypassing standard level calculations or capping them at Level 1 (Initiate).
  3. Show a friendly empty state in the UI for accounts with no public activity.

### **Mobile Layout Polish**
- **Issue:** Deep stats and the 12 medals might break boundaries on very small screens (e.g., iPhone SE).
- **Implementation:**
  1. Test the UI using Chrome DevTools at 320px width.
  2. Adjust grid columns for Medals (e.g., use `grid-cols-1` or `grid-cols-2` on `xs` breakpoint).
  3. Adjust text sizes and padding globally for the `<OpenCardView />` on mobile to prevent overflow.
