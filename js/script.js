let currentTarefaId = null;
document.addEventListener("DOMContentLoaded", () => {
  const modalDisciplina = document.getElementById("modal-cadastro-disciplina");
  const modalTarefa = document.getElementById("modal-cadastro-tarefa");
  const modalDetalhes = document.getElementById("modal-tarefa-detalhes");
  const modalEditarTarefa = document.getElementById("modal-editar-tarefa");

  const listaDisciplinas = document.getElementById("lista-disciplinas");
  const listaTarefas = document.getElementById("lista-tarefas");
  const disciplinaTarefaSelect = document.getElementById("disciplina-tarefa");
  const disciplinaEditarSelect = document.getElementById("disciplina-editar");

  document
    .getElementById("btn-cadastrar-disciplina")
    .addEventListener("click", () => {
      modalDisciplina.style.display = "flex";
    });

  document
    .getElementById("btn-cadastrar-tarefa")
    .addEventListener("click", () => {
      modalTarefa.style.display = "flex";
    });

  // Função para carregar tarefas de uma disciplina
  async function carregarTarefas(disciplinaId) {
    const url = `http://127.0.0.1:8000/api/disciplinas/disciplinas/${disciplinaId}/atividades/`;
    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + localStorage.getItem("token"),
        },
      });
      if (response.ok) {
        const data = await response.json();
        listaTarefas.innerHTML = "";

        data.forEach((tarefa) => {
          const tarefaItem = document.createElement("div");
          tarefaItem.classList.add("tarefa-item");
          tarefaItem.innerHTML = `
            <h4>${tarefa.titulo}</h4>
            <p>${tarefa.descricao || ""}</p>
            <small>Início: ${tarefa.data_inicio || "N/A"} | Entrega: ${
            tarefa.data_entrega || "N/A"
          }</small>
          `;
          tarefaItem.addEventListener("click", () => {
            document.getElementById("titulo-tarefa-modal").textContent =
              tarefa.titulo;
            document.getElementById("disciplina-tarefa-modal").textContent =
              tarefa.disciplina || "Não informada";
            document.getElementById("descricao-tarefa-modal").textContent =
              tarefa.descricao || "Sem descrição";
            document.getElementById("data-inicio-modal").textContent =
              tarefa.data_inicio || "Não definida";
            document.getElementById("data-entrega-modal").textContent =
              tarefa.data_entrega || "Não definida";
            document.getElementById("titulo-tarefa-modal").dataset.tarefaId =
              tarefa.id;
            document.getElementById(
              "titulo-tarefa-modal"
            ).dataset.disciplinaId = disciplinaId;

            modalDetalhes.style.display = "flex";
          });
          listaTarefas.appendChild(tarefaItem);
        });
      }
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);
    }
  }

  // PATCH de atualizar a tarefa
  document
    .getElementById("btn-salvar-editar")
    .addEventListener("click", async () => {
      const titulo = document.getElementById("titulo-editar").value.trim();
      const disciplinaId = document.getElementById("disciplina-editar").value;
      const descricao = document
        .getElementById("descricao-editar")
        .value.trim();
      const dataInicio = document.getElementById("data-inicio-editar").value;
      const dataEntrega = document.getElementById("data-entrega-editar").value;

      if (!titulo || !disciplinaId || !currentTarefaId) {
        console.error("Dados insuficientes para atualizar a tarefa.");
        return;
      }

      try {
        const url = `http://127.0.0.1:8000/api/disciplinas/disciplinas/${disciplinaId}/atividades/${currentTarefaId}/`;
        const response = await fetch(url, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + localStorage.getItem("token"),
          },
          body: JSON.stringify({
            titulo,
            descricao,
            data_inicio: dataInicio,
            data_entrega: dataEntrega,
            disciplina: parseInt(disciplinaId),
          }),
        });

        if (response.ok) {
          alert("Tarefa atualizada com sucesso!");
          modalEditarTarefa.style.display = "none";
          carregarTarefas(disciplinaId);
        } else {
          const errorData = await response.json();
          alert(
            "Erro ao atualizar a tarefa: " +
              (errorData.detail || "Verifique os dados informados.")
          );
        }
      } catch (error) {
        console.error("Erro na requisição PATCH:", error);
        alert("Erro na requisição. Verifique o console para mais detalhes.");
      }
    });

  document.getElementById("btn-editar-tarefa").addEventListener("click", () => {
    const tarefaId = document.getElementById("titulo-tarefa-modal").dataset
      .tarefaId;
    if (!tarefaId) return;
    currentTarefaId = tarefaId;
    modalEditarTarefa.style.display = "flex";
  });

  // DELETE para concluir a tarefa
  document
    .getElementById("btn-concluir-tarefa")
    .addEventListener("click", async () => {
      const tarefaId = document.getElementById("titulo-tarefa-modal").dataset
        .tarefaId;
      const disciplinaId = document.getElementById("titulo-tarefa-modal")
        .dataset.disciplinaId;

      if (!tarefaId || !disciplinaId) {
        console.error("ID da tarefa ou disciplina não definidos.");
        return;
      }
      if (!confirm("Tem certeza que deseja concluir esta tarefa?")) return;

      const url = `http://127.0.0.1:8000/api/disciplinas/disciplinas/${disciplinaId}/atividades/${tarefaId}/`;
      try {
        const response = await fetch(url, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + localStorage.getItem("token"),
          },
        });
        if (response.ok) {
          alert("Tarefa concluída com sucesso!");
          modalDetalhes.style.display = "none";
          carregarTarefas(disciplinaId);
        } else {
          alert("Erro ao concluir a tarefa.");
        }
      } catch (error) {
        console.error("Erro ao concluir a tarefa:", error);
      }
    });

  // POST de uma nova tarefa no backend
  document
    .getElementById("btn-salvar-tarefa")
    .addEventListener("click", async () => {
      const titulo = document.getElementById("titulo-tarefa").value;
      const disciplinaId = document.getElementById("disciplina-tarefa").value;
      const descricao = document.getElementById("descricao-tarefa").value;
      const dataInicio = document.getElementById("data-inicio").value;
      const dataEntrega = document.getElementById("data-entrega").value;

      if (!titulo.trim() || !disciplinaId) return;

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/disciplinas/disciplinas/${disciplinaId}/atividades/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Token " + localStorage.getItem("token"),
            },
            body: JSON.stringify({
              titulo,
              descricao,
              data_inicio: dataInicio,
              data_entrega: dataEntrega,
              disciplina: parseInt(disciplinaId),
            }),
          }
        );

        if (response.ok) {
          document.getElementById("titulo-tarefa").value = "";
          document.getElementById("disciplina-tarefa").value = "";
          document.getElementById("descricao-tarefa").value = "";
          document.getElementById("data-inicio").value = "";
          document.getElementById("data-entrega").value = "";
          modalTarefa.style.display = "none";
          carregarTarefas(disciplinaId);
        }
      } catch (error) {
        console.log(error);
      }
    });

  // POST para cadastrar uma nova disciplina
  document
    .getElementById("btn-salvar-diciplina")
    .addEventListener("click", async () => {
      const nome = document.getElementById("nome-disciplina").value.trim();
      if (!nome) {
        alert("Por favor, insira um nome para a disciplina.");
        return;
      }

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/disciplinas/disciplinas/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Token " + localStorage.getItem("token"),
            },
            body: JSON.stringify({ nome }),
          }
        );

        if (response.ok) {
          alert("Disciplina cadastrada com sucesso!");
          document.getElementById("nome-disciplina").value = "";
          modalDisciplina.style.display = "none";
          carregarDisciplinas();
        } else {
          const errorData = await response.json();
          alert(
            "Erro ao cadastrar disciplina: " +
              (errorData.detail || "Erro desconhecido")
          );
        }
      } catch (error) {
        console.error("Erro ao salvar disciplina:", error);
        alert("Ocorreu um erro ao tentar salvar a disciplina.");
      }
    });

  // Função para carregar as disciplinas e atualizar os selects
  async function carregarDisciplinas() {
    listaDisciplinas.innerHTML = "";
    disciplinaTarefaSelect.innerHTML =
      "<option value=''>Selecione a disciplina</option>";
    disciplinaEditarSelect.innerHTML =
      "<option value=''>Selecione a disciplina</option>";

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/disciplinas/disciplinas/",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + localStorage.getItem("token"),
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        data.forEach((disc) => {
          const btnDisciplina = document.createElement("button");
          btnDisciplina.classList.add("btn");
          btnDisciplina.textContent = disc.nome;
          listaDisciplinas.appendChild(btnDisciplina);

          const optTarefa = document.createElement("option");
          optTarefa.value = disc.id;
          optTarefa.textContent = disc.nome;
          disciplinaTarefaSelect.appendChild(optTarefa);

          const optEditar = document.createElement("option");
          optEditar.value = disc.id;
          optEditar.textContent = disc.nome;
          disciplinaEditarSelect.appendChild(optEditar);
        });

        if (data.length > 0) {
          carregarTarefas(data[0].id);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar disciplinas:", error);
    }
  }

  // Excluir disciplina
  document
    .getElementById("btn-excluir-disciplina")
    .addEventListener("click", async () => {
      const id = document
        .getElementById("btn-excluir-disciplina")
        .getAttribute("data-id");
      if (!id) return;
      if (!confirm("Tem certeza que deseja excluir esta disciplina?")) return;

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/disciplinas/disciplinas/${id}/`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Token " + localStorage.getItem("token"),
            },
          }
        );
        if (response.ok) {
          alert("Disciplina excluída com sucesso!");
          modalDisciplina.style.display = "none";
          carregarDisciplinas();
        } else {
          alert("Erro ao excluir a disciplina.");
        }
      } catch (error) {
        console.error("Erro ao excluir disciplina:", error);
      }
    });

  // Fecha os modais de forma genérica
  document
    .querySelectorAll(
      ".close-modal, #btn-cancelar, #btn-cancelar-tarefa, #btn-cancelar-editar"
    )
    .forEach((button) => {
      button.addEventListener("click", () => {
        modalDisciplina.style.display = "none";
        modalTarefa.style.display = "none";
        modalDetalhes.style.display = "none";
        modalEditarTarefa.style.display = "none";
      });
    });
  carregarDisciplinas();
  carregarTarefas();
});
