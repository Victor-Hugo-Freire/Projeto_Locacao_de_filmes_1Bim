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
  const { username, senha } = req.body;

  lerUsuariosCSV((usuarios) => {
    const usuario = usuarios.find(
      (u) =>
        (u.user_email === username || u.username === username) &&
        u.user_password === senha // <- Aqui está o fix
    );

    if (usuario) {
      res.cookie(
        "usuario",
        {
          nome: usuario.username,
          email: usuario.user_email,
          cargo: usuario.user_role,
        },
        { httpOnly: false, sameSite: "Lax" }
      );

      res.json({ sucesso: true });
    } else {
      res.status(401).json({ erro: "Credenciais inválidas" });
    }
  });
});

const fs = require("fs");

app.post("/api/cadastrar", (req, res) => {
  const { username, user_email, user_password, user_role } = req.body;
  const caminho = path.join(__dirname, "Dados", "users.csv");

  fs.readFile(caminho, "utf-8", (err, data) => {
    if (err) {
      console.error("Erro ao ler o arquivo CSV:", err);
      return res.status(500).json({ erro: "Erro ao acessar base de usuários" });
    }

    const linhas = data.trim().split("\n").slice(1); // ignora cabeçalho

    const usuarios = linhas
      .map((linha) => {
        const partes = linha.match(/"([^"]*)"/g);
        if (partes && partes.length === 4) {
          return {
            username: partes[0].replace(/"/g, "").trim(),
            password: partes[1].replace(/"/g, "").trim(),
            email: partes[2].replace(/"/g, "").trim(),
            role: partes[3].replace(/"/g, "").trim(),
          };
        }
        return null;
      })
      .filter(Boolean); // remove nulls (linhas inválidas ou em branco)

    const nomeJaExiste = usuarios.some(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    );
    const emailJaExiste = usuarios.some(
      (u) => u.email.toLowerCase() === user_email.toLowerCase()
    );

    if (nomeJaExiste && emailJaExiste) {
      return res
        .status(400)
        .json({ erro: "Nome de usuário e e-mail já cadastrados" });
    } else if (nomeJaExiste) {
      return res.status(400).json({ erro: "Nome de usuário já em uso" });
    } else if (emailJaExiste) {
      return res.status(400).json({ erro: "E-mail já cadastrado" });
    }

    const novaLinha = `"${username}","${user_password}","${user_email}","${user_role}"\n`;
    fs.appendFile(caminho, novaLinha, (err) => {
      if (err) {
        console.error("Erro ao salvar no CSV:", err);
        return res.status(500).json({ erro: "Erro ao cadastrar usuário" });
      }
      res.json({ sucesso: true });
    });
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
