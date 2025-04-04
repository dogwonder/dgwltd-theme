// Helpers
const lerp = (x, y, a) => x * (1 - a) + y * a;
const clamp = (a, min = 0, max = 1) => Math.min(max, Math.max(min, a));
const invlerp = (x, y, a) => clamp((a - x) / (y - x));
const range = (x1, y1, x2, y2, a) => lerp(x2, y2, invlerp(x1, y1, a));
const roundValue = (n) => Math.round((n + Number.EPSILON) * 10000) / 10000;
const sortNumberAscending = (a, b) => Number(a) - Number(b);

// Clamp
const calculateClamp = ({
  maxSize,
  minSize,
  minWidth,
  maxWidth,
  usePx = false,
  relativeTo = 'viewport'
}) => {
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
};

const checkWCAG = ({ min, max, minWidth, maxWidth }) => {
  if (minWidth > maxWidth) {
    const oldMinScreen = minWidth;
    minWidth = maxWidth;
    maxWidth = oldMinScreen;

    const oldmin = min;
    min = max;
    max = oldmin;
  }
  const slope = (max - min) / (maxWidth - minWidth);
  const intercept = min - (minWidth * slope);
  const lh = (5 * min - 2 * intercept) / (2 * slope);
  const rh = (5 * intercept - 2 * max) / (-1 * slope);
  const lh2 = 3 * intercept / slope;

  let failRange = [];
  if (maxWidth < 5 * minWidth) {
    if (minWidth < lh && lh < maxWidth) {
      failRange.push(Math.max(lh, minWidth), maxWidth);
    }
    if (5 * min < 2 * max) {
      failRange.push(maxWidth, 5 * minWidth);
    }
    if (5 * minWidth < rh && rh < 5 * maxWidth) {
      failRange.push(5 * minWidth, Math.min(rh, 5 * maxWidth));
    }
  } else {
    if (minWidth < lh && lh < 5 * minWidth) {
      failRange.push(Math.max(lh, minWidth), 5 * minWidth);
    }
    if (5 * minWidth < lh2 && lh2 < maxWidth) {
      failRange.push(Math.max(lh2, 5 * minWidth), maxWidth);
    }
    if (maxWidth < rh && rh < 5 * maxWidth) {
      failRange.push(maxWidth, Math.min(rh, 5 * maxWidth));
    }
  }

  if (failRange.length) {
    failRange = [failRange[0], failRange[failRange.length - 1]];
    if (Math.abs(failRange[1] - failRange[0]) < 0.1) failRange = null;
  }

  return failRange;
};

const calculateClamps = ({ minWidth, maxWidth, pairs = [], relativeTo }) => {
  return pairs.map(([minSize, maxSize]) => {
    return {
      label: `${minSize}-${maxSize}`,
      clamp: calculateClamp({ minSize, maxSize, minWidth, maxWidth, relativeTo }),
      clampPx: calculateClamp({ minSize, maxSize, minWidth, maxWidth, relativeTo, usePx: true })
    };
  });
};

// Type

const calculateTypeSize = (config, viewport, step) => {
  const scale = range(config.minWidth, config.maxWidth, config.minTypeScale, config.maxTypeScale, viewport);
  const fontSize = range(config.minWidth, config.maxWidth, config.minFontSize, config.maxFontSize, viewport);
  return fontSize * Math.pow(scale, step);
};

const calculateTypeStep = (config, step) => {
  const minFontSize = calculateTypeSize(config, config.minWidth, step);
  const maxFontSize = calculateTypeSize(config, config.maxWidth, step);
  const wcag = checkWCAG({ min: minFontSize, max: maxFontSize, minWidth: config.minWidth, maxWidth: config.maxWidth });

  return {
    step,
    minFontSize: roundValue(minFontSize),
    maxFontSize: roundValue(maxFontSize),
    wcagViolation: wcag?.length ? {
      from: Math.round(wcag[0]),
      to: Math.round(wcag[1]),
    } : null,
    clamp: calculateClamp({
      minSize: minFontSize,
      maxSize: maxFontSize,
      minWidth: config.minWidth,
      maxWidth: config.maxWidth,
      relativeTo: config.relativeTo
    })
  };
};

