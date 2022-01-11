const {
  getWikipediaImageUrl,
  getWikimediaFileUrl,
  getWikimediaThumbUrl
} = require("../lib/wikipedia")

test("getWikipediaImageUrl Arrêt_sur_images", async () => {
  const res = await getWikipediaImageUrl("Arrêt_sur_images")
  expect(res).toEqual("https://upload.wikimedia.org/wikipedia/fr/0/0f/LOGO_@SI_FINAL.svg")
})

test("getWikipediaImageUrl Atlantico", async () => {
  const res = await getWikipediaImageUrl("Atlantico")
  expect(res).toEqual("https://upload.wikimedia.org/wikipedia/fr/0/08/Atlantico_2010_logo.png")
})

test("getWikipediaImageUrl Télérama", async () => {
  const res = await getWikipediaImageUrl("Télérama")
  expect(res).toEqual("https://upload.wikimedia.org/wikipedia/commons/b/b1/Télérama_logo.png")
})

test("getWikipediaImageUrl 20_minutes_(France)", async () => {
  const res = await getWikipediaImageUrl("20_minutes_(France)")
  expect(res).toEqual("https://upload.wikimedia.org/wikipedia/commons/2/2c/20_Minutes_logo.svg")
})

test("getWikipediaImageUrl Le_Parisien (gimcontinue + logo)", async () => {
  const res = await getWikipediaImageUrl("Le_Parisien")
  expect(res).toEqual("https://upload.wikimedia.org/wikipedia/commons/2/27/Le_Parisien_logo.svg")
})




test("getWikimediaFileUrl challenges", () => {
  const res = getWikimediaFileUrl({
    pageimage: "Challenges logo.svg",
    thumbnail: {
      source: "https://upload.wikimedia.org/wikipedia/fr/thumb/6/67/Challenges_logo.svg/50px-Challenges_logo.svg"
    }
  })
  expect(res).toEqual("https://upload.wikimedia.org/wikipedia/fr/6/67/Challenges_logo.svg")
})

test("getWikimediaThumbUrl challenges", () => {
  const res = getWikimediaThumbUrl("Challenges logo.svg")
  expect(res).toEqual("https://commons.wikimedia.org/w/thumb.php?width=500&f=Challenges_logo.svg")
})
