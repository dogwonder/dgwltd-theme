const { calculateTypeScale, calculateSpaceScale, calculateClamps } = require('../../utils/utopia.js');

// Assuming calculateSpaceScale returns an object directly, not a JSON string
const dataSpace = calculateSpaceScale({
    minWidth: 320,
    maxWidth: 1240,
    minSize: 18,
    maxSize: 20,
    positiveSteps: [1.5, 2, 3, 4, 6],
    negativeSteps: [0.75, 0.5, 0.25],
    customSizes: ['s-l', '2xl-4xl']
});

const dataType = calculateTypeScale({
    minWidth: 320,
    maxWidth: 1240,
    minFontSize: 18,
    maxFontSize: 32,
    minTypeScale: 1.2,
    maxTypeScale: 1.25,
    positiveSteps: 2,
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