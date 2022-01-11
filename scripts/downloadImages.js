const fs = require('fs');
const fetch = require('node-fetch');

let wikidata = JSON.parse(fs.readFileSync(`${__dirname}/../_data/wikidata.json`));

(async function () {
  for (const [_slug, data] of Object.entries(wikidata)) {
    if (!data.imageFilename || !data.thumbUrl) continue
    const path = `${__dirname}/../images/logos/${data.imageFilename}`
    console.log(`downloading ${path}...`)
    const response = await fetch(data.thumbUrl);
    const buffer = await response.buffer();
    await fs.writeFileSync(path, buffer);
  }
})()
