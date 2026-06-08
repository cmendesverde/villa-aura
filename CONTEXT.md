# Villa Aura — Domain Glossary

## About

Villa Aura is a **demo project** — a conceptual luxury villa on a Mediterranean cliffside, built to showcase a cinematic scroll-driven web experience. It is not a real property. All prices, contacts, and availability are illustrative.

## Glossary

### Guest
A person who uses Villa Aura for a Stay or Event. A Reservation captures the guest count (minimum 1, maximum 20). Do not use "client", "user", or "visitor" — use **Guest**.

### Usage Mode
One of two ways Villa Aura can be used: **Stay** (private overnight stay, priced at €4,500/night, minimum 2 nights, maximum 20 guests) or **Event** (villa hired for a single occasion, up to 20 guests, 3 indoor spaces + ocean pavilion). Both modes use the same Reservation flow — the form does not differentiate between them.

### Reservation
The act of requesting availability for Villa Aura, initiated from Space 10 (Sunset) via the Reserve Panel. A Reservation captures check-in date, check-out date, guest count, and contact details, then submits a request to the team (no real-time booking confirmation). Do not use "booking" or "enquiry" — use **Reservation**.

### Experience
The complete scroll-driven walkthrough of Villa Aura — 1331 frames across 11 Spaces, driven by Lenis + GSAP ScrollTrigger. The Experience begins at Space 0 (Hero) and ends at Space 10 (Sunset / Reserve). Do not use "scroll", "animation", or "tour" — use **Experience**.

### Space
One of the 11 numbered sections that make up the Experience. Each Space has a zero-based index (0–10), a poetic name (`room` field in code, e.g. "The Threshold", "Liquid Horizon"), and a Sequence of 121 frames. In code, the variable name `scene` refers to a Space. Do not use "scene", "section", or "room" as domain terms — use **Space**.

### Frame
A single JPEG image in the animation. Frames are named `frame_0001.jpg` through `frame_0121.jpg` within each Space folder on the CDN. Frame 0 of Space 0 is a special high-resolution PNG (`HERO.png`) used for the immediate first paint. Do not use "image" or "slide" — use **Frame**.

### Sequence
The ordered set of 121 Frames that belongs to one Space. Each Space has exactly one Sequence. Total across all Spaces: 1331 frames (11 × 121). The variable `FRAME_COUNTS` in code must always reflect `[121, 121, 121, 121, 121, 121, 121, 121, 121, 121, 121]`.

---

The 11 Spaces in order:
| Index | Slug | Poetic name |
|-------|------|-------------|
| 0 | hero | Villa Aura |
| 1 | entrance | The Threshold |
| 2 | lobby | Open Sky |
| 3 | living | Living Space |
| 4 | corridor | Between Moments |
| 5 | suite | The Suite |
| 6 | bathroom | Water Ritual |
| 7 | terrace | Edge of the World |
| 8 | pool | Liquid Horizon |
| 9 | events | Celebrate Here |
| 10 | sunset | Reserve |
