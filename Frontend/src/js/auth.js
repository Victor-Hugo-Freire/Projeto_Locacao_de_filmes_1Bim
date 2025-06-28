function verificarLogin() {
  fetch("http://localhost:3001/api/usuario-logado", {
    credentials: "include",
  })
    .then((res) => {
      if (!res.ok) throw new Error("Não autenticado");
      return res.json();
    })
    .catch(() => {
      // Redireciona para login se não estiver logado
      window.location.href = "./login.html?modo=entrar";
    });
}
