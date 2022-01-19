import { edgesToDotFile, getActionnairesGraphEdges } from "../lib/graphviz.js"

test("getActionnairesGraphEdges 1", () => {
  const res = getActionnairesGraphEdges(
    {
      "20_minutes": {
        id: "20_minutes",
        actionnaires: [
          { id: "ouest_france", part: 50 },
          { id: "la_voix", part: 49.3 }
        ]
      },
      "la_voix": {
        id: "la_voix",
        actionnaires: [
          { id: "rossel", part: 73 },
          { id: "credit_agricole", part: 25 }
        ]
      },
      "rossel": {
        id: "rossel",
        actionnaires: [
          { id: "famille_hurbain", part: 83 },
          { id: "credit_agricole", part: 25 }
        ]
      },
    },
    "20_minutes"
  )
  const simplifiedRes = res.map(([from, to, part]) => [from.id, to.id, part])
  expect(simplifiedRes).toEqual([
    ["ouest_france", "20_minutes", 50],
    ["la_voix", "20_minutes", 49.3],
    ["rossel", "la_voix", 73],
    ["famille_hurbain", "rossel", 83],
    ["credit_agricole", "rossel", 25],
    ["credit_agricole", "la_voix", 25],
  ])
})


test("edgesToDotFile 1", () => {
  expect(
    edgesToDotFile(
      [
        [{ nom: "ouest_france" }, { nom: "20_minutes" }, 50],
        [{ nom: "la_voix" }, { nom: "20_minutes" }, 49.3],
        [{ nom: "rossel" }, { nom: "la_voix" }, 73],
        [{ nom: "famille_hurbain" }, { nom: "rossel" }, 83],
        [{ nom: "credit_agricole" }, { nom: "rossel" }, 25],
        [{ nom: "credit_agricole" }, { nom: "la_voix" }, 25],
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
