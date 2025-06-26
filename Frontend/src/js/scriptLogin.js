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
  const user_role = "user"; // padrão

  // Simulação: isso será enviado ao backend depois
  console.log("Novo cadastro:", {
    username,
    user_password,
    user_email,
    user_role,
  });

  alert("Cadastro realizado com sucesso!");
  window.location.href = "../../index.html";
});
