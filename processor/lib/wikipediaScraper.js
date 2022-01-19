import fs from 'fs'
import fetch from 'node-fetch'

import { getWikipediaImageUrl } from "./wikipedia.js"
import rootPath from "./rootPath.js"


// TODO: write to www/ MD files rather than this big json
// const PATH = `${rootPath}/data/wikipedia.json`

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// function readDataFile() {
//   return JSON.parse(fs.readFileSync(PATH))
// }

// async function updateDataFile(entiteData) {
//   const updatedData = { ...readDataFile(), ...entiteData }
//   await fs.writeFileSync(PATH, JSON.stringify(updatedData, null, 2))
// }

async function generateWikipediaDataFile(entites) {
  const currentData = readDataFile();
  for (const entite of entites) {
    let data = {}
    if (currentData[entite.id]?.manualOverride) continue
    if (!entite.journal) continue
    const title = entite.id.replace(/^w:/, "")
    const imageUrl = await getWikipediaImageUrl(title)
    data = {
      title,
      imageUrl,
      imageFilename: imageUrl?.split("/")?.pop()
    }
    await updateDataFile({ [entite.id]: data })
  }
}

async function downloadAllWikipediaImages() {
  for (const data of Object.values(readDataFile())) {
    if (!data.imageFilename) continue
    const path = `${rootPath}/images/logos/${data.imageFilename}`
    console.log(`downloading ${path}...`)
    const response = await fetch(data.imageUrl);
    await sleep(2000)
    const buffer = await response.buffer();
    await fs.writeFileSync(path, buffer);
  }
}

export { generateWikipediaDataFile, downloadAllWikipediaImages, readDataFile }
