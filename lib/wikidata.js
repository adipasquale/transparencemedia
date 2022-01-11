const fetch = require('node-fetch');
var crypto = require('crypto');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getWikidataId(wikipediaTitle) {
  const url = `https://fr.wikipedia.org/w/api.php?action=query&prop=pageprops&titles=${wikipediaTitle}&format=json`
  const response = await fetch(url);
  await sleep(1000); // to avoid getting banned from wikipedia api
  const parsed = JSON.parse(await response.text())
  const pages = Object.entries(parsed.query.pages)
  if (pages.length == 0) {
    console.log(`no associated pages for ${wikipediaTitle} :(`)
    process.exit(1)
  } else if (pages.length > 1) {
    console.log(`multiple associated pages for ${wikipediaTitle} :(`)
    process.exit(1)
  }
  return pages[0][1].pageprops?.wikibase_item;
}

async function getWikimediaLogoFilename(wikidataId) {
  const url = `https://www.wikidata.org/w/api.php?action=wbgetclaims&property=P154&entity=${wikidataId}&format=json`
  const response = await fetch(url);
  await sleep(1000); // to avoid getting banned from wikipedia api
  const parsed = JSON.parse(await response.text())
  const logoClaims = parsed?.claims?.P154 || [];
  const logoClaim = logoClaims.length > 0 ? logoClaims[0] : null;
  const filename = logoClaim?.mainsnak?.datavalue?.value
  if (!filename) {
    console.log(`could not find logo datavalue for ${wikidataId}`)
    return null;
  }
  return filename;
}

function getWikimediaFileUrl(filename) {
  // from https://stackoverflow.com/a/34402875
  const fn = filename.replace(/ /g, "_")
  const h = crypto.createHash('md5').update(fn).digest('hex');
  return `https://upload.wikimedia.org/wikipedia/commons/${h[0]}/${h[0]}${h[1]}/${fn}`
}

function getWikimediaThumbUrl(filename) {
  const fn = filename.replace(/ /g, "_")
  return `https://commons.wikimedia.org/w/thumb.php?width=500&f=${fn}`
}

module.exports = {
  getWikidataId,
  getWikimediaLogoFilename,
  getWikimediaFileUrl,
  getWikimediaThumbUrl
}
