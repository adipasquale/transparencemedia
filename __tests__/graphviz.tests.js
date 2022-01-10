const { dotLinesToFile, actionnairesToDotLines } = require("../lib/graphviz")

test("actionnairesToDotLines 1", () => {
  const res = actionnairesToDotLines(
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
        famille_hurbain: 83,
        credit_agricole: 25
      },
    },
    "20_minutes"
  )
  expect(res).toEqual([
    ["ouest_france", "20_minutes", 50],
    ["la_voix", "20_minutes", 49.3],
    ["rossel", "la_voix", 73],
    ["famille_hurbain", "rossel", 83],
    ["credit_agricole", "rossel", 25],
    ["credit_agricole", "la_voix", 25],
  ])
})


test("dotLinesToFile 1", () => {
  expect(
    dotLinesToFile(
      [
        ["ouest_france", "20_minutes", 50],
        ["la_voix", "20_minutes", 49.3],
        ["rossel", "la_voix", 73],
        ["famille_hurbain", "rossel", 83],
        ["credit_agricole", "rossel", 25],
        ["credit_agricole", "la_voix", 25],
      ]
    )
  ).toEqual(
    `digraph G {
  "ouest_france" -> "20_minutes" [label="50%"];
  "la_voix" -> "20_minutes" [label="49%"];
  "rossel" -> "la_voix" [label="73%"];
  "famille_hurbain" -> "rossel" [label="83%"];
  "credit_agricole" -> "rossel" [label="25%"];
  "credit_agricole" -> "la_voix" [label="25%"];
}`
  )
})
