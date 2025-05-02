const params = new URLSearchParams(window.location.search);
const title = params.get("title") || "Título não encontrado";
const desc = params.get("descricao") || "Descrição não encontrada";
const preco = params.get("precos") || "Preço não encontrado";
const imgUrl = params.get("imagem") || "";

document.getElementById("title-filme").textContent = title;
document.getElementById("descricao-filme").textContent = desc;
document.getElementById("preco-filmes").textContent = preco;
document.getElementById("capa-filme").src = imgUrl;
