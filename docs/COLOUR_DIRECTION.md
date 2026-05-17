# Colour direction

This guide defines the palette and typography tokens for this site. We use a modern, vibrant grey-green-teal palette to create a fresh, professional, and easy-on-the-brain experience.

## Core palette

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Deep Teal** | `#1F6F5F` | `rgb(31, 111, 95)` | Primary brand colour, icons, main CTAs. |
| **Medium Teal** | `#2FA084` | `rgb(47, 160, 132)` | Hover states, secondary buttons, soft borders. |
| **Mint Green** | `#6FCF97` | `rgb(111, 207, 151)` | Accent highlights, available badges, soft containers. |
| **Soft Grey (Base)** | `#EEEEEE` | `rgb(238, 238, 238)` | Main site backgrounds, inactive/disabled states. |
| **Grey-Green-Teal Gradient** | *Gradient* | *Dynamic* | Used for hero sections, brand headers, and progressive brand animations. |

### Gradient details
The **Grey-Green-Teal Gradient** (`greygreentealgradient`) is defined as:
```css
linear-gradient(135deg, #EEEEEE 0%, #6FCF97 33%, #2FA084 66%, #1F6F5F 100%)
/* or in RGB */
linear-gradient(135deg, rgb(238, 238, 238) 0%, rgb(111, 207, 151) 33%, rgb(47, 160, 132) 66%, rgb(31, 111, 95) 100%)
```

## Text direction

We avoid pure `#000000` black text on screens because it creates too much contrast and eye strain. Instead, we use a deep, soft charcoal.

| Role | Name | Hex | Description |
|------|------|-----|-------------|
| **Primary Text** | **Deep Charcoal** | `#1c1c1a` | Main body text, headings, and core labels. Highly readable but softer than pure black. |
| **Muted Text** | **Stone Grey** | `#6b6b64` | Sub-headings, helper text, and secondary labels. |
| **Faint Text** | **Soft Grey** | `#9a9a92` | Footnotes, timestamps, and placeholder text. |

### Exceptions
Only use pure `#000000` black for extremely small, high-contrast UI elements if absolutely necessary for accessibility. For almost all content, stick to **Deep Charcoal**.

