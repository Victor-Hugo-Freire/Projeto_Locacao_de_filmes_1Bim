let filmes = [];
let slideAtual = 0;
let filmesAtuais = [];
let categoriaAtual = "cinemas";

const slidesContainer = document.getElementById("slides-container");
const tituloCategoria = document.getElementById("titulo-categoria");
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

  tituloCategoria.textContent =
    categoria === "cinemas"
      ? "Nos Cinemas"
      : categoria === "lancamentos"
      ? "Lançamentos"
      : "Populares";

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
    title: filme.movie_title,
    descricao: filme.movie_description,
    preco: filme.price,
    imagem: filme.image,
  });

  window.location.href = `filme.html?${params.toString()}`;
});

document.addEventListener("DOMContentLoaded", () => {
  carregarFilmesDoServidor();
});
