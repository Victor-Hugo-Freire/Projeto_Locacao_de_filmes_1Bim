let filmes = [];
let slideAtual = 0;
let filmesAtuais = [];
let categoriaAtual = "cinemas";

const slidesContainer = document.getElementById("slides-container");
const tituloCategoria = document.getElementById("titulo-categoria");
const navLinks = document.querySelectorAll(".nav-link");

function dividirCSV(linha) {
  const valores = [];
  let atual = "";
  let dentroDeAspas = false;

  for (let i = 0; i < linha.length; i++) {
    const char = linha[i];

    if (char === '"' && linha[i + 1] === '"') {
      atual += '"';
      i++;
    } else if (char === '"') {
      dentroDeAspas = !dentroDeAspas;
    } else if (char === "," && !dentroDeAspas) {
      valores.push(atual);
      atual = "";
    } else {
      atual += char;
    }
  }

  valores.push(atual);
  return valores;
}

function carregarCSV() {
  fetch("CSVs/movies.csv")
    .then((response) => response.text())
    .then((data) => {
      const linhas = data.trim().split("\n");
      const cabecalho = linhas[0].split(",");

      filmes = linhas.slice(1).map((linha) => {
        const valores = dividirCSV(linha);
        const filme = {};

        cabecalho.forEach((coluna, i) => {
          let valor = valores[i];

          if (coluna === "preco") valor = parseFloat(valor);
          filme[coluna.trim()] = valor.trim();
        });

        return filme;
      });

      carregarCategoria("cinemas");
    })
    .catch((erro) => console.error("Erro ao carregar CSV:", erro));
}

function renderizarSlides() {
  slidesContainer.innerHTML = "";

  filmesAtuais.forEach((filme, index) => {
    const slide = document.createElement("div");
    slide.className = `slide ${index === slideAtual ? "selecionado" : ""}`;

    slide.innerHTML = `
      <img src="${filme.imagem}" alt="${filme.titulo}" />
      <div class="conteudo">
        <h2 class="title">${filme.titulo}</h2>
        <p class="descricao">${filme.descricao}</p>
        <h3 class="preco-filmes">A partir de R$${filme.preco.toFixed(2)}</h3>
      </div>
    `;

    slidesContainer.appendChild(slide);
  });
}

function carregarCategoria(categoria) {
  categoriaAtual = categoria;
  filmesAtuais = filmes.filter((filme) => filme.categoria === categoria);
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
  slideAtual = slideAtual - 1;
  if (slideAtual < 0) {
    slideAtual = filmesAtuais.length - 1;
  }
  renderizarSlides();
});

document.querySelector(".btn-avancar").addEventListener("click", () => {
  slideAtual = slideAtual + 1;
  if (slideAtual > filmesAtuais.length - 1) {
    slideAtual = 0;
  }
  renderizarSlides();
});

document.querySelector(".btn-play").addEventListener("click", () => {
  const filmeSelecionado = filmesAtuais[slideAtual];

  const params = new URLSearchParams({
    title: filmeSelecionado.titulo,
    descricao: filmeSelecionado.descricao,
    preco: filmeSelecionado.preco,
    imagem: filmeSelecionado.imagem,
  });

  window.location.href = `filme.html?${params.toString()}`;
});

document.addEventListener("DOMContentLoaded", () => {
  carregarCSV();
});
