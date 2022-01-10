const { computeAllActionnairesFinaux } = require(`${__dirname}/../lib/actionnaires`)
const { unslugify } = require(`${__dirname}/../lib/helpers`)
const yaml = require('js-yaml');
const fs = require('fs');
const entites = yaml.load(fs.readFileSync(`${__dirname}/../_data/entites.yaml`, 'utf8'));
const QuickChart = require('quickchart-js');

// for (const [id, actionnairesFinaux] of Object.entries(computeAllActionnairesFinaux(entites))) {
//   if (!actionnairesFinaux) continue
//   const values = Object.values(actionnairesFinaux)
//   const labels = Object.keys(actionnairesFinaux).map(unslugify)
//   const rest = 100 - values.reduce((a, b) => a + b, 0);
//   if (rest > 0) {
//     values.push(rest)
//     labels.push("N/A")
//   }
//   const chart = new QuickChart();
//   const title = `${unslugify(id)} - Actionnaires finaux`
//   chart.setDevicePixelRatio(2.0)
//   chart.setConfig({
//     type: "pie",
//     data: { datasets: [{ data: values }], labels },
//     options: {
//       title: { display: true, text: title },
//       plugins: {
//         color: '#fff',
//         backgroundColor: '#404040',
//         datalabels: {
//           formatter: (value) => {
//             return value + '%';
//           }
//         }
//       }
//     }
//   })
//   chart.toFile(`${__dirname}/../charts/chart-actionnaires-finaux-${id}.png`);
// }

const fetch = require('node-fetch');

const body = {
  "graph": "digraph {a->b}",
  "layout": "dot",
  "format": "svg"
};

const response = await fetch('https://quickchart.io/graphviz', {
  method: 'post',
  body: JSON.stringify(body),
  headers: { 'Content-Type': 'application/json' }
});

// Response contains an SVG. Write it to file or send it someplace else.
const svg = await response.text();
console.log(svg);
