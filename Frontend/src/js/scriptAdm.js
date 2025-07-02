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

function editarFilme(movie_id) {
  fetch("http://localhost:3001/api/filmes")
    .then((res) => res.json())
    .then((filmes) => {
      const filme = filmes.find((f) => f.movie_id === movie_id);
      if (!filme) return alert("Filme não encontrado!");

      const novoTitulo = prompt("Novo título:", filme.movie_title);
      if (!novoTitulo) return;

      const novaDescricao = prompt("Nova descrição:", filme.movie_description);
      if (!novaDescricao) return;

      const novoPreco = prompt("Novo preço:", filme.price);
      if (!novoPreco || isNaN(parseFloat(novoPreco))) {
        alert("Preço inválido.");
        return;
      }

      const novaCategoria = prompt("Nova categoria:", filme.category);
      if (!novaCategoria) return;

      if (confirm("Deseja trocar a imagem do filme?")) {
        // Criar input imediatamente dentro do evento do clique
        const inputImagem = document.createElement("input");
        inputImagem.type = "file";
        inputImagem.accept = "image/*";
        inputImagem.style.display = "none";

        document.body.appendChild(inputImagem);

        inputImagem.addEventListener("change", () => {
          if (inputImagem.files.length === 0) return;

          const formData = new FormData();
          formData.append("movie_id", movie_id);
          formData.append("movie_title", novoTitulo);
          formData.append("movie_description", novaDescricao);
          formData.append("price", parseFloat(novoPreco).toFixed(2));
          formData.append("category", novaCategoria);
          formData.append("nomeImagemAntiga", filme.image);
          formData.append("imagem", inputImagem.files[0]);

          fetch("http://localhost:3001/api/editar-filme", {
            method: "PUT",
            body: formData,
          })
            .then((res) => {
              if (!res.ok) throw new Error("Erro ao editar filme");
              return res.json();
            })
            .then(() => {
              alert("Filme atualizado com nova imagem!");
              carregarFilmes();
            })
            .catch((err) => {
              console.error(err);
              alert("Erro ao atualizar filme com nova imagem.");
            });
        });

        // ABRE o seletor de imagem imediatamente no clique do usuário
        inputImagem.click();
      } else {
        // Editar sem trocar imagem
        fetch("http://localhost:3001/api/editar-filme", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            movie_id,
            movie_title: novoTitulo,
            movie_description: novaDescricao,
            price: parseFloat(novoPreco).toFixed(2),
            category: novaCategoria,
          }),
        })
          .then((res) => {
            if (!res.ok) throw new Error("Erro ao editar filme");
            return res.json();
          })
          .then(() => {
            alert("Filme atualizado com sucesso!");
            carregarFilmes();
          })
          .catch((err) => {
            console.error(err);
            alert("Erro ao atualizar filme.");
          });
      }
    });
}

document.getElementById("form-filme").addEventListener("submit", (e) => {
  e.preventDefault();

  const titulo = document.getElementById("titulo-filme").value.trim();
  const descricao = document.getElementById("descricao-filme").value.trim();
  const preco = document.getElementById("preco-filme").value;
  const imagemInput = document.getElementById("imagem-filme");
  const categoria = document.getElementById("categoria-filme").value;

  if (titulo.length === 0) {
    alert("O título do filme é obrigatório.");
    return;
  }

  if (descricao.length < 20) {
    alert("A descrição deve ter no mínimo 20 caracteres.");
    return;
  }

  if (preco === "" || isNaN(parseFloat(preco))) {
    alert("Informe um preço válido.");
    return;
  }

  if (imagemInput.files.length === 0) {
    alert("Selecione uma imagem para o filme.");
    return;
  }

  if (!categoria) {
    alert("Selecione uma categoria.");
    return;
  }

  // Criar FormData para enviar imagem + dados
  const formData = new FormData();
  formData.append("movie_title", titulo);
  formData.append("movie_description", descricao);
  formData.append("price", parseFloat(preco).toFixed(2));
  formData.append("category", categoria);
  formData.append("imagem", imagemInput.files[0]);

  fetch("http://localhost:3001/api/novo-filme", {
    method: "POST",
    body: formData,
  })
    .then((res) => {
      if (!res.ok) throw new Error("Erro ao adicionar filme");
      return res.json();
    })
    .then((data) => {
      alert("Filme adicionado com sucesso!");
      // Limpar formulário
      document.getElementById("form-filme").reset();
      carregarFilmes(); // atualizar lista
    })
    .catch((erro) => {
      console.error(erro);
      alert("Erro ao adicionar filme.");
    });
});

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
