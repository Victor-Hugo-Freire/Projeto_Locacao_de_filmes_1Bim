const params = new URLSearchParams(window.location.search);
const modo = params.get("modo");

const formLogin = document.getElementById("form-login");
const formCadastro = document.getElementById("form-cadastro");
const titulo = document.getElementById("titulo-pagina");

// Mostrar formulário conforme o modo
if (modo === "entrar") {
  formLogin.style.display = "block";
  titulo.textContent = "Faça login";
} else if (modo === "cadastrar") {
  formCadastro.style.display = "block";
  titulo.textContent = "Crie sua conta";
} else {
  titulo.textContent = "Modo inválido!";
}

document.querySelectorAll(".toggle-senha").forEach((botao) => {
  botao.addEventListener("click", () => {
    const inputId = botao.dataset.input;
    const input = document.getElementById(inputId);

    if (input.type === "password") {
      input.type = "text";
      botao.textContent = "🙈"; // ou use outro ícone
    } else {
      input.type = "password";
      botao.textContent = "👁️";
    }
  });
});

formLogin.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("login-username").value;
  const senha = document.getElementById("login-password").value;

  fetch("http://localhost:3001/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // Importante para cookies
    body: JSON.stringify({ username, senha }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Falha no login");
      return res.json();
    })
    .then(() => {
      // Buscar usuário logado após login
      return fetch("http://localhost:3001/api/usuario-logado", {
        credentials: "include",
      });
    })
    .then((res) => res.json())
    .then((usuario) => {
      if (usuario.cargo === "ADM") {
        window.location.href = "./adm.html";
      } else {
        window.location.href = "../../index.html";
      }
    })
    .catch((err) => alert("Erro no login: " + err.message));
});

formCadastro?.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("cad-username").value.trim();
  const user_email = document.getElementById("cad-email").value.trim();
  const user_password = document.getElementById("cad-password").value.trim();
  const user_role = "user";

  if (username.length < 4) {
    alert("O nome de usuário deve ter mais de 4 caracteres");
    return;
  }

  if (!user_email.endsWith("@gmail.com")) {
    alert("O e-mail precisa ser do tipo @gmail.com");
    return;
  }

  if (user_password.length < 7) {
    alert("A senha precisa ter pelo menos 7 caracteres");
    return;
  }

  // Envia requisição se passou nas validações
  fetch("http://localhost:3001/api/cadastrar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, user_email, user_password, user_role }),
  })
    .then((res) => {
      if (!res.ok) throw res;
      return res.json();
    })
    .then(() => {
      alert("Cadastro realizado com sucesso!");
      window.location.href = "login.html?modo=entrar";
    })
    .catch((err) => {
      err.text().then((texto) => {
        try {
          const resposta = JSON.parse(texto);
          alert(resposta.erro || "Erro no cadastro");
        } catch {
          alert("Erro no cadastro");
        }
      });
    });
});
