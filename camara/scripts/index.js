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

        temaIcone.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
    });
}

const ultimaMod = document.querySelector("#ultimaMod");

if (ultimaMod) {
    ultimaMod.textContent = `Última modificação: ${document.lastModified}`;
}

const anoAtual = document.querySelector("#anoAtual");

if (anoAtual) {
    anoAtual.textContent = new Date().getFullYear();
}

function obterCondicaoClimatica(codigo, iconeApi) {
    if (codigo >= 200 && codigo <= 232) {
        return { descricao: "Tempestade", icone: "⛈️" };
    }

    if (codigo >= 300 && codigo <= 321) {
        return { descricao: "Garoa", icone: "🌧️" };
    }

    if (codigo >= 500 && codigo <= 504) {
        return { descricao: "Chuva", icone: "🌧️" };
    }

    if (codigo >= 511 && codigo <= 531) {
        return { descricao: "Pancadas de Chuva", icone: "🌧️" };
    }

    if (codigo >= 600 && codigo <= 622) {
        return { descricao: "Neve", icone: "❄️" };
    }

    if (codigo >= 700 && codigo <= 799) {
        return { descricao: "Neblina", icone: "🌫️" };
    }

    if (codigo === 800) {
        return iconeApi.endsWith("n")
            ? { descricao: "Céu Limpo", icone: "🌙" }
            : { descricao: "Céu Limpo", icone: "☀️" };
    }

    if (codigo === 801) {
        return iconeApi.endsWith("n")
            ? { descricao: "Parcialmente Nublado", icone: "☁️" }
            : { descricao: "Parcialmente Nublado", icone: "🌤️" };
    }

    if (codigo >= 802 && codigo <= 804) {
        return { descricao: "Nublado", icone: "☁️" };
    }

    return { descricao: "Condição Variável", icone: "☁️" };
}

async function clima() {
    //https://home.openweathermap.org/api_keys  
    const API_KEY = "6fd1ae5b6c00edaa2b773af0a2251cc1";
    const cidade = "Sao Paulo,BR";
 

    const temperaturaAtual = document.querySelector("#temperaturaAtual");
    const descricaoClima = document.querySelector("#descricaoClima");
    const iconeDoClima = document.querySelector("#iconeDoClima");
    const sensacaoTermica = document.querySelector("#sensacaoTermica");
    const umidade = document.querySelector("#umidade");
    const nascerDoSol = document.querySelector("#nascerDoSol");
    const porDoSol = document.querySelector("#porDoSol");
    const mostrarTemp = document.querySelector("#mostrarTemp");

    const urlAtual = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${API_KEY}&units=metric&lang=pt_br`;

    const urlPrevisao = `https://api.openweathermap.org/data/2.5/forecast?q=${cidade}&appid=${API_KEY}&units=metric&lang=pt_br`;

    try {
        const [respostaAtual, respostaPrevisao] = await Promise.all([
            fetch(urlAtual),
            fetch(urlPrevisao)
        ]);

        if (!respostaAtual.ok) {
            throw new Error(`Erro no clima atual: ${respostaAtual.status}`);
        }

        if (!respostaPrevisao.ok) {
            throw new Error(`Erro na previsão: ${respostaPrevisao.status}`);
        }

        const dadosAtual = await respostaAtual.json();
        const dadosPrevisao = await respostaPrevisao.json();

        const condicaoAtual = obterCondicaoClimatica(
            dadosAtual.weather[0].id,
            dadosAtual.weather[0].icon
        );

        if (temperaturaAtual) {
            temperaturaAtual.textContent = `${dadosAtual.main.temp.toFixed(1)} °C`;
        }

        if (descricaoClima) {
            const descricao = dadosAtual.weather[0].description;

            descricaoClima.textContent =
                descricao.charAt(0).toUpperCase() + descricao.slice(1);
        }

        if (iconeDoClima) {
            iconeDoClima.textContent = condicaoAtual.icone;
        }

        if (sensacaoTermica) {
            sensacaoTermica.textContent = `${dadosAtual.main.feels_like.toFixed(1)} °C`;
        }

        if (umidade) {
            umidade.textContent = `${dadosAtual.main.humidity}%`;
        }

        if (nascerDoSol) {
            nascerDoSol.textContent = new Date(dadosAtual.sys.sunrise * 1000)
                .toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "America/Sao_Paulo"
                });
        }

        if (porDoSol) {
            porDoSol.textContent = new Date(dadosAtual.sys.sunset * 1000)
                .toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "America/Sao_Paulo"
                });
        }

        if (mostrarTemp) {
            const formatador = new Intl.DateTimeFormat("sv-SE", {
                timeZone: "America/Sao_Paulo",
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
            });

            const formatadorHora = new Intl.DateTimeFormat("en-US", {
                timeZone: "America/Sao_Paulo",
                hour: "2-digit",
                hourCycle: "h23"
            });

            const hoje = formatador.format(new Date());
            const previsoesPorDia = {};

            dadosPrevisao.list.forEach((item) => {
                const data = new Date(item.dt * 1000);
                const dia = formatador.format(data);

                if (dia === hoje) {
                    return;
                }

                const hora = Number(formatadorHora.format(data));
                const distanciaDoMeioDia = Math.abs(hora - 12);

                if (!previsoesPorDia[dia]) {
                    previsoesPorDia[dia] = {
                        minima: item.main.temp_min,
                        maxima: item.main.temp_max,
                        codigoClima: item.weather[0].id,
                        iconeApi: item.weather[0].icon,
                        descricao: item.weather[0].description,
                        distanciaDoMeioDia
                    };
                } else {
                    previsoesPorDia[dia].minima = Math.min(
                        previsoesPorDia[dia].minima,
                        item.main.temp_min
                    );

                    previsoesPorDia[dia].maxima = Math.max(
                        previsoesPorDia[dia].maxima,
                        item.main.temp_max
                    );

                    if (distanciaDoMeioDia < previsoesPorDia[dia].distanciaDoMeioDia) {
                        previsoesPorDia[dia].codigoClima = item.weather[0].id;
                        previsoesPorDia[dia].iconeApi = item.weather[0].icon;
                        previsoesPorDia[dia].descricao = item.weather[0].description;
                        previsoesPorDia[dia].distanciaDoMeioDia = distanciaDoMeioDia;
                    }
                }
            });

            const proximosDias = Object.keys(previsoesPorDia)
                .sort()
                .slice(0, 3);

            mostrarTemp.innerHTML = proximosDias.map((dia) => {
                const data = new Date(`${dia}T12:00:00`);

                const nomeDia = data.toLocaleDateString("pt-BR", {
                    weekday: "long",
                    day: "2-digit",
                    month: "2-digit"
                });

                const previsao = previsoesPorDia[dia];

                const condicao = obterCondicaoClimatica(
                    previsao.codigoClima,
                    previsao.iconeApi
                );

                const descricao = previsao.descricao;

                return `
                    <div>
                        <strong>${condicao.icone} ${nomeDia}</strong>
                        <p>${descricao.charAt(0).toUpperCase() + descricao.slice(1)}</p>
                        <p>Mínima: ${previsao.minima.toFixed(1)} °C</p>
                        <p>Máxima: ${previsao.maxima.toFixed(1)} °C</p>
                    </div>
                `;
            }).join("");
        }

    } catch (erro) {
        console.error("Erro ao carregar o clima:", erro);

        if (descricaoClima) {
            descricaoClima.textContent = "Clima indisponível.";
        }

        if (iconeDoClima) {
            iconeDoClima.textContent = "❓";
        }

        if (mostrarTemp) {
            mostrarTemp.textContent = "Não foi possível carregar a previsão.";
        }
    }
}

