import { lugares } from "../dados/lugares.mjs";

// CARTÕES

const cartoes = document.querySelector("#cartoes");

lugares.forEach((lugar, indice) => {
    const cartao = document.createElement("article");
    cartao.classList.add("cartao", `cartao${indice + 1}`);

    cartao.innerHTML = `
        <h2>${lugar.nome}</h2>
        <figure>
            <img src="${lugar.imagem}" alt="Foto de ${lugar.nome}" width="300" height="200" ${indice > 1 ? 'loading="lazy"' : ""}>
        </figure>
        <address>${lugar.endereco}</address>
        <p>${lugar.descricao}</p>
        <button type="button" class="botao-saiba">Saiba mais</button>
    `;

    cartao.querySelector(".botao-saiba").addEventListener("click", () => abrirDialog(lugar));

    cartoes.appendChild(cartao);
});


// MODAL SAIBA MAIS

const dialog = document.querySelector("#dialogLugar");
const conteudoDialog = document.querySelector("#conteudoDialog");

function abrirDialog(lugar) {
    const mapa = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lugar.endereco)}`;

    conteudoDialog.innerHTML = `
        <h2 id="tituloDialog">${lugar.nome}</h2>
        <address>${lugar.endereco}</address>
        <p>${lugar.descricao}</p>
        <a href="${mapa}" target="_blank" rel="noopener noreferrer">Ver no mapa</a>
    `;

    dialog.showModal();
}

document.querySelector("#fecharDialog").addEventListener("click", () => dialog.close());

dialog.addEventListener("click", evento => {
    if (evento.target === dialog) {
        dialog.close();
    }
});


// MENSAGEM DA ÚLTIMA VISITA

const UM_DIA = 1000 * 60 * 60 * 24;
const agora = Date.now();
const ultimaVisita = Number(localStorage.getItem("ultimaVisita"));
const textoVisita = document.querySelector("#textoVisita");

if (!ultimaVisita) {
    textoVisita.textContent = "Boas-vindas! Entre em contato conosco caso tenha alguma dúvida.";
} else {
    const dias = Math.floor((agora - ultimaVisita) / UM_DIA);

    if (dias < 1) {
        textoVisita.textContent = "Já voltou? Que legal!";
    } else {
        textoVisita.textContent = `Seu último acesso foi há ${dias} ${dias === 1 ? "dia" : "dias"}.`;
    }
}

localStorage.setItem("ultimaVisita", agora);

document.querySelector("#fecharMensagem").addEventListener("click", () => {
    document.querySelector("#mensagemVisita").hidden = true;
});
