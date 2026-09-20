/**
 * GreenRoots image registry
 * ──────────────────────────
 * Metro (the Expo bundler) needs every `require()` path to be static, so
 * images can't be loaded from a dynamic string at runtime. Instead:
 *
 *   1. Drop your image file into /assets/images/  (e.g. plant-tulsi-1.jpg)
 *   2. Add ONE line below mapping its key to a require() of that file.
 *   3. Reload the app — <AppImage imageKey="plant-tulsi-1" /> will pick it
 *      up automatically everywhere it's used, with no other code changes.
 *
 * Until a key is added here, <AppImage> renders a clearly-labelled themed
 * placeholder in its place so the layout still looks complete.
 *
 * See README.md → "Image Placement Guide" for the full list of keys, exact
 * suggested search terms, and where each one appears in the app.
 */
export const IMAGES: Record<string, any> = {
  // ── Brand ────────────────────────────────────────────────────────────
  "logo-vanaushadhi": require("../assets/images/logo-vanaushadhi.png"),

  // ── Plant library (15 profiles in data/plants.ts) ───────────────────
  "plant-tulsi-1": require("../assets/images/plant-tulsi-1.jpg"),
  "plant-neem-1": require("../assets/images/plant-neem-1.jpg"),
  "plant-aloevera-1": require("../assets/images/plant-aloevera-1.jpg"),
  "plant-ginger-1": require("../assets/images/plant-ginger-1.jpg"),
  "plant-turmeric-1": require("../assets/images/plant-turmeric-1.jpg"),
  "plant-mint-1": require("../assets/images/plant-mint-1.jpg"),
  "plant-amla-1": require("../assets/images/plant-amla-1.jpg"),
  "plant-guava-1": require("../assets/images/plant-guava-1.jpg"),
  "plant-pomegranate-1": require("../assets/images/plant-pomegranate-1.jpg"),
  "plant-garlic-1": require("../assets/images/plant-garlic-1.jpg"),
  "plant-cinnamon-1": require("../assets/images/plant-cinnamon-1.jpg"),
  "plant-moringa-1": require("../assets/images/plant-moringa-1.jpg"),
  "plant-lemon-1": require("../assets/images/plant-lemon-1.jpg"),
  "plant-curryleaves-1": require("../assets/images/plant-curryleaves-1.jpg"),
  "plant-ashwagandha-1": require("../assets/images/plant-ashwagandha-1.jpg"),

  // ── Tree verification photos ─────────────────────────────────────────
  "tree-sapling-1": require("../assets/images/tree-sapling-1.jpg"),
  "tree-sapling-2": require("../assets/images/tree-sapling-2.jpg"),
  "tree-sapling-3": require("../assets/images/tree-sapling-3.jpg"),
  "tree-grown-1": require("../assets/images/tree-grown-1.jpg"),
  "tree-grown-2": require("../assets/images/tree-grown-2.jpg"),
  "tree-grown-3": require("../assets/images/tree-grown-3.jpg"),

  // ── Landing hero + verification flow ────────────────────────────────
  "hero-forest-canopy": require("../assets/images/hero-forest-canopy.jpg"),
  "verification-capture-preview": require("../assets/images/verification-capture-preview.jpg"),
};

export function hasImage(key: string): boolean {
  return Boolean(IMAGES[key]);
}
