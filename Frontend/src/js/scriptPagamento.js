const radios = document.querySelectorAll('input[name="pagamento"]');
const nome = document.getElementById("nome").value.trim();
const validade = document.getElementById("validade").value.trim();
const cvv = document.getElementById("cvv").value.trim();
const pixDetalhes = document.getElementById("pix-detalhes");
const cartaoDetalhes = document.getElementById("cartao-detalhes");
const btnConfirmar = document.querySelector(".btn-confirmar");

const paramsFilme = new URLSearchParams(window.location.search);
const titleFilme = params.get("titleFilme") || "Título não encontrado!";
const precoFilme = params.get("precoFilme") || "Preço não encontrado!";

document.getElementById("titulo-filme").textContent = titleFilme;
document.getElementById("preco-filme").textContent = precoFilme;

btnConfirmar.addEventListener("click", () => {
  const numeroCar = document
    .getElementById("numeroCar")
    .value.replace(/\s/g, "");
  const numCar = numeroCar.split("").map(Number);
  let soma = 0;

  for (let i = 0; i < numCar.length; i++) {
    let digito = numCar[i];
    const posicaoDoInicio = numCar.length % 2;
    if (i % 2 === posicaoDoInicio) {
      digito *= 2;
      if (digito > 9) {
        digito = Math.floor(digito / 10) + (digito % 10);
      }
    }
    soma += digito;
  }
  if (soma % 10 !== 0) {
    alert("Número do cartão inválido!");
  } else {
    window.location.href = "../../index.html";
  }
});

function atualizarFormaPagamento() {
  const selecionado = document.querySelector(
    'input[name="pagamento"]:checked'
  ).value;
  if (selecionado === "pix") {
    pixDetalhes.style.display = "block";
    cartaoDetalhes.style.display = "none";
  } else {
    pixDetalhes.style.display = "none";
    cartaoDetalhes.style.display = "block";
  }
}

radios.forEach((radio) =>
  radio.addEventListener("change", atualizarFormaPagamento)
);
atualizarFormaPagamento();
