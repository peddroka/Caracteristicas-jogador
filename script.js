document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".jogador-card");
  const overlay = document.querySelector(".jogador-info-overlay");
  const conteudo = document.querySelector(".info-conteudo");
  const btnFechar = document.querySelector(".btn-fechar");

  // Variáveis para comparação
  let comparacaoOverlay = null;
  let comparacaoCardsContainer = null;
  let btnResetarComparacao = null;

  let jogadorSelecionadoParaComparar = null;
  let jogadoresParaComparar = [];

  // Cria overlay de comparação quando necessário
  function criarComparacaoOverlay() {
    comparacaoOverlay = document.createElement("div");
    comparacaoOverlay.classList.add("comparacao-overlay");

    comparacaoCardsContainer = document.createElement("div");
    comparacaoCardsContainer.classList.add("comparacao-cards-container");
    comparacaoOverlay.appendChild(comparacaoCardsContainer);

    btnResetarComparacao = document.createElement("button");
    btnResetarComparacao.textContent = "Resetar Comparação";
    btnResetarComparacao.classList.add("btn-resetar-comparacao");
    comparacaoOverlay.appendChild(btnResetarComparacao);

    document.body.appendChild(comparacaoOverlay);

    btnResetarComparacao.addEventListener("click", () => {
      jogadoresParaComparar = [];
      jogadorSelecionadoParaComparar = null;
      comparacaoOverlay.classList.remove("ativo");
      cards.forEach((c) => {
        const btn = c.querySelector(".btn-comparar");
        if (btn) btn.classList.remove("selecionado");
        if (btn) btn.classList.remove("btn-comparar-inativo");
      });
    });

    // Fecha overlay se clicar fora dos cards
    comparacaoOverlay.addEventListener("click", (e) => {
      if (e.target === comparacaoOverlay) {
        jogadoresParaComparar = [];
        jogadorSelecionadoParaComparar = null;
        comparacaoOverlay.classList.remove("ativo");
        cards.forEach((c) => {
          const btn = c.querySelector(".btn-comparar");
          if (btn) btn.classList.remove("selecionado");
          if (btn) btn.classList.remove("btn-comparar-inativo");
        });
      }
    });
  }

  // Calcula overall
  function calculaOverall(atributos) {
    const soma = atributos.reduce((acc, atual) => acc + atual.valor, 0);
    return Math.round(soma / atributos.length);
  }

  // Define classe geral para cor/borda baseado no overall
  function getOverallClass(overall) {
    if (overall >= 90) return "overall-90";
    if (overall >= 80) return "overall-80";
    if (overall >= 70) return "overall-70";
    if (overall >= 60) return "overall-60";
    return "overall-50";
  }

  // Cria a barra da comparação com destaque
  function criarBarra(atributo, destaque = false) {
    return `
      <div class="comparacao-atributo">
        <label>${atributo.label}</label>
        <div class="comparacao-barra">
          <div class="comparacao-barra-preenchimento ${
            destaque ? "destaque" : ""
          }" style="width: ${atributo.valor}%"></div>
        </div>
      </div>
    `;
  }

  // Mostra os detalhes do jogador no overlay
  function mostrarDetalhesJogador(card) {
    const apelido = card.dataset.apelido;
    const funcao = card.dataset.funcao;
    const idade = card.dataset.idade;
    const altura = card.dataset.altura;
    const img = card.dataset.img;
    const atributos = JSON.parse(card.dataset.atributos);

    // Monta atributos HTML com barras animadas
    let atributosHTML = "";
    atributos.forEach((attr) => {
      atributosHTML += `
        <div class="atributo">
          <label>${attr.label}</label>
          <div class="barra">
            <div class="barra-preenchimento" style="width: 0%"></div>
          </div>
        </div>
      `;
    });

    conteudo.innerHTML = `
      <button class="btn-fechar" title="Fechar">&times;</button>
      <img src="${img}" alt="${apelido}" />
      <h2>${apelido}</h2>
      <p><strong>Função:</strong> ${funcao}</p>
      <p><strong>Idade:</strong> ${idade} anos</p>
      <p><strong>Altura:</strong> ${altura}</p>
      <div class="atributos">
        ${atributosHTML}
      </div>
    `;

    overlay.classList.add("ativo");

    // Animação das barras preenchendo
    setTimeout(() => {
      const barras = conteudo.querySelectorAll(".barra-preenchimento");
      barras.forEach((barra, i) => {
        barra.style.width = `${atributos[i].valor}%`;
      });
    }, 50);

    // Botão fechar detalhes
    const btnFecharInfo = conteudo.querySelector(".btn-fechar");
    btnFecharInfo.addEventListener("click", () => {
      overlay.classList.remove("ativo");
    });
  }

  // Mostra a comparação entre dois jogadores
  function mostrarComparacao() {
    if (!comparacaoOverlay) criarComparacaoOverlay();

    comparacaoCardsContainer.innerHTML = "";

    const atributos1 = jogadoresParaComparar[0].atributos;
    const atributos2 = jogadoresParaComparar[1].atributos;

    const labels = atributos1.map((a) => a.label);

    let html1 = `
      <h2>${jogadoresParaComparar[0].apelido}</h2>
      <img src="${jogadoresParaComparar[0].img}" alt="${jogadoresParaComparar[0].apelido}" />
      <div class="comparacao-atributos">
    `;

    let html2 = `
      <h2>${jogadoresParaComparar[1].apelido}</h2>
      <img src="${jogadoresParaComparar[1].img}" alt="${jogadoresParaComparar[1].apelido}" />
      <div class="comparacao-atributos">
    `;

    labels.forEach((label, i) => {
      const val1 = atributos1[i].valor;
      const val2 = atributos2[i].valor;
      const destaque1 = val1 > val2;
      const destaque2 = val2 > val1;

      html1 += criarBarra(atributos1[i], destaque1);
      html2 += criarBarra(atributos2[i], destaque2);
    });

    html1 += "</div>";
    html2 += "</div>";

    comparacaoCardsContainer.innerHTML = `
      <div class="comparacao-card">${html1}</div>
      <div class="comparacao-card">${html2}</div>
    `;

    comparacaoOverlay.classList.add("ativo");
  }

  // Lógica para clique no botão comparar
  function onClickComparar(card) {
    if (!jogadorSelecionadoParaComparar) {
      jogadorSelecionadoParaComparar = card;
      jogadoresParaComparar = [
        {
          apelido: card.dataset.apelido,
          img: card.dataset.img,
          atributos: JSON.parse(card.dataset.atributos),
        },
      ];

      card.querySelector(".btn-comparar").classList.add("selecionado");

      // Deixa outros botões com opacidade reduzida
      cards.forEach((c) => {
        if (c !== card) {
          const btn = c.querySelector(".btn-comparar");
          if (btn) btn.classList.add("btn-comparar-inativo");
        }
      });
    } else if (card === jogadorSelecionadoParaComparar) {
      // Deseleciona se clicar no mesmo novamente
      jogadorSelecionadoParaComparar
        .querySelector(".btn-comparar")
        .classList.remove("selecionado");
      jogadorSelecionadoParaComparar = null;
      jogadoresParaComparar = [];

      cards.forEach((c) => {
        const btn = c.querySelector(".btn-comparar");
        if (btn) {
          btn.classList.remove("btn-comparar-inativo");
        }
      });
    } else if (jogadoresParaComparar.length === 1) {
      jogadoresParaComparar.push({
        apelido: card.dataset.apelido,
        img: card.dataset.img,
        atributos: JSON.parse(card.dataset.atributos),
      });

      card.querySelector(".btn-comparar").classList.add("selecionado");

      mostrarComparacao();
    }
  }

  // Adiciona botão comparar e eventos aos cards
  cards.forEach((card) => {
    const btnComparar = document.createElement("button");
    btnComparar.textContent = "Comparar";
    btnComparar.classList.add("btn-comparar");
    card.appendChild(btnComparar);

    btnComparar.addEventListener("click", (e) => {
      e.stopPropagation();
      onClickComparar(card);
    });

    // Clique no card abre detalhes
    card.addEventListener("click", () => {
      mostrarDetalhesJogador(card);
    });

    // Calcula e adiciona classe de cor/borda conforme overall
    const atributos = JSON.parse(card.dataset.atributos);
    const overall = calculaOverall(atributos);
    card.classList.add(getOverallClass(overall));
  });

  // Fechar overlay detalhes
  btnFechar.addEventListener("click", () => {
    overlay.classList.remove("ativo");
  });

  // Clique fora do conteúdo fecha overlay detalhes
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.classList.remove("ativo");
    }
  });
});
