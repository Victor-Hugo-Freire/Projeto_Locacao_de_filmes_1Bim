// main.js atualizado
let filmes = [];
let slideAtual = 0;
let filmesAtuais = [];
let categoriaAtual = "cinemas";

const slidesContainer = document.getElementById("slides-container");
const navLinks = document.querySelectorAll(".nav-link");

function carregarFilmesDoServidor() {
  fetch("http://localhost:3001/api/filmes")
    .then((res) => res.json())
    .then((dados) => {
      filmes = dados.map((filme) => ({
        ...filme,
        price: parseFloat(filme.price),
      }));

      carregarCategoria("cinemas");
    })
    .catch((erro) => {
      console.error("Erro ao carregar filmes do servidor:", erro);
    });
}

function renderizarSlides() {
  slidesContainer.innerHTML = "";

  filmesAtuais.forEach((filme, index) => {
    const slide = document.createElement("div");
    slide.className = `slide ${index === slideAtual ? "selecionado" : ""}`;

    slide.innerHTML = `
      <img src="${filme.image}" alt="${filme.movie_title}" />
      <div class="conteudo">
        <h2 class="title">${filme.movie_title}</h2>
        <p class="descricao">${filme.movie_description}</p>
        <h3 class="preco-filmes">A partir de R$${filme.price.toFixed(2)}</h3>
      </div>
    `;

    slidesContainer.appendChild(slide);
  });
}

function carregarCategoria(categoria) {
  categoriaAtual = categoria;
  filmesAtuais = filmes.filter((filme) => filme.category === categoria);
  slideAtual = 0;

  navLinks.forEach((link) => {
    link.classList.toggle("ativado", link.dataset.categoria === categoria);
  });

  renderizarSlides();
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    carregarCategoria(link.dataset.categoria);
  });
});

document.querySelector(".btn-voltar").addEventListener("click", () => {
  slideAtual--;
  if (slideAtual < 0) {
    slideAtual = filmesAtuais.length - 1;
  }
  renderizarSlides();
});

document.querySelector(".btn-avancar").addEventListener("click", () => {
  slideAtual++;
  if (slideAtual > filmesAtuais.length - 1) {
    slideAtual = 0;
  }
  renderizarSlides();
});

document.querySelector(".btn-play").addEventListener("click", () => {
  const filmeSelecionado = filmesAtuais[slideAtual];

  const params = new URLSearchParams({
    title: filmeSelecionado.movie_title,
    descricao: filmeSelecionado.movie_description,
    preco: filmeSelecionado.price,
    imagem: filmeSelecionado.image,
  });

  window.location.href = `./src/HTML/filme.html?${params.toString()}`;
});

document.querySelector(".btn-login").addEventListener("click", () => {
  window.location.href = "./src/HTML/login.html?modo=entrar";
});

document.querySelector(".btn-cadastrar").addEventListener("click", () => {
  window.location.href = "./src/HTML/login.html?modo=cadastrar";
});

document.addEventListener("DOMContentLoaded", () => {
  carregarFilmesDoServidor();

  // Verifica se usuário está logado
  const usuarioLogado = localStorage.getItem("usuarioLogado");
  const btnLogin = document.querySelector(".btn-login");
  const btnCadastrar = document.querySelector(".btn-cadastrar");
  const btnLogout = document.querySelector(".btn-logout");

  if (usuarioLogado) {
    // Usuário logado: esconde login/cadastrar e mostra logout
    btnLogin.style.display = "none";
    btnCadastrar.style.display = "none";
    btnLogout.style.display = "inline-block"; // ou block, dependendo do estilo
  } else {
    // Usuário não está logado: mostra login/cadastrar e esconde logout
    btnLogin.style.display = "inline-block";
    btnCadastrar.style.display = "inline-block";
    btnLogout.style.display = "none";
  }

  // Adiciona evento para botão de logout
  btnLogout.addEventListener("click", () => {
    localStorage.removeItem("usuarioLogado");
    alert("Você saiu com sucesso!");
    // Recarrega a página para atualizar o estado
    window.location.reload();
  });
});
