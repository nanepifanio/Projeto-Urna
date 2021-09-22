const qs = (elemento) => document.querySelector(elemento);
const qsa = (elemento) => document.querySelectorAll(elemento);

const seuVotoPara = qs(".d-1-1");
const cargo = qs(".d-1-2 span");
const numeros = qs(".d-1-3");
const infosCandidato = qs(".d-1-4");
const nomeCandidato = qs(".d-1-4-name");
const partido = qs(".d-1-4-partido");
const infoVice = qs(".d-1-4-vice");
const nomeVice = qs(".d-1-4-vice--name");
const imagens = qs(".d-1-right");
const imagemCandidato = qs(".d-1-image img");
const cargoCandidato = qs(".d-1-image span");
const imgSmall = qs(".small");
const imagemVice = qs(".small img");
const cargoVice = qs(".small span");
const legenda = qs(".d-2");

let etapaAtual = 0;
let numero = "";
let votoBranco = false;
const votos = [];

function comecarEtapa() {
  const etapa = etapas[etapaAtual];

  numero = "";

  numeros.innerHTML = "";

  votoBranco = false;

  let numberSquare = document.createElement("div");

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
  const etapa = etapas[eAtual];

  const candidato = etapa.candidatos.filter((item) => item.numero === numero);

  if (candidato.length) {
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
  } else {
    seuVotoPara.style.visibility = "visible";
    infosCandidato.style.display = "block";
    legenda.style.display = "block";
    infosCandidato.innerHTML =
      '<div class="pisca" style="font-size:3rem;margin:30px auto;">VOTO NULO</div>';
  }
}

qsa(".number").forEach((element) => {
  element.addEventListener("click", () => {
    clicou(element.getAttribute("data-numero"));
  });
});

window.addEventListener("keyup", (event) => {
  const digitado = event.key;
  const etapa = etapas[etapaAtual];
  if (
    digitado >= 0 &&
    etapas[etapaAtual] !== undefined &&
    numero.length !== etapa.numeros
  ) {
    clicou(digitado);
  }
});

function clicou(n) {
  somTeclas();

  const square = qs(".numero.pisca");

  square.innerHTML = n;

  numero = `${numero}${n}`;

  square.classList.remove("pisca");

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

  const etapa = etapas[etapaAtual];
  let votoConfirmado = false;

  if (votoBranco) {
    votoConfirmado = true;
    votos.push({
      etapa: etapa.titulo,
      voto: "branco",
    });
  } else if (numero.length === etapa.numeros) {
    votoConfirmado = true;

    const candidato = etapa.candidatos.filter((item) => item.numero === numero);

    if (candidato.length) {
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

const audio = new Audio();

function somTeclas() {
  audio.src = "audios/numeros.mp3";
  audio.play();
}

function somConfirma() {
  audio.src = "audios/confirma.mp3";
  audio.play();
}

comecarEtapa();
