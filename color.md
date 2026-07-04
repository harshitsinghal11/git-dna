# Developer Identity Reveal — Color Schema

To ensure a premium, futuristic, and sleek "Developer Constellation" aesthetic, we are utilizing a dark-mode first design with vibrant glassmorphic elements and neon accents. 

## Base Colors
* **Brand Background (`--color-brand-bg`)**: `#0B0E14` — Deep Space Dark. The primary background color.
* **Brand Surface (`--color-brand-surface`)**: `#151A23` — Used for the Identity Card and elevated components.
* **Brand Border (`--color-brand-border`)**: `#1F2937` — Subtle borders for separating sections without being loud.

## Text Colors
* **Text Main (`--color-brand-text-main`)**: `#F3F4F6` — High contrast white/off-white for primary text.
* **Text Muted (`--color-brand-text-muted`)**: `#9CA3AF` — Muted gray for secondary information, dates, and labels.

## Accent Colors (Dynamic & Vibrant)
* **Primary Accent (`--color-brand-primary`)**: `#38BDF8` (Neon Cyan) — Used for core identity elements, loading states, and primary buttons.
* **Secondary Accent (`--color-brand-secondary`)**: `#818CF8` (Indigo) — Used for Developer Class highlights and gradients.
* **Tertiary Accent (`--color-brand-accent`)**: `#FBBF24` (Amber/Gold) — Used for Medals and special achievements to make them pop.

## Status Colors
* **Success (`--color-brand-success`)**: `#34D399` — Used when a GitHub user is successfully validated.
* **Error (`--color-brand-error`)**: `#F87171` — Used for validation errors or missing users.

## Glassmorphism
* **Surface Glass (`--color-brand-surface-glass`)**: `rgba(21, 26, 35, 0.7)` — Used with backdrop blur for floating elements (like the card or medals).

---

*Note: These colors have been successfully injected into `app/globals.css` and are available as Tailwind utility classes (e.g., `bg-brand-bg`, `text-brand-primary`).*
