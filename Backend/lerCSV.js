const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

function lerFilmesCSV(callback) {
  const resultados = [];
  const caminho = path.join(__dirname, "./Dados", "movies.csv");

  fs.createReadStream(caminho)
    .pipe(csv())
    .on("data", (linha) => resultados.push(linha))
    .on("end", () => callback(resultados));
}

module.exports = lerFilmesCSV;
