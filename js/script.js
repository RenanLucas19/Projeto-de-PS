function mostrarCadastro() {
    document.getElementById('login-box').classList.add('hidden');
    document.getElementById('cadastro-box').classList.remove('hidden');
}

function mostrarLogin() {
    document.getElementById('cadastro-box').classList.add('hidden');
    document.getElementById('login-box').classList.remove('hidden');
}


document.addEventListener("DOMContentLoaded", () => {
    const modalDisciplina = document.getElementById("modal-cadastro-disciplina");
    const modalTarefa = document.getElementById("modal-cadastro-tarefa");
    const modalDetalhes = document.getElementById("modal-tarefa-detalhes");
    const modalEditarTarefa = document.getElementById("modal-editar-tarefa");
    const listaTarefas = document.getElementById("lista-tarefas");

    document.getElementById("btn-cadastrar-disciplina").addEventListener("click", () => {
        modalDisciplina.style.display = "flex";
    });

    document.getElementById("btn-cadastrar-tarefa").addEventListener("click", () => {
        modalTarefa.style.display = "flex";
    });

    document.getElementById("btn-salvar-tarefa").addEventListener("click", () => {
        const titulo = document.getElementById("titulo-tarefa").value;
        const disciplina = document.getElementById("disciplina-tarefa").value;
        const descricao = document.getElementById("descricao-tarefa").value;
        const dataInicio = document.getElementById("data-inicio").value;
        const dataEntrega = document.getElementById("data-entrega").value;

        if (titulo.trim() === "") return;

        const tarefa = document.createElement("div");
        tarefa.classList.add("tarefa-item");
        tarefa.innerHTML = `<strong>${titulo}</strong>`;

        tarefa.addEventListener("click", () => {
            document.getElementById("titulo-tarefa-modal").textContent = titulo;
            document.getElementById("disciplina-tarefa-modal").textContent = disciplina || "Não informada";
            document.getElementById("descricao-tarefa-modal").textContent = descricao || "Sem descrição";
            document.getElementById("data-inicio-modal").textContent = dataInicio || "Não definida";
            document.getElementById("data-entrega-modal").textContent = dataEntrega || "Não definida";

            modalDetalhes.style.display = "flex";

            document.getElementById("btn-editar-tarefa").addEventListener("click", () => {
                document.getElementById("titulo-editar").value = titulo;
                document.getElementById("disciplina-editar").value = disciplina;
                document.getElementById("descricao-editar").value = descricao;
                document.getElementById("data-inicio-editar").value = dataInicio;
                document.getElementById("data-entrega-editar").value = dataEntrega;

                modalEditarTarefa.style.display = "flex";
            });
        });

        listaTarefas.appendChild(tarefa);
        modalTarefa.style.display = "none";
    });

    document.querySelectorAll(".close-modal, #btn-cancelar, #btn-cancelar-tarefa, #btn-cancelar-editar").forEach(button => {
        button.addEventListener("click", () => {
            modalDisciplina.style.display = "none";
            modalTarefa.style.display = "none";
            modalDetalhes.style.display = "none";
            modalEditarTarefa.style.display = "none";
        });
    });
});
