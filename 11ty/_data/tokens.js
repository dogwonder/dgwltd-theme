const slugify = require("slugify");
const clampGenerator = require('../../utils/clamp-generator.js');

const spacingTokens = require('../../tokens/spacing.json');
const colorTokens = require('../../tokens/colors.json');
const typeTokens = require('../../tokens/text-sizes.json');
const lineHeightTokens = require('../../tokens/line-heights.json');

module.exports = {

    //Loop through the colors and create a color palette
    colorMap: colorTokens.items.map(({name, color}) => {
        return {
            //Lowercase the name 
            name: slugify(name, {
                lower: true,
                strict: true,
            }),
            color
        };
    }), 

    //Get spacing tockens and pass them to the clamp generator

    //Generate an object of spacingTokens.items
    //Get the spacingTokens and pass the items to the clamp generator
    spacing: clampGenerator(spacingTokens.items),

    //Generate an object of spacingTokens.items
    lineheight: clampGenerator(lineHeightTokens.items),

    //Generate an object of spacingTokens.items
    //Get the spacingTokens and pass the items to the clamp generator
    text: clampGenerator(typeTokens.items),

}