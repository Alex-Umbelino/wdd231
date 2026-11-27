/* ==================================================
   ARQUIVO PRINCIPAL
   A busca do JSON fica em dados.js (módulo ES).
================================================== */

import { buscarJogos } from "./dados.js";


/* ==================================================
   MENU RESPONSIVO (todas as páginas)
================================================== */

const botao = document.querySelector(".btnMenu");
const menu = document.querySelector(".menu");

if (botao && menu) {

    botao.addEventListener("click", () => {

        menu.classList.toggle("aberto");

        const aberto = menu.classList.contains("aberto");

        botao.textContent = aberto ? "✕" : "☰";
        botao.setAttribute("aria-expanded", aberto);
        botao.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
    });
}


/* ==================================================
   LOCAL STORAGE
================================================== */

const CHAVE = "alexGamesPreferencias";

function salvarPreferencias(preferencias) {
    localStorage.setItem(CHAVE, JSON.stringify(preferencias));
}

function lerPreferencias() {

    try {
        const texto = localStorage.getItem(CHAVE);
        return texto ? JSON.parse(texto) : null;
    } catch (erro) {
        console.error("Erro ao ler o localStorage:", erro);
        return null;
    }
}


/* ==================================================
   MODAL DE DETALHES DO JOGO (buscarJogo.html)
================================================== */

const dialog = document.querySelector("#dialogJogo");
const conteudoDialog = document.querySelector("#conteudoDialog");

function abrirModal(jogo) {

    if (!dialog || !conteudoDialog) {
        return;
    }

    conteudoDialog.innerHTML = `
        <h2 id="tituloDialog">${jogo.nome}</h2>
        <img src="${jogo.imagem}" alt="Imagem de ${jogo.nome}">
        <p><strong>Gênero:</strong> ${jogo.genero}</p>
        <p><strong>Plataforma:</strong> ${jogo.plataforma}</p>
        <p><strong>Sobre o jogo:</strong> ${jogo.biografia}</p>
    `;

    dialog.showModal();
}

if (dialog) {

    /* Fechar ao clicar fora do conteúdo */
    dialog.addEventListener("click", evento => {
        if (evento.target === dialog) {
            dialog.close();
        }
    });

    /* Botão de fechar */
    const botaoFechar = document.querySelector("#fecharDialog");

    if (botaoFechar) {
        botaoFechar.addEventListener("click", () => dialog.close());
    }
}


/* ==================================================
   LISTA DE JOGOS (buscarJogo.html)
================================================== */

const listaGames = document.querySelector("#listaGames");

async function carregarListaGames() {

    const jogos = await buscarJogos();

    if (!jogos) {
        listaGames.textContent = "Os jogos não puderam ser carregados. Tente novamente mais tarde.";
        return;
    }

    jogos.forEach(jogo => {

        const card = document.createElement("article");
        card.classList.add("cardJogo");
        card.tabIndex = 0; /* permite abrir com o teclado */

        card.innerHTML = `
            <h2>${jogo.nome}</h2>
            <img src="${jogo.imagem}" alt="Imagem do jogo ${jogo.nome}" width="400" height="225" loading="lazy">
            <p>${jogo.descricao}</p>
            <p><strong>Gênero do jogo:</strong> ${jogo.genero}</p>
            <p><strong>Plataforma:</strong> ${jogo.plataforma}</p>
        `;

        card.addEventListener("click", () => abrirModal(jogo));

        card.addEventListener("keydown", evento => {
            if (evento.key === "Enter" || evento.key === " ") {
                evento.preventDefault();
                abrirModal(jogo);
            }
        });

        listaGames.appendChild(card);
    });
}

if (listaGames) {
    carregarListaGames();
}


/* ==================================================
   FORMULÁRIO (cadastro.html)
================================================== */

const formInscricao = document.querySelector("#formInscricao");

