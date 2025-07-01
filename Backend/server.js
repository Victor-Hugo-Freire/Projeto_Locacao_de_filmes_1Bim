const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const csv = require("csv-parser");

const app = express();
const port = 3001;
const saltRounds = 12;

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

app.delete("/api/filmes", (req, res) => {
  const { movie_id } = req.body;
  const caminhoCSV = path.join(__dirname, "Dados", "movies.csv");

  const filmesRestantes = [];

  // Ler o CSV usando csv-parser
  fs.createReadStream(caminhoCSV)
    .pipe(csv())
    .on("data", (filme) => {
      if (filme.movie_id !== movie_id) {
        filmesRestantes.push(filme);
      }
    })
    .on("end", () => {
      if (filmesRestantes.length === 0) {
        // Se removeu todos, pode manter o cabeçalho só
        const cabecalho =
          "movie_id,movie_title,movie_description,price,image,category\n";
        fs.writeFile(caminhoCSV, cabecalho, (err) => {
          if (err) {
            console.error("Erro ao salvar CSV:", err);
            return res
              .status(500)
              .json({ erro: "Erro ao salvar base de filmes" });
          }
          return res.json({ sucesso: true });
        });
        return;
      }

      // Montar o CSV novamente, com cabeçalho e linhas dos filmes restantes
      const cabecalho = Object.keys(filmesRestantes[0]).join(",");
      const linhas = filmesRestantes.map((filme) => {
        return `"${filme.movie_id}","${filme.movie_title}","${filme.movie_description}","${filme.price}","${filme.image}","${filme.category}"`;
      });

      const novoCSV = cabecalho + "\n" + linhas.join("\n") + "\n";

      // Escrever o CSV atualizado
      fs.writeFile(caminhoCSV, novoCSV, (err) => {
        if (err) {
          console.error("Erro ao salvar CSV:", err);
          return res
            .status(500)
            .json({ erro: "Erro ao salvar base de filmes" });
        }
        res.json({ sucesso: true });
      });
    })
    .on("error", (err) => {
      console.error("Erro ao ler CSV:", err);
      res.status(500).json({ erro: "Erro ao acessar base de filmes" });
    });
});

app.post("/api/login", (req, res) => {
  const { username, senha } = req.body;

  lerUsuariosCSV((usuarios) => {
    const usuario = usuarios.find(
      (u) => u.user_email === username || u.username === username
    );

    if (!usuario) {
      return res.status(401).json({ erro: "Usuário não encontrado" });
    }

    bcrypt.compare(senha, usuario.user_password, (err, resultado) => {
      if (err) {
        console.error("Erro ao comparar senhas:", err);
        return res.status(500).json({ erro: "Erro no servidor" });
      }

      if (resultado) {
        // Senha correta
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
        // Senha incorreta
        res.status(401).json({ erro: "Senha incorreta" });
      }
    });
  });
});

