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

function carregarFilmes() {
  fetch("http://localhost:3001/api/filmes")
    .then((res) => res.json())
    .then((filmes) => preencherTabelaFilmes(filmes))
    .catch((erro) => console.error("Erro ao carregar filmes:", erro));
}

function preencherTabelaFilmes(filmes) {
  tabelaFilmes.innerHTML = "";
  filmes.forEach((filme) => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
  <td>${filme.movie_id}</td>
  <td>${filme.movie_title}</td>
  <td>${filme.movie_description}</td>
  <td>R$${parseFloat(filme.price).toFixed(2)}</td>
  <td><img src="${filme.image}" alt="img" width="50" /></td>
  <td>${filme.category}</td>
  <td>
    <button onclick="editarFilme('${filme.movie_id}')">Editar</button>
    <button onclick="excluirFilme('${filme.movie_id}')">Excluir</button>
  </td>
`;
    tabelaFilmes.appendChild(linha);
  });
}

function carregarUsuarios() {
  fetch("http://localhost:3001/api/usuarios")
    .then((res) => res.json())
    .then((usuarios) => preencherTabelaUsuarios(usuarios))
    .catch((erro) => console.error("Erro ao carregar usuários:", erro));
}

function preencherTabelaUsuarios(usuarios) {
  tabelaUsuarios.innerHTML = "";
  usuarios.forEach((usuario) => {
    const isADM = usuario.user_role === "ADM";
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${usuario.user_id}</td>
      <td>${usuario.username}</td>
      <td>${usuario.user_email}</td>
      <td>${usuario.user_role}</td>
      <td style="font-size: 0.8em">••••••••</td>
      <td>
        ${
          isADM
            ? `<span style="color: gray; font-size: 0.9em;">(ADM)</span>`
            : `
          <button onclick="editarUsuario('${usuario.username}', '${usuario.user_email}', '${usuario.user_role}')">Editar</button>
          <button onclick="promoverUsuario('${usuario.username}')">Promover</button>
          <button onclick="excluirUsuario('${usuario.user_id}')">Excluir</button>`
        }
      </td>
    `;
    tabelaUsuarios.appendChild(linha);
  });
}

function excluirUsuario(user_id) {
  if (!confirm(`Tem certeza que deseja excluir o usuário de ID "${user_id}"?`))
    return;

  fetch("http://localhost:3001/api/usuarios", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Erro ao excluir usuário");
      return res.json();
    })
    .then(() => {
      alert("Usuário excluído com sucesso!");
      carregarUsuarios();
    })
    .catch((erro) => {
      console.error(erro);
      alert("Erro ao excluir o usuário.");
    });
}

function promoverUsuario(username) {
  if (!confirm(`Deseja promover o usuário '${username}' a administrador?`))
    return;

  fetch("http://localhost:3001/api/promover", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Erro ao promover usuário");
      return res.json();
    })
    .then(() => {
      alert("Usuário promovido a administrador!");
      carregarUsuarios();
    })
    .catch((erro) => {
      console.error(erro);
      alert("Erro ao promover o usuário.");
    });
}

function editarUsuario(username, email, role) {
  const novoNome = prompt(`Novo nome de usuário para ${username}:`, username);
  if (!novoNome || novoNome.length < 4) {
    alert("Nome de usuário inválido.");
    return;
  }

  const novoEmail = prompt(`Novo email para ${username}:`, email);
  if (!novoEmail || !novoEmail.endsWith("@gmail.com")) {
    alert("Email inválido ou operação cancelada.");
    return;
  }

  const novoCargo = prompt(`Novo cargo para ${username} (user ou ADM):`, role);
  if (novoCargo !== "user" && novoCargo !== "ADM") {
    alert("Cargo inválido ou operação cancelada.");
    return;
  }

  fetch("http://localhost:3001/api/editar-usuario", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      usernameAntigo: username,
      novoNome,
      novoEmail,
      novoCargo,
    }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Erro ao editar usuário");
      return res.json();
    })
    .then(() => {
      alert("Usuário atualizado com sucesso!");
      carregarUsuarios();
    })
    .catch((erro) => {
      console.error(erro);
      alert("Erro ao atualizar o usuário.");
    });
}

function excluirFilme(movie_id) {
  if (!confirm("Tem certeza que deseja excluir este filme?")) return;

  fetch("http://localhost:3001/api/filmes", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ movie_id }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Erro ao excluir filme");
      return res.json();
    })
    .then(() => {
      alert("Filme excluído com sucesso!");
      carregarFilmes();
    })
    .catch((erro) => {
      console.error(erro);
      alert("Erro ao excluir o filme.");
    });
}

// Adicionar usuário (ADM)
document.getElementById("form-usuario").addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("nome-usuario").value.trim();
  const user_email = document.getElementById("email-usuario").value.trim();
  const user_password = document.getElementById("senha-usuario").value;
  const user_role = document.getElementById("cargo-usuario").value;

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

  fetch("http://localhost:3001/api/cadastrar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, user_email, user_password, user_role }),
  })
    .then((res) => {
      if (!res.ok) return res.json().then((e) => Promise.reject(e));
      return res.json();
    })
    .then(() => {
      alert("Usuário adicionado com sucesso!");
      carregarUsuarios();
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
