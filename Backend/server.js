const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();
const port = 3001;

app.use(express.json());
app.use(cookieParser());

// Middleware CORS simplificado
app.use((req, res, next) => {
  const allowedOrigins = ["http://127.0.0.1:5500", "http://localhost:3000"];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// Caminho absoluto para a pasta do frontend
const frontendPath = path.join(__dirname, "../Frontend");

// Servir arquivos estáticos (HTML, CSS, JS, imagens)
app.use(express.static(frontendPath));

// Rota padrão para abrir index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.listen(port, () => {
  console.log(`✅ Servidor rodando em: http://localhost:${port}`);
});
