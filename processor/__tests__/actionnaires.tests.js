import {
  convertEntitesToEntitesMap,
  prepareActionnairesList,
  computeActionnairesFinaux
} from "../lib/actionnaires.js"

test("convertEntitesToEntitesMap 1", () => {
  expect(
    convertEntitesToEntitesMap(
      [
        {
          id: "w:Challenges",
          actionnaires:
            [{ id: "w:Groupe_Perdriel", part: 100 }]
        },
        {
          id: "w:Le_Monde",
          actionnaires:
            [{ id: "lml", part: 64 }, { id: "lmpa", part: 64 }]
        },
      ]
    )
  ).toEqual(
    {
      "w:Challenges": {
        id: "w:Challenges",
        actionnaires:
          [{ id: "w:Groupe_Perdriel", part: 100 }]
      },
      "w:Le_Monde": {
        id: "w:Le_Monde",
        actionnaires:
          [{ id: "lml", part: 64 }, { id: "lmpa", part: 64 }]
      }
    }
  )
})

test("prepareActionnairesList undefined ones", () => {
  expect(
    prepareActionnairesList([
      { id: "w:Pierre_Bergé" },
      { id: "w:Matthieu_Pigasse" },
      { id: "w:Xavier_Niel" },
      { id: "w:Prisa", part: 23 }
    ])
  ).toEqual([
    { id: "w:Pierre_Bergé", part: 26 },  // (1 - .23) / 3
    { id: "w:Matthieu_Pigasse", part: 26 },
    { id: "w:Xavier_Niel", part: 26 },
    { id: "w:Prisa", part: 23 }
  ])
})

test("prepareActionnairesList do nothing", () => {
  expect(prepareActionnairesList([
    { id: "w:Pierre_Bergé", part: 10 },
    { id: "w:Prisa", part: 23 }
  ])).toEqual([
    { id: "w:Pierre_Bergé", part: 10 },
    { id: "w:Prisa", part: 23 }
  ])
})

test("prepareActionnairesList all equal", () => {
  expect(
    prepareActionnairesList([
      { id: "w:Pierre_Bergé" }, { id: "w:Prisa" }
    ])
  ).toEqual(
    [{ id: "w:Pierre_Bergé", part: 50 }, { id: "w:Prisa", part: 50 }]
  )
})

test("prepareActionnairesList evals", () => {
  expect(
    prepareActionnairesList([
      { id: "w:Pierre_Bergé", part: "11.3 * 2" },
      { id: "w:Prisa", part: 23 }
    ])
  ).toEqual([
    { id: "w:Pierre_Bergé", part: 22.6 },
    { id: "w:Prisa", part: 23 }
  ])
})

test("computeActionnairesFinaux 1", () => {
  const res = computeActionnairesFinaux(
    {
      "20_minutes": {
        actionnaires: [
          { id: "ouest_france", part: 50 },
          { id: "la_voix", part: 49.3 }
        ]
      },
      "la_voix": {
        actionnaires: [
          { id: "rossel", part: 73, },
          { id: "credit_agricole", part: 25 }
        ]
      },
      "rossel": {
        actionnaires: [
          { id: "w:famille_hurbain", part: 83 },
          { id: "credit_agricole", part: 25 }
        ]
      },
      "credit_agricole": {
        id: "credit_agricole",
        devise: "on aime l'agriculutre"
      }
    },
    "20_minutes"
  )
  expect(res).toEqual({
    "ouest_france": { id: "ouest_france", part: 50 },
    "w:famille_hurbain": { id: "w:famille_hurbain", part: 30 },
    "credit_agricole": { id: "credit_agricole", devise: "on aime l'agriculutre", part: 21 },
  })
})
