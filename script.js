document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".jogador-card");
  const overlay = document.getElementById("infoOverlay");
  const conteudo = document.getElementById("infoConteudo");
  const btnFechar = document.getElementById("btnFechar");

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const apelido = card.dataset.apelido;
      const funcao = card.dataset.funcao;
      const idade = card.dataset.idade;
      const altura = card.dataset.altura;
      const imagem = card.dataset.img;
      const atributos = JSON.parse(card.dataset.atributos);

      // Insere conteúdo no overlay
      conteudo.innerHTML = `
        <button class="btn-fechar" id="btnFechar">✕</button>
        <img src="${imagem}" alt="${apelido}" />
        <h2>${apelido}</h2>
        <p>${funcao} | ${idade} anos | ${altura}</p>
        <div class="atributos">
          ${atributos
            .map(
              (a) => `
              <div class="atributo">
                <label>${a.label}</label>
                <div class="barra" data-valor="${a.valor}">
                  <div class="barra-preenchimento" style="width: 0%;"></div>
                </div>
              </div>
            `
            )
            .join("")}
        </div>
      `;

      // Ativa overlay
      overlay.classList.add("ativo");

      // Após DOM inserir, anima as barras
      setTimeout(() => {
        const barras = conteudo.querySelectorAll(".barra");
        barras.forEach((barra) => {
          const valor = barra.getAttribute("data-valor");
          const preenchimento = barra.querySelector(".barra-preenchimento");
          preenchimento.style.width = valor + "%";
        });

        // Reatribui botão fechar
        const btnFecharAtual = document.getElementById("btnFechar");
        btnFecharAtual.addEventListener("click", () => {
          overlay.classList.remove("ativo");
        });
      }, 50);
    });
  });

  // Também fecha com ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      overlay.classList.remove("ativo");
    }
  });

  // Fecha clicando fora do conteúdo
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.classList.remove("ativo");
    }
  });
});
