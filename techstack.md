For this project, I would use:

* **Next.js 16+** — full-stack framework using App Router
* **TypeScript** — all frontend and backend code
* **Tailwind CSS** — styling
* **Motion** (formerly Framer Motion) — scanning sequence, card reveal, medal attachment, transitions
* **GitHub GraphQL API + REST API** — fetch profile, repositories, languages, activity, contributions
* **Zustand** — only if the multi-stage reveal state becomes complex; otherwise React state is enough
* **React Three Fiber / Three.js** — only for the Developer Constellation later, not for the main card
* **Free AI API** — only for the personalized one-line Developer Class description; provider can be decided later
* **Vercel** — deployment and server-side API routes

So the core stack is simply:

```text
Next.js
+ TypeScript
+ Tailwind CSS
+ Motion
+ GitHub API
```

Then optional additions:

```text
+ Zustand          → if reveal state becomes complex
+ React Three Fiber → for Developer Constellation
+ AI API             → for one personalized sentence
```

I would **not use a database in V1**. The flow can be:

```text
Browser
  ↓
Next.js Server Route
  ↓
GitHub API
  ↓
Scoring Engine
  ↓
Level + Medals + Developer Class
  ↓
Frontend Reveal Experience
```

One important choice: do not call the GitHub API directly from the browser. Fetch through a Next.js server route so your token stays private and you can later add caching and rate-limit handling.

For this project, the final stack I would lock is:

**Next.js + TypeScript + Tailwind CSS + Motion + GitHub API + Vercel**

Everything else should be added only when a feature actually requires it.
