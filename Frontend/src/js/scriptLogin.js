const params = new URLSearchParams(window.location.search);
const modo = params.get("modo");

const formLogin = document.getElementById("form-login");
const formCadastro = document.getElementById("form-cadastro");
const titulo = document.getElementById("titulo-pagina");

// Mostra o formulário de acordo com o modo
if (modo === "entrar") {
  formLogin.style.display = "block";
  titulo.textContent = "Faça login";
} else if (modo === "cadastrar") {
  formCadastro.style.display = "block";
  titulo.textContent = "Crie sua conta";
} else {
  titulo.textContent = "Modo inválido!";
}

// Evento de login
formLogin?.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email-login").value.trim();
  const senha = document.getElementById("senha-login").value.trim();

  if (email === "teste@email.com" && senha === "1234") {
    localStorage.setItem("usuarioLogado", "true");
    alert("Login realizado com sucesso!");
    window.location.href = "../../index.html";
  } else {
    alert("Email ou senha incorretos!");
  }
});

formCadastro?.addEventListener("submit", (e) => {
  e.preventDefault();
  const nome = document.getElementById("nome-cadastro").value.trim();
  const email = document.getElementById("email-cadastro").value.trim();
  const senha = document.getElementById("senha-cadastro").value.trim();

  console.log("Usuário cadastrado:", { nome, email, senha });
  alert("Cadastro realizado com sucesso!");
  window.location.href = "../../index.html";
});