async function empresas() {
    try {
        const resposta = await fetch("dados/membros.json");

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar o arquivo JSON.");
        }

        const dados = await resposta.json();

        const empresasElegiveis = dados.empresas.filter((empresa) =>
            ["ouro", "prata"].includes(empresa.nivelAssociacao.toLowerCase())
        );

        for (let i = empresasElegiveis.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));

            [empresasElegiveis[i], empresasElegiveis[j]] =
                [empresasElegiveis[j], empresasElegiveis[i]];
        }

        const quantidade = Math.min(
            empresasElegiveis.length,
            Math.random() < 0.5 ? 2 : 3
        );

        const empresasDestaque = empresasElegiveis.slice(0, quantidade);

        const blocos = [
            document.querySelector("#empresa1"),
            document.querySelector("#empresa2"),
            document.querySelector("#empresa3")
        ];

        empresasDestaque.forEach((empresa, i) => {
            const bloco = blocos[i];

            if (!bloco) {
                return;
            }

            bloco.hidden = false;

            const titulo = bloco.querySelector("h2");
            const descricao = bloco.querySelector(":scope > p");
            const imagem = bloco.querySelector(".imgEmpresas");
            const paragrafos = bloco.querySelectorAll(".textosEmpresa p");

            titulo.textContent = empresa.nomeEmpresa;
            descricao.textContent = empresa.descricao;

            imagem.src = empresa.imagem;
            imagem.alt = `Logo da empresa ${empresa.nomeEmpresa}`;

            paragrafos[0].innerHTML = `<strong>Endereço:</strong> ${empresa.endereco}`;

            paragrafos[1].innerHTML = `<strong>Telefone:</strong> ${
                empresa.telefone || "Não informado"
            }`;

            paragrafos[2].innerHTML = `
                <strong>Site:</strong>
                <a href="${empresa.urlSite}" target="_blank" rel="noopener noreferrer">Acessar site</a><br>
                <strong>Associação:</strong> ${empresa.nivelAssociacao}`;
        });

        blocos.forEach((bloco, i) => {
            if (bloco) {
                bloco.hidden = i >= empresasDestaque.length;
            }
        });

    } catch (erro) {
        console.error("Erro ao carregar as empresas:", erro);
    }
}

clima();
empresas();