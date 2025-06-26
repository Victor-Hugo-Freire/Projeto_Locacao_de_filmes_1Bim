const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

function lerUsuariosCSV(callback) {
  const resultados = [];
  const caminho = path.join(__dirname, "./Dados", "users.csv");

  fs.createReadStream(caminho)
    .pipe(csv({ trim: true }))
    .on("data", (linha) => resultados.push(linha))
    .on("end", () => callback(resultados));
}

module.exports = lerUsuariosCSV;
