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

// === LOGIN ===
formLogin?.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("login-username").value.trim();
  const user_password = document.getElementById("login-password").value.trim();

  if (
    (username === "vhfr" && user_password === "userVH456") ||
    (username === "VH" && user_password === "superUserVH456")
  ) {
    localStorage.setItem("usuarioLogado", username);
    alert("Login realizado com sucesso!");
    window.location.href = "../../index.html";
  } else {
    alert("Usuário ou senha inválidos!");
  }
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
