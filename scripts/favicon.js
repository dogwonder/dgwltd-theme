import sharp from 'sharp';
import ico from 'svg-to-ico';

const sizes = [128, 180, 192, 512];
const inputSVG = './src/assets/icons/logo.svg'; // Replace with your actual path

sizes.forEach(size => {
  sharp(inputSVG)
    .resize(size, size)
    .toFile(`./src/assets/icons/fav/favicon-${size}x${size}.png`, (err, info) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`Generated favicon-${size}x${size}.png`);
      }
    });
});

ico({
  input_name: inputSVG,
  output_name: './src/assets/icons/fav/favicon.ico',
  sizes: [ 32 ]
}).then(() => {
  console.log('file converted');
}).catch((error) => {
  console.error(`file conversion failed: ${error}`);
});