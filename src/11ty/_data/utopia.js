const { calculateTypeScale, calculateSpaceScale, calculateClamps } = require('../../utils/utopia.js');

// Assuming calculateSpaceScale returns an object directly, not a JSON string
const dataSpace = calculateSpaceScale({
    minWidth: 320,
    maxWidth: 1500,
    minSize: 17,
    maxSize: 20,
    positiveSteps: [1.5, 2, 3, 4, 6],
    negativeSteps: [0.75, 0.5, 0.25],
    customSizes: ['s-l', 's-2xl', '2xl-4xl']
});

const dataType = calculateTypeScale({
    minWidth: 320,
    maxWidth: 1500,
    minFontSize: 17,
    maxFontSize: 20,
    minTypeScale: 1.2,
    maxTypeScale: 1.33,
    positiveSteps: 5,
    negativeSteps: 2
});

// Function to extract clamp values and sizes
function extractClampValuesAndSizesSpacing(data) {
    const extractedData = [];

    const extractFromArr = (arr) => {
        arr.forEach(item => {
            // console.log(item);
            extractedData.push({
                label: item.label,
                minSize: item.minSize,
                maxSize: item.maxSize,
                clamp: item.clamp
            });
        });
    };

    if (data.sizes) extractFromArr(data.sizes);
    if (data.oneUpPairs) extractFromArr(data.oneUpPairs);
    if (data.customPairs) extractFromArr(data.customPairs);

    return extractedData;
}

function extractClampValuesAndSizesType(data) {
    
    const extractedData = [];

    const extractFromArr = (arr) => {
        arr.forEach(item => {
            extractedData.push({
                label: item.step,
                minSize: item.minFontSize,
                maxSize: item.maxFontSize,
                wcagViolation: item.wcagViolation,
                clamp: item.clamp
            });
        });
    };

    extractFromArr(data);
    return extractedData;
}

const resultsSpace = extractClampValuesAndSizesSpacing(dataSpace);
const resultsStep = extractClampValuesAndSizesType(dataType);

// Logging results for debugging or direct use
// console.log(results);

module.exports = { resultsSpace, resultsStep };