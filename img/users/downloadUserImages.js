const axios = require('axios');
const fs = require('fs');

async function downloadImage(url, filename) {
  const response = await axios.get(url, { responseType: 'arraybuffer' });

  fs.writeFile(`${__dirname}/${filename}`, response.data, (err) => {
    if (err) throw err;
    console.log('Image downloaded successfully!');
  });
}

const seq = Array.from(Array(100).keys());
seq.forEach((userNumber, i) => {
  setTimeout(
    () =>
      downloadImage(
        'https://thispersondoesnotexist.com/',
        `user_${userNumber}.jpg`
      ),
    i * 2000
  );
});
