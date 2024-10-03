import clampGenerator from '../../utils/clamp-generator.js';
import spacingTokens from '../../tokens/spacing.json' assert { type: 'json' };
import colorTokens from '../../tokens/colors.json' assert { type: 'json' };
import typeTokens from '../../tokens/text-sizes.json' assert { type: 'json' };
import lineHeightTokens from '../../tokens/line-heights.json' assert { type: 'json' };
import slugify from 'slugify';

const tokens = () => {
    return {
        // Loop through the colors and create a color palette
        colorMap: colorTokens.items.map(({ name, color }) => {
            return {
                // Lowercase the name
                name: slugify(name, {
                    lower: true,
                    strict: true,
                }),
                color
            };
        }),

        // Get spacing tokens and pass them to the clamp generator
        spacing: clampGenerator(spacingTokens.items),

        // Generate an object of lineHeightTokens.items
        lineheight: clampGenerator(lineHeightTokens.items),

        // Generate an object of typeTokens.items
        text: clampGenerator(typeTokens.items),
    };
};

export default tokens;