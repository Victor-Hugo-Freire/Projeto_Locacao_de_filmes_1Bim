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
  usuarios.forEach((usuario) => {
    const linha = document.createElement("tr");
    const isADM = usuario.user_role === "ADM";

    linha.innerHTML = `
      <td>${usuario.username}</td>
      <td>${usuario.user_email}</td>
      <td>${usuario.user_role}</td>
      <td style="font-size: 0.8em">${usuario.user_password}</td>
      <td>
        ${
          isADM
            ? `<span style="color: gray; font-size: 0.9em;">(ADM)</span>`
            : `
          <button onclick="promoverUsuario('${usuario.username}')">Promover</button>
          <button onclick="excluirUsuario('${usuario.username}')">Excluir</button>
        `
        }
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

// Formulário de adicionar usuário pelo ADM
document.getElementById("form-usuario").addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("nome-usuario").value.trim();
  const user_email = document.getElementById("email-usuario").value.trim();
  const user_password = document.getElementById("senha-usuario").value;
  const user_role = document.getElementById("cargo-usuario").value;

  fetch("http://localhost:3001/api/cadastrar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, user_email, user_password, user_role }),
  })
    .then((res) => {
      if (!res.ok) return res.json().then((e) => Promise.reject(e));
      return res.json();
    })
    .then((resposta) => {
      alert("Usuário adicionado com sucesso!");
      carregarUsuarios(); // Atualiza a tabela
      document.getElementById("form-usuario").reset();
    })
    .catch((erro) => {
      alert(erro.erro || "Erro ao adicionar usuário.");
    });
});

document.querySelectorAll(".toggle-senha").forEach((botao) => {
  botao.addEventListener("click", () => {
    const inputId = botao.dataset.input;
    const input = document.getElementById(inputId);

    if (input.type === "password") {
      input.type = "text";
      botao.textContent = "🙈";
    } else {
      input.type = "password";
      botao.textContent = "👁️";
    }
  });
});
