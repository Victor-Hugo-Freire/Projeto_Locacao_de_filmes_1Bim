const params = new URLSearchParams(window.location.search);
const title = params.get("title") || "Título não encontrado";
const desc = params.get("descricao") || "Descrição não encontrada";
const imgUrl = params.get("imagem") || "";

document.getElementById("title-filme").textContent = title;
document.getElementById("descricao-filme").textContent = desc;
document.getElementById("capa-filme").src = imgUrl;
