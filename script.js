const qs = (elemento) => document.querySelector(elemento);
const qsa = (elemento) => document.querySelectorAll(elemento);

// Variáveis de mudança
let seuVotoPara = qs(".d-1-1");
let cargo = qs(".d-1-2 span");
let numeros = qs(".d-1-3");
let infosCandidato = qs(".d-1-4");
let nomeCandidato = qs(".d-1-4-name");
let partido = qs(".d-1-4-partido");
let infoVice = qs(".d-1-4-vice");
let nomeVice = qs(".d-1-4-vice--name");
let imagens = qs(".d-1-right");
let imagemCandidato = qs(".d-1-image img");
let cargoCandidato = qs(".d-1-image span");
let imgSmall = qs(".small");
let imagemVice = qs(".small img");
let cargoVice = qs(".small span");
let legenda = qs(".d-2");

// Variável de controle de etapa
let etapaAtual = 0;
let numero = "";
let votoBranco = false;
let votos = [];

// Função que faz as configurações para quando uma etapa começa
function comecarEtapa() {
  // Armazena o objeto atual referente a etapa
  let etapa = etapas[etapaAtual];

  // Reseta a variável número
  numero = "";

  numeros.innerHTML = "";

  votoBranco = false;

  // Cria um elemento div para ser utilizado no documento html
  let numberSquare = document.createElement("div");

  // Adiciona a quantidade certa de quadradinhos para digitar os números na tela, acessando a propriedade 'numeros' do objeto referente a etapa
  for (let i = 0; i < etapa.numeros; i++) {
    if (i == 0) {
      numberSquare = document.createElement("div");
      numberSquare.classList.add("numero", "pisca");
      numeros.appendChild(numberSquare);
    } else {
      numberSquare = document.createElement("div");
      numberSquare.classList.add("numero");
      numeros.appendChild(numberSquare);
    }
  }

  // Faz as informações inicias referentes a etapa sumirem, pois ainda não se sabe qual candidato escolheu
  seuVotoPara.style.visibility = "hidden";
  cargo.innerHTML = etapa.titulo;
  infosCandidato.style.display = "none";
  infoVice.style.display = "none";
  imagens.style.visibility = "hidden";
  cargoCandidato.style.display = "none";
  imgSmall.style.display = "none";
  legenda.style.display = "none";
}

function atualizaInterface(eAtual) {
  let etapa = etapas[eAtual];

  // Acessando o objeto referente a etapa, acessa a propriedade 'candidatos' e, dentro dela, que é um array de objetos também, procura onde estão as propriedade 'numero' e, ao achar, compara com o valor da variável número e, caso ache, retorna um array com o objeto referente encontrado.
  let candidato = etapa.candidatos.filter((item) => item.numero === numero);

  // Caso algum valor seja retornado, ou seja, caso o vetor retornado seja maior que 0, executa essa condicional e atualiza a interface
  if (candidato.length > 0) {
    seuVotoPara.style.visibility = "visible";
    infosCandidato.style.display = "block";
    imagens.style.visibility = "visible";
    legenda.style.display = "block";
    nomeCandidato.innerHTML = candidato[0].nome;
    partido.innerHTML = candidato[0].partido;

    switch (eAtual) {
      case 0:
        imagemCandidato.src = candidato[0].fotos[0].url;
        break;
      default:
        infoVice.style.display = "block";
        nomeVice.innerHTML = candidato[0].vice;
        imgSmall.style.display = "block";
        cargoCandidato.style.display = "block";
        imagemCandidato.src = candidato[0].fotos[0].url;
        cargoCandidato.innerHTML = candidato[0].fotos[0].legenda;
        imagemVice.src = candidato[0].fotos[1].url;
        cargoVice.innerHTML = candidato[0].fotos[1].legenda;
    }

    // Caso não retorne nada, executa essa parte, mostrando que é um voto nulo
  } else {
    seuVotoPara.style.visibility = "visible";
    infosCandidato.style.display = "block";
    legenda.style.display = "block";
    infosCandidato.innerHTML =
      '<div class="pisca" style="font-size:3rem;margin:30px auto;">VOTO NULO</div>';
  }
}

