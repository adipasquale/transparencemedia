const { reformatActionnaires, fillMissingParts, computeActionnairesFinaux } = require("../lib/actionnaires")

test("reformatActionnaires 1", () => {
  expect(
    reformatActionnaires(
      [
        {
          id: "w:Challenges",
          actionnariat:
            [{ id: "w:Groupe_Perdriel", part: 100 }]
        },
        {
          id: "w:Le_Monde",
          actionnariat:
            [{ id: "lml", part: 64 }, { id: "lmpa", part: 64 }]
        },
      ]
    )
  ).toEqual(
    {
      "w:Challenges": { "w:Groupe_Perdriel": 100 },
      "w:Le_Monde": { "lml": 64, "lmpa": 64 }
    }
  )
})

test("reformatActionnaires with missing parts", () => {
  expect(
    reformatActionnaires(
      [
        {
          id: "lml",
          actionnariat:
            [
              { id: "w:Pierre_Bergé" },
              { id: "w:Matthieu_Pigasse" },
              { id: "w:Xavier_Niel" },
              { id: "w:Prisa", part: 23 }
            ]
        },
      ]
    )
  ).toEqual({
    lml: {
      "w:Pierre_Bergé": undefined,
      "w:Matthieu_Pigasse": undefined,
      "w:Xavier_Niel": undefined,
      "w:Prisa": 23
    }
  })
})

test("reformatActionnaires with actionnaires field", () => {
  expect(
    reformatActionnaires(
      [
        {
          id: "Le Monde",
          actionnariat: {
            source: "some website",
            actionnaires: [
              { id: "w:Pierre_Bergé", part: 20 },
              { id: "w:Matthieu_Pigasse", part: 30 },
            ]
          }
        },
      ]
    )
  ).toEqual({
    "Le Monde": {
      "w:Pierre_Bergé": 20,
      "w:Matthieu_Pigasse": 30,
    }
  })
})

test("fillMissingParts undefined ones", () => {
  expect(
    fillMissingParts({
      "w:Pierre_Bergé": undefined,
      "w:Matthieu_Pigasse": undefined,
      "w:Xavier_Niel": undefined,
      "w:Prisa": 23
    }
    )).toEqual({
      "w:Pierre_Bergé": 26,  // (1 - .23) / 3
      "w:Matthieu_Pigasse": 26,
      "w:Xavier_Niel": 26,
      "w:Prisa": 23
    })
})

test("fillMissingParts do nothing", () => {
  expect(fillMissingParts({ "w:Pierre_Bergé": 10, "w:Prisa": 23 }))
    .toEqual({ "w:Pierre_Bergé": 10, "w:Prisa": 23 })
})

expect(fillMissingParts({ "w:Pierre_Bergé": undefined, "w:Prisa": undefined }))
  .toEqual({ "w:Pierre_Bergé": 50, "w:Prisa": 50 })

test("fillMissingParts evals", () => {
  expect(
    fillMissingParts({
      "w:Pierre_Bergé": "11.3 * 2",
      "w:Prisa": 23
    }
    )).toEqual({
      "w:Pierre_Bergé": 22.6,
      "w:Prisa": 23
    })
})

test("computeActionnairesFinaux 1", () => {
  const res = computeActionnairesFinaux(
    {
      "20_minutes": {
        ouest_france: 50,
        la_voix: 49.3
      },
      la_voix: {
        rossel: 73,
        credit_agricole: 25
      },
      rossel: {
        "w:famille_hurbain": 83,
        credit_agricole: 25
      },
    },
    "20_minutes"
  )
  expect(Object.keys(res)).toEqual(["ouest_france", "w:famille_hurbain", "credit_agricole"])
  expect(res["ouest_france"]).toEqual(50)
  expect(res["w:famille_hurbain"]).toEqual(30)
  expect(res["credit_agricole"]).toEqual(21)
})