const calculateTypeScale = (config) => {
  const positiveSteps = Array.from({ length: config.positiveSteps || 0 })
    .map((_, i) => calculateTypeStep(config, i + 1)).reverse();

  const negativeSteps = Array.from({ length: config.negativeSteps || 0 })
    .map((_, i) => calculateTypeStep(config, -1 * (i + 1)));

  return [
    ...positiveSteps,
    calculateTypeStep(config, 0),
    ...negativeSteps
  ];
};

// Space

const calculateSpaceSize = (config, multiplier, step) => {
  const minSize = Math.round(config.minSize * multiplier);
  const maxSize = Math.round(config.maxSize * multiplier);

  let label = 'S';
  if (step === 1) {
    label = 'M';
  } else if (step === 2) {
    label = 'L';
  } else if (step === 3) {
    label = 'XL';
  } else if (step > 3) {
    label = `${step - 2}XL`;
  } else if (step === -1) {
    label = 'XS';
  } else if (step < 0) {
    label = `${Math.abs(step)}XS`;
  }

  return {
    label: label.toLowerCase(),
    minSize: roundValue(minSize),
    maxSize: roundValue(maxSize),
    clamp: calculateClamp({
      minSize,
      maxSize,
      minWidth: config.minWidth,
      maxWidth: config.maxWidth,
      relativeTo: config.relativeTo,
    }),
    clampPx: calculateClamp({
      minSize,
      maxSize,
      minWidth: config.minWidth,
      maxWidth: config.maxWidth,
      relativeTo: config.relativeTo,
      usePx: true,
    })
  };
};

const calculateOneUpPairs = (config, sizes) => {
  return [...sizes.reverse()].map((size, i, arr) => {
    if (!i) return null;
    const prev = arr[i - 1];
    return {
      label: `${prev.label}-${size.label}`,
      minSize: prev.minSize,
      maxSize: size.maxSize,
      clamp: calculateClamp({
        minSize: prev.minSize,
        maxSize: size.maxSize,
        minWidth: config.minWidth,
        maxWidth: config.maxWidth,
        relativeTo: config.relativeTo,
      }),
      clampPx: calculateClamp({
        minSize: prev.minSize,
        maxSize: size.maxSize,
        minWidth: config.minWidth,
        maxWidth: config.maxWidth,
        relativeTo: config.relativeTo,
        usePx: true,
      }),
    };
  }).filter(size => !!size);
};

const calculateCustomPairs = (config, sizes) => {
  return (config.customSizes || []).map((label) => {
    const [keyA, keyB] = label.split('-');
    if (!keyA || !keyB) return null;

    const a = sizes.find(x => x.label === keyA);
    const b = sizes.find(x => x.label === keyB);
    if (!a || !b) return null;

    return {
      label: `${keyA}-${keyB}`,
      minSize: a.minSize,
      maxSize: b.maxSize,
      clamp: calculateClamp({
        minWidth: config.minWidth,
        maxWidth: config.maxWidth,
        minSize: a.minSize,
        maxSize: b.maxSize,
        relativeTo: config.relativeTo,
      }),
      clampPx: calculateClamp({
        minWidth: config.minWidth,
        maxWidth: config.maxWidth,
        minSize: a.minSize,
        maxSize: b.maxSize,
        relativeTo: config.relativeTo,
        usePx: true
      }),
    };
  }).filter(size => !!size);
};

const calculateSpaceScale = (config) => {
  const positiveSteps = [...config.positiveSteps || []].sort(sortNumberAscending)
    .map((multiplier, i) => calculateSpaceSize(config, multiplier, i + 1)).reverse();

  const negativeSteps = [...config.negativeSteps || []].sort(sortNumberAscending).reverse()
    .map((multiplier, i) => calculateSpaceSize(config, multiplier, -1 * (i + 1)));

  const sizes = [
    ...positiveSteps,
    calculateSpaceSize(config, 1, 0),
    ...negativeSteps
  ];

  const oneUpPairs = calculateOneUpPairs(config, sizes);
  const customPairs = calculateCustomPairs(config, sizes);

  return {
    sizes,
    oneUpPairs,
    customPairs
  };
};

// Exporting the functions as named exports
export {
  calculateTypeScale,
  calculateSpaceScale,
  calculateClamp, 
  calculateClamps
};