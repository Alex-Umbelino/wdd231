const campoHora = document.querySelector("#uploadHora");

if (campoHora) {
    campoHora.value = new Date().toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

const nomeExibicao = document.querySelector("#nomeAgradecimento");

if (nomeExibicao) {
    const parametros = new URLSearchParams(window.location.search);

    const nome = parametros.get("nome") || "";
    const sobrenome = parametros.get("sobrenome") || "";
    const email = parametros.get("email") || "";
    const numCelular = parametros.get("numCelular") || "";
    const nomeOrg = parametros.get("nomeOrg") || "";
    const uploadHora = parametros.get("uploadHora");
    const nivel = parametros.get("associacao");

    let data = "";
    let hora = "";

    if (uploadHora) {
        [data, hora] = uploadHora.split(",").map((parte) => parte.trim());
    }

    document.querySelector("#nomeAgradecimento").textContent = `Nome: ${nome} ${sobrenome}`;
    
    document.querySelector("#emailAgradecimento").textContent = `E-mail: ${email}`;
    document.querySelector("#numCelularAgradecimento").textContent = `Celular: ${numCelular}`;
    document.querySelector("#nomeOrgAgradecimento").textContent = `Organização: ${nomeOrg}`;
    document.querySelector("#uploadHoraAgradecimento").textContent = uploadHora
        ? `Inscrição feita em ${data} às ${hora}.`
        : "";

    const niveis = {
        NP: { nome: "NP", icone: "🤝" },
        Bronze: { nome: "Bronze", icone: "🥉" },
        Prata: { nome: "Prata", icone: "🥈" },
        Ouro: { nome: "Ouro", icone: "🥇" }
    };

    const infoNivel = niveis[nivel];

    if (infoNivel) {
        document.querySelector("#nivelAgradecimento").textContent =
            `Associação nível ${infoNivel.nome} ${infoNivel.icone}`;
    }
}

const botoesAnalisar = document.querySelectorAll(".analisar");

botoesAnalisar.forEach((botao) => {
    botao.addEventListener("click", () => {
        document.getElementById(botao.dataset.modal).showModal();
    });
});

const botoesFechar = document.querySelectorAll(".fecharModal");

botoesFechar.forEach((botao) => {
    botao.addEventListener("click", () => {
        botao.closest("dialog").close();
    });
});

const modais = document.querySelectorAll("dialog");

modais.forEach((modal) => {
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.close();
        }
    });
});