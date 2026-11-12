const fonte = document.querySelector("#fontePoppins");
if (fonte) {
    fonte.rel = "stylesheet";
}

const botao = document.querySelector("#menu-button");
const menu = document.querySelector("nav ul");

if (botao && menu) {
    botao.addEventListener("click", () => {
        const aberto = menu.classList.toggle("open");
        botao.setAttribute("aria-expanded", aberto);
    });
}

const botaoTema = document.querySelector("#temaBotao");
const temaIcone = document.querySelector("#temaIcone");

if (botaoTema && temaIcone) {
    botaoTema.addEventListener("click", () => {
        const escuro = document.body.classList.toggle("dark");
        temaIcone.textContent = escuro ? "☀️" : "🌙";
    });
}

const ultimaMod = document.querySelector("#ultimaMod");

if (ultimaMod) {
    ultimaMod.textContent = `Última modificação: ${document.lastModified}`;
}

async function carregarDiretorio() {
    const container = document.querySelector("#listaEmpresas");
    const botaoGrid = document.querySelector("#botaoGrid");
    const botaoLista = document.querySelector("#botaoLista");

    if (!container || !botaoGrid || !botaoLista) {
        return;
    }

    try {
        const resposta = await fetch("dados/membros.json");

        if (!resposta.ok) {
            throw new Error("Erro ao carregar JSON: " + resposta.status);
        }

        const dados = await resposta.json();
        const listaEmpresas = dados.empresas;

        function mostrarGrid() {
            container.className = "container modoGrid";

            container.innerHTML = listaEmpresas.map((empresa) => `
                <article class="empresas">
                    <h2>${empresa.nomeEmpresa}</h2>
                    <p>${empresa.descricao}</p>
                    <div class="separadorEmpresa"></div>
                    <div class="dadosEmpresa">
                        <img class="imgEmpresas" src="${empresa.imagem}" alt="${empresa.nomeEmpresa}" width="75" height="75" loading="lazy">
                        <div class="textosEmpresa">
                            <p><strong>Endereço:</strong> ${empresa.endereco || "Não informado"}</p>
                            <p><strong>Telefone:</strong> ${empresa.telefone || "Não informado"}</p>
                            <p><strong>Associação:</strong> ${empresa.nivelAssociacao || "Não informado"}</p>
                            <p><strong>Site:</strong> <a href="${empresa.urlSite || "#"}" target="_blank" rel="noopener noreferrer">Acessar</a></p>
                        </div>
                    </div>
                </article>
            `).join("");

            botaoGrid.classList.add("ativa");
            botaoLista.classList.remove("ativa");
        }

        function mostrarLista() {
            container.className = "container modoLista";

            const linhas = listaEmpresas.map((empresa) => `
                <tr>
                    <td>${empresa.nomeEmpresa}</td>
                    <td>${empresa.nivelAssociacao || "Não informado"}</td>
                    <td>${empresa.telefone || "Não informado"}</td>
                    <td><a href="${empresa.urlSite || "#"}" target="_blank" rel="noopener noreferrer">Acessar</a></td>
                </tr>
            `).join("");

            container.innerHTML = `
                <table class="tabelaEmpresas">
                    <thead>
                        <tr>
                            <th>Empresa</th>
                            <th>Associação</th>
                            <th>Telefone</th>
                            <th>Site</th>
                        </tr>
                    </thead>
                    <tbody>${linhas}</tbody>
                </table>
            `;

            botaoLista.classList.add("ativa");
            botaoGrid.classList.remove("ativa");
        }

        botaoGrid.addEventListener("click", mostrarGrid);
        botaoLista.addEventListener("click", mostrarLista);

        mostrarGrid();

    } catch (erro) {
        console.log("Erro ao carregar diretório:", erro);
        container.textContent = "Não foi possível carregar as empresas.";
    }
}

carregarDiretorio();