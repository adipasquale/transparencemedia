const fs = require('fs');
const {
  getWikidataId,
  getWikimediaThumbUrl,
  getWikimediaFileUrl,
  getWikimediaLogoFilename,
} = require("../lib/wikidata")

const entites = require(`${__dirname}/../lib/entites`)

async function updateData(entiteData) {
  const path = `${__dirname}/../_data/wikidata.json`
  const currentData = JSON.parse(fs.readFileSync(path))
  const updatedData = { ...currentData, ...entiteData }
  await fs.writeFileSync(path, JSON.stringify(updatedData, null, 2))
}

(async function () {
  for (const entite of entites) {
    let data = {}
    if (!entite.journal) continue
    const wikidataId = await getWikidataId(entite.wikipediaTitleSlug)
    if (!wikidataId) continue
    data = { wikidataId }
    await updateData({ [entite.slug]: data })
    const filename = await getWikimediaLogoFilename(wikidataId)
    if (!filename) continue
    data["imageFilename"] = filename
    data["imageUrl"] = getWikimediaFileUrl(filename)
    data["thumbUrl"] = getWikimediaThumbUrl(filename)
    await updateData({ [entite.slug]: data })
  }
})()
