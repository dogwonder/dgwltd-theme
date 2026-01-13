import sharp from 'sharp';
import fs from 'fs';

const sizes = [16, 32, 180, 192, 512];
const inputSVG = './src/assets/icons/logo.svg';
const outDir = './src/assets/icons/fav';

// ensure folder exists
fs.mkdirSync(outDir, { recursive: true });

sizes.forEach(size => {
  sharp(inputSVG)
    .resize(size, size)
    .toFile(`${outDir}/favicon-${size}x${size}.png`)
    .then(() => console.log(`Generated favicon-${size}x${size}.png`))
    .catch(console.error);
});

fs.copyFileSync(
  './src/assets/icons/logo.svg',
  './src/assets/icons/fav/favicon.svg'
);