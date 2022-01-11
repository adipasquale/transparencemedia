const fs = require('fs');
const fetch = require('node-fetch');

let wikipedia = JSON.parse(fs.readFileSync(`${__dirname}/../_data/wikipedia.json`));

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async function () {
  for (const [_slug, data] of Object.entries(wikipedia)) {
    if (!data.imageFilename) continue
    const path = `${__dirname}/../images/logos/${data.imageFilename}`
    console.log(`downloading ${path}...`)
    const response = await fetch(data.imageUrl);
    await sleep(2000)
    const buffer = await response.buffer();
    await fs.writeFileSync(path, buffer);
  }
})()
