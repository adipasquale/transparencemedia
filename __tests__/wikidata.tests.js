const {
  getWikidataId,
  getWikimediaLogoFilename,
  getWikimediaFileUrl,
  getWikimediaThumbUrl
} = require("../lib/wikidata")

test("getWikidataId Arrêt_sur_images", async () => {
  const res = await getWikidataId("Arrêt_sur_images")
  expect(res).toEqual("Q703888")
})


// test("getWikimediaLogoFilename Arrets sur images => not found", async () => {
//   const res = await getWikimediaLogoFilename("Q703888")
//   expect(res).toEqual(null)
// })

// test("getWikimediaLogoFilename Challenges => found", async () => {
//   const res = await getWikimediaLogoFilename("Q2947983")
//   expect(res).toEqual("Challenges logo.svg")
// })

test("getWikimediaFileUrl challenges", () => {
  const res = getWikimediaFileUrl("Challenges logo.svg")
  expect(res).toEqual("https://upload.wikimedia.org/wikipedia/commons/6/67/Challenges_logo.svg")
})

test("getWikimediaThumbUrl challenges", () => {
  const res = getWikimediaThumbUrl("Challenges logo.svg")
  expect(res).toEqual("https://commons.wikimedia.org/w/thumb.php?width=500&f=Challenges_logo.svg")
})