if (formInscricao) {

    /* PREENCHER COM A ÚLTIMA BUSCA, SE EXISTIR */

    const salvas = lerPreferencias();

    if (salvas) {

        ["nome", "sobrenome", "email", "plataforma", "genero"].forEach(campo => {
            if (salvas[campo]) {
                formInscricao.elements[campo].value = salvas[campo];
            }
        });

        const mensagem = document.querySelector("#mensagemRetorno");

        if (mensagem) {
            mensagem.textContent =
                `Que bom te ver de novo, ${salvas.nome}! Preenchemos o formulário com a sua última busca.`;
            mensagem.hidden = false;
        }
    }


    /* SALVAR NO localStorage ANTES DE IR PARA resultado.html */

    formInscricao.addEventListener("submit", () => {

        salvarPreferencias({
            nome: formInscricao.elements.nome.value.trim(),
            sobrenome: formInscricao.elements.sobrenome.value.trim(),
            email: formInscricao.elements.email.value.trim(),
            plataforma: formInscricao.elements.plataforma.value,
            genero: formInscricao.elements.genero.value,
            dataBusca: new Date().toLocaleString("pt-BR")
        });
    });
}


/* ==================================================
   RESULTADO (resultado.html)
================================================== */

const areaResultado = document.querySelector("#areaResultado");

function plataformaCompativel(jogo, plataforma) {

    /* "PlayStation" combina com "PlayStation 5", "PlayStation 4" etc. */
    return jogo.plataforma
        .toLowerCase()
        .split(",")
        .some(item => item.trim().startsWith(plataforma.toLowerCase()));
}

function generoCompativel(jogo, genero) {
    return jogo.genero.toLowerCase().includes(genero.toLowerCase());
}

function criarCardResultado(jogo) {
    return `
        <article class="cardResultado">
            <h3>${jogo.nome}</h3>
            <img src="${jogo.imagem}" alt="Imagem do jogo ${jogo.nome}" width="300" height="169" loading="lazy">
            <p>${jogo.descricao}</p>
            <p><strong>Gênero:</strong> ${jogo.genero}</p>
            <p><strong>Plataforma:</strong> ${jogo.plataforma}</p>
        </article>
    `;
}

async function mostrarResultado() {

    const preferencias = lerPreferencias();

    /* Ninguém preencheu o formulário ainda */
    if (!preferencias) {
        areaResultado.innerHTML =
            `<p>Você ainda não fez nenhuma busca. Clique em <strong>Fazer nova busca</strong> para começar.</p>`;
        return;
    }

    const jogos = await buscarJogos();

    if (!jogos) {
        areaResultado.innerHTML =
            `<p>Não foi possível carregar os jogos agora. Tente novamente mais tarde.</p>`;
        return;
    }

    const encontrados = jogos.filter(jogo =>
        plataformaCompativel(jogo, preferencias.plataforma) &&
        generoCompativel(jogo, preferencias.genero)
    );

    areaResultado.replaceChildren();


    /* SAUDAÇÃO E DADOS DO FORMULÁRIO
       (textContent para o texto digitado não virar HTML) */

    const saudacao = document.createElement("p");
    saudacao.classList.add("saudacao");
    saudacao.textContent = `Olá, ${preferencias.nome} ${preferencias.sobrenome}!`;
    areaResultado.appendChild(saudacao);

    const dadosBusca = document.createElement("ul");
    dadosBusca.classList.add("dadosBusca");

    [
        ["E-mail", preferencias.email],
        ["Plataforma", preferencias.plataforma],
        ["Gênero", preferencias.genero],
        ["Data da busca", preferencias.dataBusca]
    ].forEach(([rotulo, valor]) => {
        const item = document.createElement("li");
        item.innerHTML = `<strong>${rotulo}:</strong> `;
        item.append(valor);
        dadosBusca.appendChild(item);
    });

    areaResultado.appendChild(dadosBusca);


    /* LISTA DE JOGOS ENCONTRADOS */

    const quantidade = document.createElement("h2");

    if (encontrados.length > 0) {

        quantidade.textContent = `Encontramos ${encontrados.length} jogo(s) para você!`;
        areaResultado.appendChild(quantidade);

        areaResultado.insertAdjacentHTML(
            "beforeend",
            encontrados.map(criarCardResultado).join("")
        );

    } else {

        quantidade.textContent = "Nenhum jogo encontrado";
        areaResultado.appendChild(quantidade);

        const mensagem = document.createElement("p");
        mensagem.textContent = "Não encontramos jogos com essas preferências. Experimente outra combinação!";
        areaResultado.appendChild(mensagem);
    }
}

if (areaResultado) {
    mostrarResultado();
}