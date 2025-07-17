document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".jogador-card");
  const overlay = document.querySelector(".jogador-info-overlay");
  const conteudo = document.querySelector(".info-conteudo");

  cards.forEach((card) => {
    const atributos = JSON.parse(card.dataset.atributos);

    // Calcular overall
    const soma = atributos.reduce((acc, atual) => acc + atual.valor, 0);
    const overall = Math.round(soma / atributos.length);

    // Determinar classe da borda com base no overall
    let classeBorda = "";
    if (overall >= 90) classeBorda = "borda-nivel-5";
    else if (overall >= 80) classeBorda = "borda-nivel-4";
    else if (overall >= 70) classeBorda = "borda-nivel-3";
    else if (overall >= 60) classeBorda = "borda-nivel-2";
    else classeBorda = "borda-nivel-1";

    card.classList.add(classeBorda);

    // Criar elementos principais
    const overallDiv = document.createElement("div");
    overallDiv.classList.add("overall");
    overallDiv.textContent = overall;

    const imagem = card.querySelector("img");
    const nome = document.createElement("div");
    nome.classList.add("apelido-novo");
    nome.textContent = card.dataset.apelido;

    const btnComparar = document.createElement("button");
    btnComparar.classList.add("btn-comparar");
    btnComparar.textContent = "Comparar";

    // Limpar o conteúdo do card e adicionar os novos elementos
    card.innerHTML = "";
    card.appendChild(overallDiv);
    card.appendChild(imagem);
    card.appendChild(nome);
    card.appendChild(btnComparar);

    // Evento de clique para abrir detalhes do jogador
    card.addEventListener("click", (e) => {
      if (e.target.classList.contains("btn-comparar")) return;

      const apelido = card.dataset.apelido;
      const funcao = card.dataset.funcao;
      const idade = card.dataset.idade;
      const altura = card.dataset.altura;
      const img = card.dataset.img;

      conteudo.innerHTML = `
        <button class="btn-fechar" title="Fechar">&times;</button>
        <img src="${img}" alt="${apelido}" />
        <h2>${apelido}</h2>
        <p><strong>Função:</strong> ${funcao}</p>
        <p><strong>Idade:</strong> ${idade} anos</p>
        <p><strong>Altura:</strong> ${altura}</p>
        <div class="atributos">
          ${atributos
            .map(
              (attr) => `
            <div class="atributo">
              <label>${attr.label}</label>
              <div class="barra">
                <div class="barra-preenchimento" style="width: 0%"></div>
              </div>
            </div>`
            )
            .join("")}
        </div>
      `;

      overlay.classList.add("ativo");

      // Animação de preenchimento das barras
      setTimeout(() => {
        const barras = conteudo.querySelectorAll(".barra-preenchimento");
        barras.forEach((barra, i) => {
          barra.style.width = `${atributos[i].valor}%`;
        });
      }, 50);
    });

    // Evento do botão "Comparar"
    btnComparar.addEventListener("click", (e) => {
      e.stopPropagation();
      abrirTelaComparacao(card.dataset);
    });
  });

  // Fechar overlay
  overlay.addEventListener("click", (e) => {
    if (
      e.target.classList.contains("jogador-info-overlay") ||
      e.target.classList.contains("btn-fechar")
    ) {
      overlay.classList.remove("ativo");
    }
  });

  // Função para iniciar comparação (a ser implementada depois)
  function abrirTelaComparacao(data) {
    alert(`Abrir comparação com jogador: ${data.apelido}`);
  }
});
