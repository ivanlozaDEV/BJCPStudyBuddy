# 🍺 BrewStudy

A premium, offline-first study companion and guide for the Beer Judge Certification Program (BJCP), built with Expo, React Native, and React Native Reanimated.

---

## 🎨 Design System & Style Guidelines (Locked-In Aesthetic)

This section serves as the **single source of truth** for all visual components in **BrewStudy**. All future screen implementations must adhere strictly to these premium style rules to maintain a cohesive, high-end, and state-of-the-art mobile experience.

### 1. Color Palette

*   **Primary Screen Background:** Solid **Petroleum Blue** (`#2F5D73`). This color is deep, rich, and provides a stunning corporate-premium brand identity. Used as the main container background.
*   **Card Backgrounds:** Pure Technical White (`#FFFFFF`). This creates an ultra-high contrast, clean, and crisp card list over the solid Petroleum Blue.
*   **Borders:** Stainless Steel (`#A7B1BC` in light mode), `1px` thickness.
*   **Primary Brand Text (Outside Cards):** Pure White (`#FFFFFF`) for headers, titles, and light secondary text (`#A7B1BC` / `rgba(255, 255, 255, 0.7)`).
*   **Card Text (Inside Cards):** Matte Deep Black (`#0A0C10`) for card titles and Dark Steel Grey (`#2A313C`) for descriptions.
*   **Accents:** Golden Yellow (`#F2B824`) and Amber Copper (`#D97D24`) for beer characteristics, badges, and scores.

### 2. Card Styling & Layout

All primary menu options and interactive lists must be styled as cards with the following specifications:
*   **Horizontal Compression:** Cards must not span edge-to-edge. Constrain them using `width: '88%'` and center them horizontally via `alignSelf: 'center'` with a `maxWidth: 550` for responsiveness on larger screens/tablets.
*   **Layout:** Horizontal row layout (`flexDirection: 'row'`) with a padded left-column icon box, an informative central text block, and a subtle chevron arrow indicator (`→`) aligned on the right.
*   **Borders & Radius:** Rounded corners with a radius of `Spacing.three` (`16px`) and a thin `1px` stainless border.
*   **Elevation & Shadows:** Smooth, flat shadow depth:
    ```typescript
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 }
    ```
*   **Micro-Animations:** Interactive cards must feel "alive" on touch:
    - Tap/Pressed state: Scale down slightly (`transform: [{ scale: 0.99 }]`) and transition to `0.9` opacity.

### 3. Hero Branding Area

The home dashboard is crowned by a high-impact, centered brand identity block:
*   **SVG Beer Logo:** A custom-designed `BeerLogo` Tulip Glass (`size={105}`) filled with rich golden-amber gradient beer and crowned by a fluffy, voluminous, dual-tone white foam cap.
*   **Branded Typography:** The title **BrewStudy** rendered at `54px` font size with a tight `-1.2` letter-spacing:
    - **Brew:** Bold weight using `SpaceGrotesk_700Bold`.
    - **Study:** Regular weight using `SpaceGrotesk_400Regular`, nested inside a native `<Text>` tag to inherit identical color and dimensions.
*   **Subheader Slogan:** Centered uppercase subtitle (`12px`) with a spacious `2.0` letter-spacing, separated from the brand title by `Spacing.three` (`16px`) for clean breathing room.

### 4. Background Carbonation Bubbles

To give the application life and dynamic depth, a custom `<BeerBubbles />` overlay rises slowly in the background:
*   **Component:** Hardware-accelerated dynamic bubble emitter utilizing `react-native-reanimated`.
*   **Styling:** Tiny golden beads (`#FFDF80`) of varying opacities (`0.25` - `0.60`) with detailed borders rising vertically and swaying horizontally, matching the carbonation of a freshly poured pint.

### 5. Typography System

We use a highly curated typography system to separate brand, readability, and technical specs:
*   **Brand Titles & Headlines:** Space Grotesk (`SpaceGrotesk_400Regular` & `SpaceGrotesk_700Bold`) — modern, technological, and tech-forward.
*   **Body Copy & Paragraphs:** Inter (`Inter_400Regular` & `Inter_700Bold`) — clean, legible, and optimized for reading long style descriptions.
*   **Navigation & Segment Headers:** Manrope (`Manrope_600SemiBold` & `Manrope_700Bold`) — geometric, clean, and modern.
*   **Vital Stats & Technical Specs:** IBM Plex Sans (`IBMPlexSans_400Regular` & `IBMPlexSans_600SemiBold`) — technical and analytical, perfect for displaying numeric stats (ABV, IBU, SRM, OG, FG) in a laboratory-like format.

---

## 🌐 Dynamic Bilingual Localization Engine

BrewStudy is fully typed and supports seamless, real-time Spanish (`es`) and English (`en`) localization.
*   **Hook:** `const { t } = useTranslation()`
*   **Dictionary:** Located at `src/data/translations.ts`. Every label, dialog, description, and button must map through this bilingual dictionary to support instant locale switching inside Settings.

---

## 📁 Core Directory Structure

```
├── assets/                  # Brand assets and splash screens
├── src/
│   ├── app/                 # Expo Router file-based pages
│   │   ├── _layout.tsx      # Root navigation container & providers
│   │   ├── index.tsx        # Main menu / Dashboard (BrewStudy)
│   │   ├── explore.tsx      # BJCP Style Explorer (Search)
│   │   ├── settings.tsx     # Language and Haptic settings
│   │   └── flashcards.tsx   # Study flashcards screen
│   ├── components/          # Reusable native components
│   │   ├── beer-logo.tsx    # Custom vector SVG Tulip beer glass logo
│   │   ├── beer-bubbles.tsx # Reanimated carbonation background
│   │   └── themed-text.tsx  # Custom typed typography wrapper
│   ├── constants/
│   │   └── theme.ts         # Color, Font, and Spacing tokens
│   ├── context/
│   │   └── language-context.tsx # Bilingual context provider
│   ├── data/
│   │   ├── bjcp2021.ts      # Complete typed BJCP 2021 guidelines
│   │   └── translations.ts  # Localized language dictionaries
│   └── hooks/
│       └── use-theme.ts     # Locked-in Light Mode provider
```

---

## 🚀 Getting Started

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Start the Expo server:**
    ```bash
    npx expo start
    ```
