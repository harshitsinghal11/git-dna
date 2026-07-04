# Developer Identity Reveal — Project Flow

Here is the updated flow with the tier system completely removed and the Developer Identity/Class clarified.

1. User opens the website.

2. The Landing Page appears.

3. User enters their GitHub username.

4. User clicks **Reveal My Developer Identity**.

5. The app validates whether the GitHub username exists.

6. If invalid, show an error and let the user try again.

7. If valid, the app starts fetching public GitHub data.

8. The Scanning Experience begins while data is being fetched and analyzed.

9. The scan progresses through stages such as:

`Finding developer → Scanning repositories → Analyzing activity → Measuring impact → Detecting strongest language → Finding achievements → Building developer identity`

10. The app analyzes the fetched data and calculates four things:

`Overall Score → Level → Medals → Developer Class`

11. The analysis finishes.

12. A Closed Identity Card appears.

13. Initially, the card shows only basic information:

`Avatar → Name → Username → Level ??? → Class ??? → Hidden Medals`

14. The user clicks **Reveal My Identity**.

15. The Level Reveal begins.

16. The user receives exactly one overall level:

- `Level I — Initiate`

- `Level II — Explorer`

- `Level III — Builder`

- `Level IV — Craftsman`

- `Level V — Architect`

- `Level VI — Vanguard`

- `Level VII — Mythic`

17. The card visually transforms according to the earned level.

18. The Medal Reveal begins.

19. The user receives multiple medals based on specific achievements.

Possible medals:

- `Star Magnet` — strong repository star impact

- `Commit Machine` — strong coding activity

- `Polyglot` — meaningfully uses many languages

- `Deep Diver` — works on projects for long periods

- `Ship It` — consistently creates and ships projects

- `Open Source Ally` — contributes to other projects

- `Ancient One` — long GitHub journey

- `Hidden Gem` — strong work despite low visibility

- `Maintainer` — regularly maintains projects

- `Specialist` — deep focus on one technology

- `Explorer` — meaningfully experiments with technologies

- `Comeback Coder` — returns strongly after inactivity

20. Medals appear one by one and physically attach to the card.

There are no Bronze, Silver, Gold, or Diamond tiers. A medal is either **earned** or **not earned**.

21. After the medals, the Developer Class is revealed.

22. The Developer Class answers:

**"What kind of developer are you?"**

Possible classes:

- `The Relentless Builder`

- `The Deep Specialist`

- `The Fearless Explorer`

- `The Silent Maintainer`

- `The Open-Source Ally`

- `The Systems Architect`

- `The Polyglot`

- `The Project Finisher`

- `The Experimental Hacker`

- `The Comeback Coder`

23. A short personalized line appears below the class.

Example:

`THE RELENTLESS BUILDER`

`You don't collect repositories. You keep returning until they become something real.`

24. The complete front side of the Identity Card is now revealed.

It shows:

`Avatar → Name → Username → Level → Developer Class → Main Medals → Primary Language → Developer Since`

Example:

```text
┌─────────────────────────────────┐
│       LEVEL V — ARCHITECT       │
│                                 │
│          [ AVATAR ]             │
│                                 │
│        Harshit Sharma           │
│                                 │
│     THE RELENTLESS BUILDER      │
│                                 │
│   ★ Star Magnet                 │
│   ◆ Deep Diver                  │
│   ⚡ Ship It                    │
│                                 │
│   Primary Power: TypeScript     │
│   Developer Since: 2022         │
│                                 │
│          OPEN CARD              │
└─────────────────────────────────┘
```

25. The user clicks **Open Card**.

26. The card physically opens or unfolds.

27. Inside the card, the user gets three areas:

`Identity → Medals → Journey`

28. The Identity area shows:

- `Level`

- `Developer Class`

- `Personalized one-line description`

- `Primary language`

- `Developer since`

- `Important developer statistics`

29. The Medals area shows:

`All earned medals → What each medal means → Why the user earned it`

30. The Journey area shows the Developer Constellation.

31. Each meaningful repository becomes a star.

32. The constellation is generated from actual GitHub data.

Possible rules:

- `Bigger star → More impactful repository`

- `Brighter star → More recent activity`

- `Connected stars → Similar technologies`

- `Central star → Most important project`

33. The user can click any repository star.

34. A small detail view opens showing:

`Repository name → Description → Language → Stars → Created date → Last activity`

35. After exploring the card, final actions appear:

`Share Result → Download Card → Copy Link → Replay Reveal`

## Final Product System

So the final product system is now:

```text
LEVEL
How far have you progressed overall?

        +

MEDALS
What specific achievements have you earned?

        +

DEVELOPER CLASS
What kind of developer are you?

        +

JOURNEY
What projects created that identity?
```

## Full Experience

And the full experience is:

`Enter Username → Scan GitHub → Analyze → Reveal Level → Attach Medals → Reveal Developer Class → Show Complete Card → Open Card → Explore Identity, Medals and Journey → Share`

---

This is the clean version of the project flow after all the changes we discussed.