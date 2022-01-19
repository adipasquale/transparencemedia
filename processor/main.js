import { entites } from "./lib/entites.js"
import { generateAllActionnaireFinauxPieCharts } from "./lib/actionnaires.js"
import { generateAllDotFiles, convertDotChartsToSvg } from './lib/graphviz.js'
import {
  generateWikipediaDataFile,
  downloadAllWikipediaImages
} from "./lib/wikipediaScraper.js"

// console.log("generating wikipedia data file...")
await generateWikipediaDataFile(entites)

// console.log("downloading all wikipedia images...")
await downloadAllWikipediaImages()

console.log("generating all actionnaires finaux pie charts...")
await generateAllActionnaireFinauxPieCharts(entites)

// console.log("generating all actionnaires details dot files...")
generateAllDotFiles(entites)

// console.log("converting all actionnaires details dot files to SVGs...")
convertDotChartsToSvg()

console.log("processor done!")
