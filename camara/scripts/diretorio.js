
const botao = document.querySelector("#menu-button");
const menu = document.querySelector("nav ul");

if (botao && menu) {
    botao.addEventListener("click", () => {
        menu.classList.toggle("open");
    });
}

const botaoTema = document.querySelector("#temaBotao");
const temaIcone = document.querySelector("#temaIcone");

if (botaoTema && temaIcone) {
    botaoTema.addEventListener("click", (event) => {
        event.preventDefault();
        document.body.classList.toggle("dark");

        if (document.body.classList.contains("dark")) {
            temaIcone.textContent = "☀️";
        } else {
            temaIcone.textContent = "🌙";
        }
    });
}

const ultimaMod = document.querySelector("#ultimaMod");

if (ultimaMod) {
    ultimaMod.textContent = `Última modificação: ${document.lastModified}`;
}

async function clima() {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=-23.5505&longitude=-46.6333&current=temperature_2m,relative_humidity_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=America%2FSao_Paulo&forecast_days=7";

    try {
        const resposta = await fetch(url);
        const dados = await resposta.json();

        const temperatura = dados.current.temperature_2m;
        const umidadeAtual = dados.current.relative_humidity_2m;
        const codigoClima = dados.current.weather_code;

        const maxima = dados.daily.temperature_2m_max[0];
        const minima = dados.daily.temperature_2m_min[0];

        const nascer = dados.daily.sunrise[0].split("T")[1];
        const por = dados.daily.sunset[0].split("T")[1];

        let descricao = "";
        let icone = "";

        if (codigoClima === 0) {
            descricao = "Céu Limpo";
            icone = "☀️";
        } else if (codigoClima <= 3) {
            descricao = "Parcialmente Nublado";
            icone = "🌤️";
        } else if (codigoClima === 45 || codigoClima === 48) {
            descricao = "Neblina";
            icone = "🌫️";
        } else if (codigoClima >= 51 && codigoClima <= 67) {
            descricao = "Chuva";
            icone = "🌧️";
        } else if (codigoClima >= 71 && codigoClima <= 77) {
            descricao = "Neve";
            icone = "❄️";
        } else if (codigoClima >= 80 && codigoClima <= 82) {
            descricao = "Pancadas de Chuva";
            icone = "🌧️";
        } else if (codigoClima >= 95) {
            descricao = "Tempestade";
            icone = "⛈️";
        } else {
            descricao = "Condição Variável";
            icone = "☁️";
        }

        document.querySelector("#temperaturaAtual").textContent = temperatura + "°C";
        document.querySelector("#descricaoClima").textContent = descricao;
        document.querySelector("#iconeDoClima").textContent = icone;
        document.querySelector("#temperaturaMaxima").textContent = "Máxima: " + maxima + "°C";
        document.querySelector("#temperaturaMinima").textContent = "Mínima: " + minima + "°C";
        document.querySelector("#umidade").textContent = "Umidade: " + umidadeAtual + "%";
        document.querySelector("#nascerDoSol").textContent = "Nascer do Sol: " + nascer.slice(0, 5);
        document.querySelector("#porDoSol").textContent = "Pôr do Sol: " + por.slice(0, 5);

        const previsao = document.querySelector("#mostrarTemp");

        if (previsao) {
            previsao.innerHTML = "";

            for (let i = 0; i < 3; i++) {
                const data = new Date(dados.daily.time[i] + "T12:00:00");

                const diaSemana = new Intl.DateTimeFormat("pt-BR", {
                    weekday: "long"
                }).format(data);

                const maximaDia = dados.daily.temperature_2m_max[i];
                const minimoDia = dados.daily.temperature_2m_min[i];

                previsao.innerHTML += `
                    <div>
                        <h3>${diaSemana}</h3>
                        <p>
                            Máxima: ${maximaDia} °C <br>
                            Mínima: ${minimoDia} °C
                        </p>
                    </div>
                `;
            }
        }
    } catch (erro) {
        console.log("Erro ao buscar previsão:", erro);
    }
}

clima();

async function empresas() {
    const url = "camara/dados/membros.json";

    try {
        const resposta = await fetch(url);

        if (!resposta.ok) {
            throw new Error("Erro ao carregar o arquivo: " + resposta.status);
        }

        const dados = await resposta.json();
        const listaEmpresas = dados.empresas;

        for (let i = 0; i < 3; i++) {
            const bloco = document.querySelector("#empresa" + (i + 1));

            if (!bloco || !listaEmpresas[i]) {
                continue;
            }

            const nome = bloco.querySelector("h2");
            const descricao = bloco.querySelector("p");
            const imagem = bloco.querySelector("img");
            const paragrafos = bloco.querySelectorAll("div p");

            nome.textContent = listaEmpresas[i].nomeEmpresa;
            descricao.textContent = listaEmpresas[i].descricao;

            imagem.src = "camara/" + listaEmpresas[i].imagem;
            imagem.alt = listaEmpresas[i].nomeEmpresa;

            paragrafos[0].innerHTML = "<strong>Endereço:</strong> " + listaEmpresas[i].endereco;
            paragrafos[1].innerHTML = "<strong>Telefone:</strong> " + (listaEmpresas[i].telefone || "Não informado");
            paragrafos[2].innerHTML = "<strong>Site:</strong> " + listaEmpresas[i].urlSite;
        }
    } catch (erro) {
        console.log("Erro ao carregar empresas:", erro);
    }
}

empresas();

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
            container.innerHTML = "";

            for (let i = 0; i < listaEmpresas.length; i++) {
                const empresa = listaEmpresas[i];
                const cartao = document.createElement("article");

                cartao.className = "empresas";

                cartao.innerHTML = `
                    <h2>${empresa.nomeEmpresa}</h2>

                    <p>${empresa.descricao}</p>

                    <div class="separadorEmpresa"></div>

                    <div class="dadosEmpresa">

                        <img src="${empresa.imagem}" alt="${empresa.nomeEmpresa}">

                        <div class="textosEmpresa">

                            <p><strong>Endereço:</strong> ${empresa.endereco || "Não informado"}</p>

                            <p><strong>Telefone:</strong> ${empresa.telefone || "Não informado"}</p>

                            <p><strong>Associação:</strong> ${empresa.nivelAssociacao || "Não informado"}</p>

                            <p>
                                <strong>Site:</strong>
                                <a href="${empresa.urlSite}" target="_blank" rel="noopener noreferrer">
                                    Acessar
                                </a>
                            </p>

                        </div>

                    </div>
                `;

                container.appendChild(cartao);
            }

            botaoGrid.classList.add("ativa");
            botaoLista.classList.remove("ativa");
        }

        function mostrarLista() {
            container.className = "container modoLista";

            let tabela = `
                <table class="tabelaEmpresas">
                    <thead>
                        <tr>
                            <th>Empresa</th>
                            <th>Associação</th>
                            <th>Telefone</th>
                            <th>Site</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            for (let i = 0; i < listaEmpresas.length; i++) {
                const empresa = listaEmpresas[i];

                tabela += `
                    <tr>
                        <td>${empresa.nomeEmpresa}</td>
                        <td>${empresa.nivelAssociacao || "Não informado"}</td>
                        <td>${empresa.telefone || "Não informado"}</td>
                        <td>
                            <a href="${empresa.urlSite}" target="_blank" rel="noopener noreferrer">
                                Acessar
                            </a>
                        </td>
                    </tr>
                `;
            }

            tabela += `
                    </tbody>
                </table>
            `;

            container.innerHTML = tabela;

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
