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
 *
 * Example once you have a file at assets/images/plant-tulsi-1.jpg:
 *   "plant-tulsi-1": require("../assets/images/plant-tulsi-1.jpg"),
 */
export const IMAGES: Record<string, any> = {
  // "plant-tulsi-1": require("../assets/images/plant-tulsi-1.jpg"),
};

export function hasImage(key: string): boolean {
  return Boolean(IMAGES[key]);
}
