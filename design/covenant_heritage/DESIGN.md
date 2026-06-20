---
name: Covenant Heritage
colors:
  surface: '#fbf9f8'
  surface-dim: '#dbd9d9'
  surface-bright: '#fbf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f3'
  surface-container: '#efeded'
  surface-container-high: '#eae8e7'
  surface-container-highest: '#e4e2e2'
  on-surface: '#1b1c1c'
  on-surface-variant: '#414750'
  inverse-surface: '#303030'
  inverse-on-surface: '#f2f0f0'
  outline: '#717781'
  outline-variant: '#c1c7d2'
  surface-tint: '#1161a0'
  primary: '#004374'
  on-primary: '#ffffff'
  primary-container: '#005b9a'
  on-primary-container: '#afd2ff'
  inverse-primary: '#9ecaff'
  secondary: '#725b29'
  on-secondary: '#ffffff'
  secondary-container: '#ffdfa0'
  on-secondary-container: '#79612e'
  tertiary: '#41413e'
  on-tertiary: '#ffffff'
  tertiary-container: '#595955'
  on-tertiary-container: '#d1cfcb'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d1e4ff'
  primary-fixed-dim: '#9ecaff'
  on-primary-fixed: '#001d36'
  on-primary-fixed-variant: '#00497d'
  secondary-fixed: '#ffdfa0'
  secondary-fixed-dim: '#e1c386'
  on-secondary-fixed: '#261a00'
  on-secondary-fixed-variant: '#584413'
  tertiary-fixed: '#e4e2dd'
  tertiary-fixed-dim: '#c8c6c2'
  on-tertiary-fixed: '#1b1c19'
  on-tertiary-fixed-variant: '#474744'
  background: '#fbf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e2'
  deep-navy: '#003D6B'
  pale-gold: '#E5D4B1'
  surface-cream: '#FAF9F6'
  border-subtle: '#E2E2E2'
typography:
  display-lg:
    fontFamily: Noto Serif
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 60px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Noto Serif
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Noto Serif
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 44px
  headline-md:
    fontFamily: Noto Serif
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Noto Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Noto Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: Noto Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Noto Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  margin-desktop: 120px
  margin-mobile: 20px
  gutter: 24px
  section-gap: 80px
---

## Brand & Style

The design system is centered around the theme of "Covenant Heritage." It is designed to evoke a sense of prestigious legacy, institutional trust, and academic excellence. The target audience includes alumni, major donors, and academic stakeholders who value tradition and the noble cause of education.

The visual style follows a **Modern Corporate** aesthetic with **Minimalist** sensibilities. It prioritizes clarity, generous whitespace, and a structured hierarchy to ensure the content feels both authoritative and inviting. By balancing deep academic blue with warm metallic gold, the UI projects a sophisticated and refined atmosphere that feels like a digital extension of a physical campus monument.

## Colors

This design system utilizes a palette rooted in institutional heritage. 
- **Primary Blue (#005B9A):** Used for primary actions, navigation, and core branding elements to signify reliability and wisdom.
- **Accent Gold (#C6A96F):** Reserved for high-importance highlights, "Call to Action" accents, and decorative flourishes to symbolize prestige and "the legacy."
- **Neutral & Background:** The background remains a pristine white or a very subtle `surface-cream` (#FAF9F6) to maintain a clean, high-end feel. Text uses a dark gray (`neutral_color_hex`) instead of pure black to improve readability and reduce visual harshness.
- **Status Colors:** Use muted versions of standard semantic colors (red for errors, green for success) to ensure they do not clash with the elegant primary palette.

## Typography

The typography strategy leverages a serif/sans-serif pairing to create a "Trust & Clarity" dynamic. 
- **Headlines:** Use **Noto Serif** for all major headings. This creates an intellectual, literary tone that aligns with academic traditions.
- **Body Text:** Use **Noto Sans** for body copy and UI elements. Its clean, humanist terminals ensure high legibility and a modern feel.
- **Labeling:** Small labels and buttons use Noto Sans with slightly increased letter spacing and a semi-bold weight to ensure functional clarity at smaller scales.
- **Mobile Scaling:** Large display titles scale down significantly on mobile to prevent awkward line breaks while maintaining their serif character.

## Layout & Spacing

This design system employs a **Fixed Grid** philosophy for desktop to maintain a contained, premium feel reminiscent of a printed editorial. 
- **Grid:** A 12-column grid is used for desktop (1140px max-width), transitioning to a single-column layout on mobile devices.
- **Rhythm:** An 8px base unit (linear scale) governs all padding and margins. 
- **Sectioning:** Generous vertical spacing (`section-gap`) is encouraged between major content blocks to give the brand a sense of "breathing room" and importance.
- **Reflow:** On tablets, margins shrink to 40px, and the 12-column grid adapts to a 6-column or 4-column structure depending on content density.

## Elevation & Depth

To maintain a "Modern Classic" look, depth is conveyed through **Ambient Shadows** and **Tonal Layers**.
- **Shadows:** Use extremely soft, low-opacity shadows (e.g., `rgba(0, 91, 154, 0.08)`) with a large blur radius. This avoids a "heavy" look while providing enough lift for cards and buttons.
- **Surface Layers:** The background is primarily `#FFFFFF`. High-priority containers (like a donation calculator or news card) use the `surface-cream` (#FAF9F6) to subtly distinguish themselves without needing harsh borders.
- **Glassmorphism:** Reserved strictly for navigation bars or overlays when scrolling over rich imagery, using a light backdrop blur (8px) to maintain focus.

## Shapes

The shape language is defined by a consistent **8px corner radius (ROUND_EIGHT)**.
- **Soft Geometry:** This radius is applied to buttons, input fields, and card containers. It provides a contemporary feel that is more approachable than sharp corners but more professional than fully rounded "pill" shapes.
- **Interactive Elements:** Buttons maintain this 8px radius. However, decorative elements like "Quick Links" or small badges may use a "Pill" shape to provide visual variety and indicate clickability.

## Components

- **Buttons:**
  - *Primary:* Solid `#005B9A` with white text. 8px rounded corners. Subtle elevation on hover.
  - *Secondary:* Outlined with `#C6A96F`. Used for secondary actions like "View History."
- **Cards:** Use a white background, 8px rounded corners, and the signature "Ambient Shadow." Cards should have a subtle 1px border of `border-subtle` (#E2E2E2) to define edges on white backgrounds.
- **Input Fields:** Minimalist design with a 1px `border-subtle`. On focus, the border transitions to `primary_blue`.
- **Chips & Tags:** Small, pill-shaped tags using the `tertiary_color_hex` background with `primary_blue` text for categorization (e.g., "Scholarship," "Development").
- **Progress Bars:** For fundraising goals, use a thick horizontal bar with the `secondary_gold` (#C6A96F) as the fill color against a `surface-cream` track.
- **Lists:** Clean typography-driven lists with gold bullet points or icons to reinforce the brand's accent color.