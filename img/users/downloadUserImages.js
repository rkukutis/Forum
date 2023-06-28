const axios = require('axios');
const { Image } = require('image-js');
const fs = require('fs');

async function downloadImage(url, filename) {
  try {
    // GET image
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const image = await Image.load(response.data);
    image.resize({ width: 100, height: 100 }).save(filename);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
}

// Create Array [100]
const seq = Array.from(Array(100).keys());
// Downloads 100 generated person images
seq.forEach((userNumber, i) => {
  setTimeout(
    () =>
      downloadImage(
        'https://thispersondoesnotexist.com/',
        `user_${userNumber + 1}.jpg`
      ),
    i * 2000
  );
});
