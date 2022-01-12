// const fetch = require('node-fetch');

// function dotChart(graph) {
//   const body = {
//     "graph": "digraph {a->b}",
//     "layout": "dot",
//     "format": "svg"
//   };

//   const response = await fetch('https://quickchart.io/graphviz', {
//     method: 'post',
//     body: JSON.stringify(body),
//     headers: { 'Content-Type': 'application/json' }
//   });

//   // Response contains an SVG. Write it to file or send it someplace else.
//   const svg = await response.text();
//   console.log(svg);
// }
