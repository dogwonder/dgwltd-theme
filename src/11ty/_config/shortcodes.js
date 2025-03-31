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
    eleventyConfig.addShortcode('calculateClamp', (
        minSize,
        maxSize,
        minWidth,
        maxWidth,
        usePx = false,
        relativeTo = 'viewport'
    ) => {
        // Helpers
        const roundValue = (n) => Math.round((n + Number.EPSILON) * 10000) / 10000;

        // Clamp
        const isNegative = minSize > maxSize;
        const min = isNegative ? maxSize : minSize;
        const max = isNegative ? minSize : maxSize;

        const divider = usePx ? 1 : 16;
        const unit = usePx ? 'px' : 'rem';
        const relativeUnits = {
        viewport: 'vi',
        'viewport-width': 'vw',
        container: 'cqi'
        };
        const relativeUnit = relativeUnits[relativeTo] || relativeUnits.viewport;

        const slope = ((maxSize / divider) - (minSize / divider)) / ((maxWidth / divider) - (minWidth / divider));
        const intersection = (-1 * (minWidth / divider)) * slope + (minSize / divider);
        return `clamp(${roundValue(min / divider)}${unit}, ${roundValue(intersection)}${unit} + ${roundValue(slope * 100)}${relativeUnit}, ${roundValue(max / divider)}${unit})`;
    });

}