app.post("/api/cadastrar", (req, res) => {
  const { username, user_email, user_password, user_role } = req.body;

  if (username.trim().length < 4) {
    return res
      .status(400)
      .json({ erro: "O nome de usuário deve ter mais de 4 caracteres" });
  }

  const caminho = path.join(__dirname, "Dados", "users.csv");

  try {
    const data = fs.readFileSync(caminho, "utf-8");
    const linhas = data.trim().split("\n").slice(1);

    const usuarios = linhas
      .map((linha) => {
        const partes = linha.match(/"([^"]*)"/g);
        if (partes && partes.length === 5) {
          return {
            user_id: partes[0].replace(/"/g, "").trim(),
            username: partes[1].replace(/"/g, "").trim(),
            password: partes[2].replace(/"/g, "").trim(),
            email: partes[3].replace(/"/g, "").trim(),
            role: partes[4].replace(/"/g, "").trim(),
          };
        }
        return null;
      })
      .filter(Boolean);

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

    bcrypt.hash(user_password, saltRounds, (err, hash) => {
      if (err) {
        console.error("Erro ao gerar hash:", err);
        return res.status(500).json({ erro: "Erro ao processar senha" });
      }

      const ultimosIds = usuarios
        .map((u) => parseInt(u.user_id.replace("U", "")))
        .filter((n) => !isNaN(n));
      const maiorId = ultimosIds.length ? Math.max(...ultimosIds) : 0;
      const user_id = `U${maiorId + 1}`;

      const novaLinhaBruta = `"${user_id}","${username}","${hash}","${user_email}","${user_role}"\n`;
      fs.appendFile(caminho, novaLinhaBruta, (err) => {
        if (err) {
          console.error("Erro ao salvar no CSV:", err);
          return res.status(500).json({ erro: "Erro ao cadastrar usuário" });
        }
        res.json({ sucesso: true });
      });
    });
  } catch (err) {
    console.error("Erro ao ler arquivo CSV:", err);
    return res.status(500).json({ erro: "Erro ao acessar base de usuários" });
  }
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

app.delete("/api/usuarios", (req, res) => {
  const { user_id } = req.body;
  const caminhoCSV = path.join(__dirname, "Dados", "users.csv");

  fs.readFile(caminhoCSV, "utf-8", (err, data) => {
    if (err) {
      console.error("Erro ao ler CSV:", err);
      return res.status(500).json({ erro: "Erro ao acessar base de usuários" });
    }

    const linhas = data.trim().split("\n");
    const cabecalho = linhas[0];
    const corpo = linhas.slice(1);

    const novaLista = corpo.filter((linha) => {
      const partes = linha.match(/"([^"]*)"/g);
      if (!partes) return true;
      const idAtual = partes[0].replace(/"/g, "").trim();
      return idAtual !== user_id;
    });

    const resultado = [cabecalho, ...novaLista].join("\n") + "\n";

    fs.writeFile(caminhoCSV, resultado, (err) => {
      if (err) {
        console.error("Erro ao salvar novo CSV:", err);
        return res.status(500).json({ erro: "Erro ao excluir usuário" });
      }
      res.json({ sucesso: true });
    });
  });
});

app.put("/api/editar-usuario", (req, res) => {
  const { usernameAntigo, novoNome, novoEmail, novoCargo } = req.body;
  const caminhoCSV = path.join(__dirname, "Dados", "users.csv");

  fs.readFile(caminhoCSV, "utf-8", (err, data) => {
    if (err) return res.status(500).json({ erro: "Erro ao acessar base" });

    const linhas = data.trim().split("\n");
    const cabecalho = linhas[0];
    const atualizadas = linhas.slice(1).map((linha) => {
      const partes = linha.match(/"([^"]*)"/g);
      if (!partes || partes.length !== 5) return linha;

      const nomeAtual = partes[1].replace(/"/g, ""); // username
      if (nomeAtual !== usernameAntigo) return linha;

      const user_id = partes[0];
      const senha = partes[2];
      return `${user_id},"${novoNome}",${senha},"${novoEmail}","${novoCargo}"`;
    });

    const final = [cabecalho, ...atualizadas].join("\n") + "\n";
    fs.writeFile(caminhoCSV, final, (err) => {
      if (err) return res.status(500).json({ erro: "Erro ao salvar edição" });
      res.json({ sucesso: true });
    });
  });
});

app.put("/api/promover", (req, res) => {
  const { username } = req.body;
  const caminhoCSV = path.join(__dirname, "Dados", "users.csv");

  fs.readFile(caminhoCSV, "utf-8", (err, data) => {
    if (err) return res.status(500).json({ erro: "Erro ao acessar base" });

    const linhas = data.trim().split("\n");
    const cabecalho = linhas[0];
    const atualizadas = linhas.slice(1).map((linha) => {
      const partes = linha.match(/"([^"]*)"/g);
      if (!partes || partes.length !== 5) return linha;

      const nomeAtual = partes[1].replace(/"/g, "");
      if (nomeAtual !== username) return linha;

      const user_id = partes[0];
      const senha = partes[2];
      const email = partes[3];
      return `${user_id},"${nomeAtual}",${senha},${email},"ADM"`;
    });

    const final = [cabecalho, ...atualizadas].join("\n") + "\n";
    fs.writeFile(caminhoCSV, final, (err) => {
      if (err) return res.status(500).json({ erro: "Erro ao salvar promoção" });
      res.json({ sucesso: true });
    });
  });
});

app.listen(port, () => {
  console.log(`✅ Servidor rodando em: http://localhost:${port}`);
});
