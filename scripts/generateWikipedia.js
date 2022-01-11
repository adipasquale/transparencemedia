const fs = require('fs');
const {
  getWikipediaImageUrl
} = require("../lib/wikipedia")

const { entites } = require(`${__dirname}/../lib/entites`)

const PATH = `${__dirname}/../_data/wikipedia.json`

function readData() {
  return JSON.parse(fs.readFileSync(PATH))
}

async function updateData(entiteData) {
  const updatedData = { ...readData(), ...entiteData }
  await fs.writeFileSync(PATH, JSON.stringify(updatedData, null, 2))
}

(async function () {
  const currentData = readData();
  for (const entite of entites) {
    let data = {}
    if (currentData[entite.id]?.manualOverride) continue
    if (!entite.journal) continue
    const imageUrl = await getWikipediaImageUrl(entite.wikipediaTitleSlug)
    data = { imageUrl, imageFilename: imageUrl?.split("/")?.pop() }
    await updateData({ [entite.id]: data })
  }
})()
