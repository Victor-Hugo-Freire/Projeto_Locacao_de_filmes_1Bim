const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();
const port = 3001;

app.use(express.json());
app.use(cookieParser());

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

const frontendPath = path.join(__dirname, "../Frontend");
app.use(express.static(frontendPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

const lerFilmesCSV = require("./lerFilmesCSV");
const lerUsuariosCSV = require("./lerUsuariosCSV");

app.get("/api/filmes", (req, res) => {
  lerFilmesCSV((filmes) => {
    res.json(filmes);
  });
});

app.post("/api/login", (req, res) => {
  const { email, senha } = req.body;

  lerUsuariosCSV((usuarios) => {
    const usuario = usuarios.find(
      (u) => u.user_email === email && u.password === senha
    );

    if (usuario) {
      // Define cookie com nome e tipo
      res.cookie(
        "usuario",
        {
          nome: usuario.username,
          email: usuario.user_email,
          cargo: usuario.user_role,
        },
        { httpOnly: false, sameSite: "Lax" }
      ); // httpOnly: false para JS poder ler

      res.json({ sucesso: true });
    } else {
      res.status(401).json({ erro: "Credenciais inválidas" });
    }
  });
});

app.get("/api/usuario-logado", (req, res) => {
  if (req.cookies.usuario) {
    res.json(req.cookies.usuario);
  } else {
    res.status(401).json({ erro: "Não autenticado" });
  }
});

app.post("/api/logout", (req, res) => {
  res.clearCookie("usuario");
  res.json({ sucesso: true });
});

app.get("/api/usuarios", (req, res) => {
  lerUsuariosCSV((usuarios) => {
    res.json(usuarios);
  });
});

app.listen(port, () => {
  console.log(`✅ Servidor rodando em: http://localhost:${port}`);
});
