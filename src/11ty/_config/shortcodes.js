export default function(eleventyConfig) {

    //Get current Unix timestamp
    eleventyConfig.addShortcode('timestamp', () => `${Date.now()}`);

    //Get the current year
    eleventyConfig.addShortcode('year', () => `${new Date().getFullYear()}`);

    //Get build date
    eleventyConfig.addShortcode("currentBuildDate", () => {
            return (new Date()).toISOString();
        });  

    //Add clamp shortcode - via https://github.com/trys/utopia-core/tree/main
    /*
    Usage 
    --font-body: {{ calculateClamp(14, 18, 360, 1440) }};
    --space-lg: {{ calculateClamp(24, 64, 360, 1440, false, 'container') }};
    24 → minSize (px): the space at the smallest container width (360px).
	64 → maxSize (px): the space at the largest container width (1440px).
	360 → minWidth (px): breakpoint where the scaling starts.
	1440 → maxWidth (px): breakpoint where scaling ends.
	false → use rem (if true, it would use px).
	‘container’ → scale relative to the container inline size, using cqi instead of viewport units like vw/vi.
    */
    eleventyConfig.addShortcode(
    "calculateClamp",
    (
      minSize,              // number (px)
      maxSize,              // number (px)
      minWidth,             // number (px)
      maxWidth,             // number (px)
      usePx = false,        // false => rem
      relativeTo = "viewport", // 'viewport' | 'viewport-width' | 'container'
      decimals = 4,         // rounding precision for output
      rootSize = 16         // px per rem when usePx = false
    ) => {

      // --- validation / coercion ---
      const toNum = v => (typeof v === "string" ? parseFloat(v) : v);
      minSize = toNum(minSize);
      maxSize = toNum(maxSize);
      minWidth = toNum(minWidth);
      maxWidth = toNum(maxWidth);
      decimals = Math.max(0, parseInt(decimals, 10) || 0);
      rootSize = toNum(rootSize) || 16;

      if (
        [minSize, maxSize, minWidth, maxWidth].some(
          v => typeof v !== "number" || Number.isNaN(v)
        )
      ) {
        throw new Error("calculateClamp: all size/width arguments must be numbers.");
      }
      if (maxWidth === minWidth) {
        throw new Error("calculateClamp: maxWidth must differ from minWidth.");
      }

      // --- helpers ---
      const pow = Math.pow(10, decimals);
      const round = n => Math.round((n + Number.EPSILON) * pow) / pow;

      const divider = usePx ? 1 : rootSize;
      const unit = usePx ? "px" : "rem";

      const relativeUnits = {
        viewport: "vi",        // inline-size; safer across writing modes
        "viewport-width": "vw",
        container: "cqi"       // container query inline size
      };
      const relUnit = relativeUnits[relativeTo] || relativeUnits.viewport;

      // --- handle negative slopes (swap endpoints for clamp only) ---
      const isNegative = minSize > maxSize;
      const minOut = isNegative ? maxSize : minSize;
      const maxOut = isNegative ? minSize : maxSize;

      // Fixed value short-circuit
      if (minSize === maxSize) {
        return `${round(minOut / divider)}${unit}`;
      }

      // --- maths in px space ---
      const slope = (maxSize - minSize) / (maxWidth - minWidth); // px / px
      const intercept = -minWidth * slope + minSize;             // px

      // --- output only converted ---
      return `clamp(${round(minOut / divider)}${unit}, ${round(intercept / divider)}${unit} + ${round(slope * 100)}${relUnit}, ${round(maxOut / divider)}${unit})`;
    }
  );

}