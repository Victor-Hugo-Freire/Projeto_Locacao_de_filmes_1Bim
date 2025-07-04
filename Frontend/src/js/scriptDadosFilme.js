const params = new URLSearchParams(window.location.search);
const title = params.get("title") || "Título não encontrado";
const desc = params.get("descricao") || "Descrição não encontrada";
const preco = params.get("preco") || "0.00";
const imgUrl = params.get("imagem") || "";

document.getElementById("title-filme").textContent = title;
document.getElementById("descricao-filme").textContent = desc;
document.getElementById("preco-filmes").textContent = `R$${parseFloat(
  preco
).toFixed(2)}`;
const caminhoCorrigido = imgUrl.replace("./src/", "../");
document.getElementById("capa-filme").src = caminhoCorrigido;

const btnPagemento = document.querySelector(".btn-pagamento");

btnPagemento.addEventListener("click", () => {
  const titleFilme = document.getElementById("title-filme").textContent;
  const precoFilme = document.getElementById("preco-filmes").textContent;
  const paramsFilme = new URLSearchParams({
    titleFilme,
    precoFilme,
  });
  window.location.href = `./pagamento.html?${paramsFilme.toString()}`;
});
