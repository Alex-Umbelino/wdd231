/* ==================================================
   BUSCA DE DADOS (Fetch API + try...catch)
================================================== */

const URL_DADOS = "dados/jogosLista.json";

export async function buscarJogos() {

    try {

        const resposta = await fetch(URL_DADOS);

        if (!resposta.ok) {
            throw new Error(`Não foi possível acessar o JSON (status ${resposta.status}).`);
        }

        const dados = await resposta.json();

        return dados.jogos;

    } catch (erro) {

        console.error("Erro ao carregar os jogos:", erro);

        return null;
    }
}