// Adiciona dinâmicamente a cada elemento que contém a classe .number um evento de clique e, ao clicar num desses elementos, executa a função clicou()
qsa(".number").forEach((element) => {
  element.addEventListener("click", () => {
    clicou(element.getAttribute("data-numero"));
  });
});

// Ajuda a manter sempre o foco no input, caso o usuário clique em alguma parte na tela, para ele poder digitar o número
window.addEventListener("click", () => {
  qs("input").focus();
});

// Adiciona evento de teclado, para poder escolher os números a partir das teclas numéricas do teclado e, também, corrigir (apertando o backspace), confirmar (apertando o enter) e votar em branco (apertando a tecla b)
qs("input").addEventListener("keyup", (event) => {
  let digitado = event.key;
  let etapa = etapas[etapaAtual];
  if (
    digitado >= 0 &&
    etapas[etapaAtual] !== undefined &&
    numero.length !== etapa.numeros
  ) {
    clicou(digitado);
  }
});

function clicou(n) {
  // Executa som das teclas
  somTeclas();

  // Seleciona o elemento que contém a classe pisca
  let square = qs(".numero.pisca");

  // Adiciona o número clicado no quadrado piscando
  square.innerHTML = n;

  // Concatena os números digitados e armazena na variável número para conferir posteriormente qual candidato escolhido
  numero = `${numero}${n}`;

  // Remove a classe pisca do quadrado após o número ser escolhido
  square.classList.remove("pisca");

  // Verifica se ainda existe algum quadrado (elemento) após o que foi digitado previamente. Caso tenha, adiciona a classe pisca a esse quadrado. Caso não tenha mais nenhum, chama a função que atualiza a interface
  if (square.nextElementSibling !== null) {
    square.nextElementSibling.classList.add("pisca");
  } else {
    atualizaInterface(etapaAtual);
  }
}

qs(".branco").addEventListener("click", () => {
  somTeclas();
  if (numero.length == 0) {
    votoBranco = true;
    seuVotoPara.style.visibility = "visible";
    numeros.innerHTML =
      '<div class="pisca" style="font-size:3rem;margin:30px auto;">VOTO BRANCO</div>';
    legenda.style.display = "block";
  } else {
    alert(
      "Para votar em BRANCO, o campo de voto deve estar vazio. Aperte CORRIGE para apagar o campo de voto."
    );
  }
});

qs(".corrige").addEventListener("click", () => {
  somTeclas();
  comecarEtapa();
});

qs(".confirma").addEventListener("click", () => {
  somTeclas();

  let etapa = etapas[etapaAtual];
  let votoConfirmado = false;

  if (votoBranco) {
    votoConfirmado = true;
    votos.push({
      etapa: etapa.titulo,
      voto: "branco",
    });
    // Verifica se a variável numero está completamente preenchida com uma string com o mesmo tamanho do valor numérico da propriedade numeros do objeto referente a etapa atual. Se sim, ou o voto é nulo ou é um voto referente a algum candidato.
  } else if (numero.length === etapa.numeros) {
    votoConfirmado = true;

    let candidato = etapa.candidatos.filter((item) => item.numero === numero);

    console.log(candidato);

    if (candidato[0].numero === numero) {
      votos.push({
        etapa: etapa.titulo,
        voto: candidato[0].nome,
      });
    } else {
      votos.push({
        etapa: etapa.titulo,
        voto: "nulo",
      });
    }
  }

  if (votoConfirmado) {
    etapaAtual++;
    if (etapas[etapaAtual] !== undefined) {
      somConfirma();
      comecarEtapa();
    } else {
      qs(".tela").classList.add("tela-fim");
      qs(".tela").innerHTML =
        '<div class="carregar" style="text-align: center;">Carregando..<div class="barra-carregar"> <div class="carregando"></div></div></div>';
      setTimeout(() => {
        qs(".tela").innerHTML = '<div style="font-size: 4rem;">FIM!</div>';
        somConfirma();
      }, 3000);
    }
  }
});

let audio = new Audio();

function somTeclas() {
  audio.src = "audios/numeros.mp3";
  audio.play();
}

function somConfirma() {
  audio.src = "audios/confirma.mp3";
  audio.play();
}

comecarEtapa();
