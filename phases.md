# Developer Identity Reveal — Implementation Phases

This document outlines the step-by-step implementation plan for the project. 
The core philosophy is: **"Make it exist first, we will improve it later."** 

We will prioritize making the entire flow functional from start to finish before worrying about complex UI polishing or advanced Motion animations.

## Phase 1: Foundation & Data Fetching (Functional Core)
**Goal:** Setup basic pages and connect to GitHub APIs.
* **Step 1:** Create basic Landing Page (input field + button).
* **Step 2:** Setup Next.js API Route for GitHub fetching (`/api/reveal`).
* **Step 3:** Implement logic to validate GitHub username.
* **Step 4:** Fetch raw user profile data and repositories using GitHub GraphQL/REST.

## Phase 2: Analysis Engine (The Brains)
**Goal:** Process the fetched data to generate the identity.
* **Step 1:** Create scoring logic for calculating `Overall Score` and `Level` (I through VII).
* **Step 2:** Build the `Medal` evaluation system (e.g., Star Magnet, Commit Machine).
* **Step 3:** Build the `Developer Class` detection system (e.g., The Relentless Builder).
* **Step 4:** Integrate simple AI API call to generate the one-line description based on the class.

## Phase 3: The Functional Flow (No Animations Yet)
**Goal:** Connect the UI to the Analysis Engine so the user can see their results.
* **Step 1:** Build a basic "Scanning" screen component (text-based progress).
* **Step 2:** Build the basic "Closed Identity Card" (Avatar, Name, Username).
* **Step 3:** Build the "Reveal" steps using simple React state (click to show Level, click to show Medals, click to show Class).
* **Step 4:** Build the "Open Card" view showing Identity, Medals, and a simple list of repositories for the Journey (no 3D yet).

## Phase 4: UI Polish & Theming (Making it Beautiful)
**Goal:** Apply the rich dark-mode aesthetic and layout the components properly.
* **Step 1:** Apply `color.md` schema thoroughly across the Landing Page, Scanning Screen, and Cards.
* **Step 2:** Improve Typography, spacing, and glassmorphism effects (`backdrop-blur`).
* **Step 3:** Design the final layout of the front of the Identity Card (avatar placement, level display, medal icons).
* **Step 4:** Design the inner layout of the Open Card (Identity, Medals, Journey areas).

## Phase 5: Animations & Motion (Making it Alive)
**Goal:** Introduce Framer Motion (Motion) to make the reveals dramatic.
* **Step 1:** Animate the Scanning Screen sequence.
* **Step 2:** Animate the Level Reveal, Medal Attachment, and Class Reveal.
* **Step 3:** Animate the transition from Closed Card to Open Card (unfolding/flipping).

## Phase 6: The Constellation & Final Features
**Goal:** Add the complex "Journey" visualizer and finishing touches.
* **Step 1:** (Optional) Implement React Three Fiber constellation in the Journey tab.
* **Step 2:** Add sharing capabilities (Download Card image, Copy Link).
* **Step 3:** Final testing, bug fixing, and deployment to Vercel.
