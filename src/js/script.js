const botaoVoltar = document.querySelector(".btn-voltar");
const botaoAvancar = document.querySelector(".btn-avancar");
const slides = document.querySelectorAll(".slide");
let slideAtual = 0;

function mostrarSlide(indice) {
  slides.forEach((slide) => slide.classList.remove("selecionado"));
  slides[indice].classList.add("selecionado");
}

botaoVoltar.addEventListener("click", () => {
  slideAtual = (slideAtual - 1 + slides.length) % slides.length;
  mostrarSlide(slideAtual);
});

botaoAvancar.addEventListener("click", () => {
  slideAtual = (slideAtual + 1) % slides.length;
  mostrarSlide(slideAtual);
});
