# DESIGN DOCUMENT  
# Contract Risk Scanner — Hackathon MVP  
Version: 1.0  
Scope: 20-Hour Professional SaaS UI  

---

# 1. Design Philosophy

## Core Principles

- Professional > Flashy
- Trustworthy > Trendy
- Minimal > Cluttered
- Structured > Decorative
- Motion with purpose (GSAP used subtly)

This is a legal-risk tool, not an AI art playground.

Avoid:
- Neon gradients
- Glassmorphism overload
- Heavy shadows
- Animated backgrounds
- "Glowing AI orb" designs

Reference tone: Harvey.ai  
- Clean spacing  
- Strong typography  
- Confident white space  
- Subtle animations  
- Enterprise feel  

---

# 2. Visual Identity

## 2.1 Color System

### Primary Colors
- Deep Navy: #0F172A (Primary background sections)
- Soft White: #F8FAFC (Main background)
- Slate: #334155 (Headings)
- Muted Gray: #64748B (Secondary text)

### Risk Indicators
- High Risk (Red): #DC2626
- Medium Risk (Amber): #F59E0B
- Low Risk (Green): #16A34A

### Borders
- Light border: #E2E8F0

### Usage Rules
- Background mostly white
- Dark sections only for hero area
- Red only for High Risk
- Never use pure black (#000000)

---

# 3. Typography

Use:
- Inter (preferred)
- Or system sans-serif fallback

## Hierarchy

H1: 36–44px, font-semibold  
H2: 24–28px  
H3: 18–20px  
Body: 16px  
Small: 14px  

Line height: 1.6  
Letter spacing: Normal  

Avoid:
- All caps headings
- Over-bold text
- Decorative fonts

---

# 4. Layout System

Use max-width container:

- max-w-6xl
- mx-auto
- px-4 (mobile)
- px-6 (tablet)
- px-8 (desktop)

Vertical spacing:
- Section padding: py-16 (desktop)
- py-10 (mobile)

Spacing scale:
- 4 / 8 / 12 / 16 / 24 / 32 / 48

---

# 5. Page Structure

Single Page Application

--------------------------------------------------
| Header                                         |
--------------------------------------------------
| Hero Section (Dark)                           |
--------------------------------------------------
| Contract Input Section                        |
--------------------------------------------------
| Results Section                               |
--------------------------------------------------

---

# 6. Header Design

Minimal top bar.

Left:
- Logo (text-based)
- “Risk Scanner”

Right:
- Optional GitHub link (if demo)

Style:
- Height: 64px
- Border bottom: subtle
- White background

No sticky heavy shadow.

---

# 7. Hero Section

Background: Deep Navy (#0F172A)

Content centered.

H1:
“Understand Contract Risk in Seconds.”

Subtext:
“Paste your agreement. Get a clear, structured risk report instantly.”

Button:
- "Scan Contract"
- White background
- Dark text
- Rounded-xl
- Hover: slight scale + shadow

Spacing:
- py-24 desktop
- py-16 mobile

---

# 8. Contract Input Section

White background.

## Textarea Design

- Rounded-xl
- Border: 1px solid #E2E8F0
- Focus ring: subtle blue
- Padding: p-4
- Min height: 300px (desktop)
- Min height: 200px (mobile)
- Resize disabled

Placeholder:
“Paste your contract text here…”

Button below textarea:
- Full width on mobile
- Auto width on desktop
- Height: 48px
- Rounded-xl
- Background: Navy
- Text: White
- Hover: Slight brightness increase

Loading state:
- Spinner
- Button disabled
- Text: “Analyzing…”

---

# 9. Results Section

Appears only after scan.

## 9.1 Summary Card

Card:
- White
- Rounded-2xl
- Border: light gray
- Padding: p-6
- Shadow: subtle (shadow-sm only)

Top Row:
Left:
- “Overall Risk”

Right:
- Large badge (Red/Yellow/Green)
- Rounded-full
- px-4 py-2
- Font-medium

Below:
- Summary paragraph

---

## 9.2 Risk Cards

Each card:
- White background
- Border
- Rounded-xl
- Padding p-5
- Margin-bottom 16px

Top row:
Left:
- Severity Badge

Right:
- Clause Title

Middle:
- Issue (plain English)

Bottom:
- Suggestion block
- Slight gray background
- Rounded-lg
- Padding p-3

Badge Styles:

High:
- bg-red-100
- text-red-700

Medium:
- bg-amber-100
- text-amber-700

Low:
- bg-green-100
- text-green-700

---

# 10. Responsive Design Instructions

## Mobile (<640px)

- Single column layout
- Buttons full width
- Smaller padding (p-4)
- Hero text centered
- Cards stacked

Textarea height reduced to 200px

No horizontal scroll anywhere.

---

## Tablet (640px–1024px)

- Max width container
- Comfortable spacing
- Buttons auto width
- Text centered in hero

---

## Desktop (>1024px)

Optional improvement:

Split Layout after scan:

-----------------------------------------
| Textarea         | Results            |
-----------------------------------------

Left: 50%
Right: 50%

Use:
- grid-cols-2
- gap-8

This improves professionalism significantly.

---

# 11. GSAP Animation Guidelines

Use GSAP sparingly.

Do NOT:
- Animate every element
- Use bouncing effects
- Use dramatic entrances

Use only:

## 1. Hero Fade In
- Fade + slight upward movement
- Duration: 0.8s
- Ease: power2.out

## 2. Results Reveal
When results appear:
- Fade in container
- Stagger risk cards
- 0.15s stagger
- y: 20 → 0
- opacity: 0 → 1

## 3. Button Hover Micro Interaction
- scale: 1 → 1.02
- duration: 0.2

No looping animations.
No infinite motion.
No parallax.

Professional motion only.

---

# 12. UX Behavior Rules

- Disable scan button if textarea < 300 characters
- Show error message in red text below textarea
- Always show loading state
- Prevent double submission
- Scroll smoothly to results after scan

---

# 13. Empty State

Before scanning:

Show centered message:

“No contract analyzed yet.”
“Paste your agreement above to generate a risk report.”

Minimal and clean.

---

# 14. Accessibility Requirements

- All buttons keyboard accessible
- Proper aria labels
- Color contrast must pass WCAG AA
- Never rely only on color for risk indication
  (Also show text: High / Medium / Low)

---

# 15. Professional Polish Checklist

Before demo:

- No console errors
- No layout shift
- No overflowing text
- Test on:
  - Mobile Chrome
  - Desktop Chrome
  - Tablet viewport

- Check long contract (10k+ characters)
- Check small contract (500 characters)
- Test dark hero contrast

---

# 16. Final Visual Feel

The app should feel:

- Calm
- Trustworthy
- Clean
- Confident
- Structured
- Not “AI gimmicky”

If it looks like:
- A crypto landing page → wrong
- A Web3 dashboard → wrong
- A neon AI generator → wrong

It should look like:
- A legal SaaS tool used by professionals

---

# 17. Definition of Good Design for This Hackathon

- Clean layout
- Strong typography
- Clear hierarchy
- No clutter
- Subtle motion
- Fast loading
- Zero distraction from core function

The UI should make the AI output feel credible.