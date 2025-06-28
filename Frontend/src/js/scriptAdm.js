const tabelaFilmes = document.querySelector("#tabela-filmes tbody");
const tabelaUsuarios = document.querySelector("#tabela-usuarios tbody");
const secaoFilmes = document.getElementById("secao-filmes");
const secaoUsuarios = document.getElementById("secao-usuarios");
const radiosModo = document.querySelectorAll('input[name="modo"]');

// Alternar entre gerenciar filmes e usuários
radiosModo.forEach((radio) => {
  radio.addEventListener("change", () => {
    if (radio.value === "filmes") {
      secaoFilmes.style.display = "block";
      secaoUsuarios.style.display = "none";
    } else {
      secaoFilmes.style.display = "none";
      secaoUsuarios.style.display = "block";
    }
  });
});

// Buscar filmes do backend
function carregarFilmes() {
  fetch("http://localhost:3001/api/filmes")
    .then((res) => res.json())
    .then((filmes) => preencherTabelaFilmes(filmes))
    .catch((erro) => console.error("Erro ao carregar filmes:", erro));
}

function preencherTabelaFilmes(filmes) {
  tabelaFilmes.innerHTML = "";
  filmes.forEach((filme, index) => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${filme.movie_title}</td>
      <td>${filme.movie_description}</td>
      <td>R$${parseFloat(filme.price).toFixed(2)}</td>
      <td><img src="${filme.image}" alt="img" width="50" /></td>
      <td>${filme.category}</td>
      <td>
        <button onclick="editarFilme(${index})">Editar</button>
        <button onclick="excluirFilme(${index})">Excluir</button>
      </td>
    `;
    tabelaFilmes.appendChild(linha);
  });
}

// Buscar usuários do backend
function carregarUsuarios() {
  fetch("http://localhost:3001/api/usuarios")
    .then((res) => res.json())
    .then((usuarios) => preencherTabelaUsuarios(usuarios))
    .catch((erro) => console.error("Erro ao carregar usuários:", erro));
}

function preencherTabelaUsuarios(usuarios) {
  tabelaUsuarios.innerHTML = "";
  usuarios.forEach((usuario, index) => {
    if (usuario.user_role === "ADM") return;
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${usuario.username}</td>
      <td>${usuario.user_email}</td>
      <td>${usuario.user_role}</td>
      <td>
        <button onclick="promoverUsuario('${usuario.username}')">Promover</button>
        <button onclick="excluirUsuario('${usuario.username}')">Excluir</button>
      </td>
    `;
    tabelaUsuarios.appendChild(linha);
  });
}

// Mostrar nome do admin logado
fetch("http://localhost:3001/api/usuario-logado", {
  credentials: "include",
})
  .then((res) => res.json())
  .then((usuario) => {
    const nomeAdm = document.getElementById("nome-admin");
    if (usuario?.nome) {
      nomeAdm.textContent = `Logado como: ${usuario.nome}`;
    } else {
      nomeAdm.textContent = "Administrador não identificado.";
    }
  })
  .catch(() => {
    const nomeAdm = document.getElementById("nome-admin");
    nomeAdm.textContent = "Erro ao obter informações do usuário.";
  });

// Inicialização
window.addEventListener("DOMContentLoaded", () => {
  const modoSelecionado = document.querySelector(
    'input[name="modo"]:checked'
  ).value;

  if (modoSelecionado === "filmes") {
    secaoFilmes.style.display = "block";
    secaoUsuarios.style.display = "none";
  } else {
    secaoFilmes.style.display = "none";
    secaoUsuarios.style.display = "block";
  }

  carregarFilmes();
  carregarUsuarios();
});
