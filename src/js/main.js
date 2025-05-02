const botaoVoltar = document.querySelector(".btn-voltar");
const botaoAvancar = document.querySelector(".btn-avancar");
const slides = document.querySelectorAll(".slide");
let slideAtual = 0;

const playBtn = document.querySelector(".btn-play");

function mostrarSlide(indice) {
  slides.forEach((slide) => slide.classList.remove("selecionado"));
  slides[indice].classList.add("selecionado");
}

botaoVoltar.addEventListener("click", () => {
  slideAtual = slideAtual - 1;
  if (slideAtual < 0) {
    slideAtual = slides.length - 1;
  }
  mostrarSlide(slideAtual);
});

botaoAvancar.addEventListener("click", () => {
  slideAtual = slideAtual + 1;
  if (slideAtual > slides.length - 1) {
    slideAtual = 0;
  }
  mostrarSlide(slideAtual);
});

playBtn.addEventListener("click", () => {
  const slide = document.querySelector(".slide.selecionado");
  const title = slide.querySelector(".title").textContent;
  const descricao = slide.querySelector(".descricao").textContent;
  const precos = slide.querySelector("#preco-filmes").textContent;
  const imgUrl = slide.querySelector("img").src;
  const params = new URLSearchParams({
    title,
    descricao,
    precos,
    imagem: imgUrl,
  });
  window.location.href = `filme.html?${params.toString()}`;
});
