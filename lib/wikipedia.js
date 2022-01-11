const fetch = require('node-fetch');
var crypto = require('crypto');
const { getPackedSettings } = require('http2');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getWikimediaThumbUrl(filename) {
  const fn = filename.replace(/ /g, "_")
  return `https://commons.wikimedia.org/w/thumb.php?width=500&f=${fn}`
}

function getWikimediaFileUrl(page) {
  // from https://stackoverflow.com/a/34402875
  const filename = page.pageimage
  const domain = page.thumbnail.source.match(/.*\/wikipedia\/([a-z]+)\/.*/)[1]
  const fn = filename.replace(/ /g, "_")
  const h = crypto.createHash('md5').update(fn).digest('hex');
  return `https://upload.wikimedia.org/wikipedia/${domain}/${h[0]}/${h[0]}${h[1]}/${fn}`
}

async function getWikipediaImageUrl(wikipediaTitle) {
  return await getWikipediaImageUrlMain(wikipediaTitle) ||
    await getWikipediaImageUrlFallback(wikipediaTitle)
}

async function getWikipediaImageUrlMain(wikipediaTitle) {
  const url = `http://fr.wikipedia.org/w/api.php?action=query&titles=${wikipediaTitle}&prop=pageimages&format=json&redirects=`
  console.log(`fetching ${url}...`)
  const response = await fetch(url);
  await sleep(1000); // to avoid getting banned from wikipedia api
  const parsed = JSON.parse(await response.text())
  const pages = Object.values(parsed.query.pages)
  if (pages.length == 0) {
    console.log(`no associated page for ${wikipediaTitle} : ${url}`)
    return null
  }
  if (!pages[0].pageimage) return null;
  return getWikimediaFileUrl(pages[0]);
}

async function getFallabackUrlPages(url) {
  console.log(`fetching ${url}...`)
  const response = await fetch(url);
  await sleep(1000); // to avoid getting banned from wikipedia api
  const parsed = JSON.parse(await response.text())
  let pages = Object.values(parsed?.query?.pages) || []
  if (parsed.continue?.gimcontinue) {
    pages = pages.concat(await getFallabackUrlPages(`${url}&gimcontinue=${parsed.continue.gimcontinue}`))
  }
  return pages
}

async function getWikipediaImageUrlFallback(wikipediaTitle) {
  const url = `https://fr.wikipedia.org/w/api.php?action=query&titles=${wikipediaTitle}&generator=images&prop=imageinfo&iiprop=url|timestamp&format=json&redirects=`
  let pages = (await getFallabackUrlPages(url))
    .filter(p => /logo/i.test(p.title))
    .filter(p => !/disambig/i.test(p.title))
  if (pages.length == 0) {
    console.log(`no associated image pages for ${wikipediaTitle} : ${url}`)
    return null
  }
  // .filter(([pageid, _page]) => Number(pageid) > 0)
  const page = pages.sort((a, b) =>
    new Date(b.imageinfo[0].timestamp) - new Date(a.imageinfo[0].timestamp)
  )[0]

  return page.imageinfo[0].url;
}

module.exports = {
  getWikipediaImageUrl,
  getWikimediaFileUrl,
  getWikimediaThumbUrl
}
