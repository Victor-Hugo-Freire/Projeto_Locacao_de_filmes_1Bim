function verificarLogin(exigirAdm = false) {
  fetch("http://localhost:3001/api/usuario-logado", {
    credentials: "include",
  })
    .then((res) => {
      if (!res.ok) throw new Error("Não autenticado");
      return res.json();
    })
    .then((usuario) => {
      if (exigirAdm && usuario.cargo !== "ADM") {
        throw new Error("Acesso restrito");
      }
    })
    .catch((err) => {
      alert(
        err.message === "Acesso restrito"
          ? "Você precisa ser um administrador para acessar esta página."
          : "Você precisa estar logado."
      );
      window.location.href = "./login.html?modo=entrar";
    });
}
