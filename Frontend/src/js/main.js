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
  slideAtual = (slideAtual - 1 + filmesAtuais.length) % filmesAtuais.length;
  renderizarSlides();
});

document.querySelector(".btn-avancar").addEventListener("click", () => {
  slideAtual = (slideAtual + 1) % filmesAtuais.length;
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

function verificarLogin() {
  return fetch("http://localhost:3001/api/usuario-logado", {
    credentials: "include",
  }).then((res) => {
    if (!res.ok) throw new Error("Usuário não logado");
    return res.json();
  });
}

function fazerLogout() {
  return fetch("http://localhost:3001/api/logout", {
    method: "POST",
    credentials: "include",
  });
}

document.addEventListener("DOMContentLoaded", () => {
  carregarFilmesDoServidor();

  const btnLogin = document.querySelector(".btn-login");
  const btnCadastrar = document.querySelector(".btn-cadastrar");
  const userMenuContainer = document.querySelector(".user-menu-container");
  const userIcon = document.querySelector(".user-icon");
  const nomeUsuarioSpan = document.querySelector(".nome-usuario");
  const userEmailSpan = document.querySelector(".user-email");
  const dropdownLogoutBtn = document.querySelector(".logout-btn");
  const btnAdm = document.querySelector(".btn-adm");

  btnAdm.addEventListener("click", () => {
    window.location.href = "./src/HTML/adm.html";
  });

  verificarLogin()
    .then((dados) => {
      btnLogin.style.display = "none";
      btnCadastrar.style.display = "none";
      userMenuContainer.style.display = "flex";
      nomeUsuarioSpan.textContent = dados.nome;
      userEmailSpan.textContent = dados.email;

      // Mostrar botão ADM se for admin
      if (dados.cargo === "ADM") {
        btnAdm.style.display = "inline-block";
      }
    })
    .catch(() => {
      btnLogin.style.display = "inline-block";
      btnCadastrar.style.display = "inline-block";
      userMenuContainer.style.display = "none";
      btnAdm.style.display = "none";
    });

  userIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    userMenuContainer.classList.toggle("active");
  });

  document.addEventListener("click", (e) => {
    if (!userMenuContainer.contains(e.target)) {
      userMenuContainer.classList.remove("active");
    }
  });

  dropdownLogoutBtn.addEventListener("click", () => {
    fazerLogout().then(() => window.location.reload());
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      userMenuContainer.classList.remove("active");
    }
  });
});
