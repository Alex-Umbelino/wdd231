const cursos = [
    { codigo: "WDD 130" },
    { codigo: "WDD 131" },
    { codigo: "WDD 231" },
    { codigo: "CSE 110" },
    { codigo: "CSE 111" },
    { codigo: "CSE 210" }
];

function filtrarCursos(tipo) {
    const listaCursos = document.getElementById("listaCursos");
    let cursosFiltrados = [];
    let totalCreditos = 0;

    if (tipo == "Todos") {
        cursosFiltrados = cursos;
        listaCursos.style.rowGap="10px";
    }
    else{
         listaCursos.style.rowGap = "0";
        if (tipo == "WDD") {
          cursosFiltrados = cursos.filter(curso => curso.codigo.startsWith("WDD"));
           } 
        else if (tipo == "CSE") {
          cursosFiltrados = cursos.filter(curso => curso.codigo.startsWith("CSE"));
           }

    } 
     

    listaCursos.innerHTML = "";

    cursosFiltrados.forEach(function(curso) {
        const coluna = document.createElement("div");
        coluna.className = "col-md-4";

        const botao = document.createElement("button");
        botao.className = "btn btn-dark ajusteB";
        botao.textContent = curso.codigo;

        coluna.append(botao);
        listaCursos.append(coluna);

        totalCreditos += 1;
    });

    document.getElementById("totalCursos").textContent =
        "O total de créditos para os cursos listados acima é " + totalCreditos;
    document.getElementById("totalCursos").style.color="red"; 
}

