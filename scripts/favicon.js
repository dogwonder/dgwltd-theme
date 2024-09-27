const sharp = require('sharp');
const ico = require('svg-to-ico');

const sizes = [128, 180, 192, 512];
const inputSVG = './src/images/logo.svg'; // Replace with your actual path

sizes.forEach(size => {
  sharp(inputSVG)
    .resize(size, size)
    .toFile(`./src/images/fav/favicon-${size}x${size}.png`, (err, info) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`Generated favicon-${size}x${size}.png`);
      }
    });
});

ico({
  input_name: inputSVG,
  output_name: './src/images/fav/favicon.ico',
  sizes: [ 32 ]
}).then(() => {
  console.log('file converted');
}).catch((error) => {
  console.error(`file conversion failed: ${error}`);
});