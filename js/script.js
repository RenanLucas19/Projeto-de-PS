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
            modalDetalhes.style.display = "flex";
            document
              .getElementById("btn-editar-tarefa")
              .addEventListener("click", () => {
                document.getElementById("titulo-editar").value = tarefa.titulo;
                disciplinaEditarSelect.value = tarefa.disciplina_id || "";
                document.getElementById("descricao-editar").value =
                  tarefa.descricao;
                document.getElementById("data-inicio-editar").value =
                  tarefa.data_inicio;
                document.getElementById("data-entrega-editar").value =
                  tarefa.data_entrega;
                modalEditarTarefa.style.display = "flex";
              });
          });
          listaTarefas.appendChild(tarefaItem);
        });
      }
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);
    }
  }
  
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
  
    // POST de uma nova disciplina
    document.getElementById("btn-salvar-diciplina").addEventListener("click", async () => {
      const nome = document.getElementById("nome-disciplina").value.trim();
  
      // Verifica se o nome da disciplina não está vazio
      if (!nome) {
          alert("Por favor, insira um nome para a disciplina.");
          return;
      }
  
      try {
          const response = await fetch("http://127.0.0.1:8000/api/disciplinas/disciplinas/", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  Authorization: "Token " + localStorage.getItem("token"), // Confirma se o token está sendo enviado corretamente
              },
              body: JSON.stringify({ nome }),  // Corpo da requisição com o nome da disciplina
          });
  
          if (response.ok) {
              const data = await response.json();
              alert("Disciplina cadastrada com sucesso!");
  
              // Limpar o campo e fechar o modal
              document.getElementById("nome-disciplina").value = "";
              modalDisciplina.style.display = "none";
  
              // Atualizar o select de disciplinas
              carregarDisciplinas();
          } else {
              // Exibe uma mensagem de erro caso a resposta não seja ok
              const errorData = await response.json();
              alert("Erro ao cadastrar disciplina: " + (errorData.detail || "Erro desconhecido"));
          }
      } catch (error) {
          console.error("Erro ao salvar disciplina:", error);
          alert("Ocorreu um erro ao tentar salvar a disciplina.");
      }
  });
  
  
  async function carregarDisciplinas() {
    listaDisciplinas.innerHTML = "";
    disciplinaTarefaSelect.innerHTML = "<option value=''>Selecione a disciplina</option>";
    disciplinaEditarSelect.innerHTML = "<option value=''>Selecione a disciplina</option>";
  
    try {
        const response = await fetch("http://127.0.0.1:8000/api/disciplinas/disciplinas/", {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Token " + localStorage.getItem("token"),
            },
        });
  
        if (response.ok) {
            const data = await response.json();
            data.forEach((disc) => {
                // Criando botão para cada disciplina (para visualização)
                const btnDisciplina = document.createElement("button");
                btnDisciplina.classList.add("btn");
                btnDisciplina.textContent = disc.nome;
                listaDisciplinas.appendChild(btnDisciplina);
  
                // Adicionando opções no select de tarefas
                const optTarefa = document.createElement("option");
                optTarefa.value = disc.id;
                optTarefa.textContent = disc.nome;
                disciplinaTarefaSelect.appendChild(optTarefa);
  
                // Adicionando opções no select de edição de tarefas
                const optEditar = document.createElement("option");
                optEditar.value = disc.id;
                optEditar.textContent = disc.nome;
                disciplinaEditarSelect.appendChild(optEditar);
            });
  
            if (data.length > 0) {
                carregarTarefas(data[0].id); // Carrega tarefas da primeira disciplina
            }
        }
    } catch (error) {
        console.error("Erro ao carregar disciplinas:", error);
    }
  }
          // Adiciona eventos aos botões de exclusão
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
  
    async function excluirDisciplina(id) {
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
          carregarDisciplinas(); // Recarrega a lista após a exclusão
        } else {
          alert("Erro ao excluir a disciplina.");
        }
      } catch (error) {
        console.error("Erro ao excluir disciplina:", error);
      }
    }
    
  
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
  
    // Chama as funções de carregamento
    carregarDisciplinas();
    carregarTarefas();
  });
  
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
                    <small>Início: ${tarefa.data_inicio || "N/A"} | Entrega: ${tarefa.data_entrega || "N/A"}</small>
                `;
                tarefaItem.addEventListener("click", () => {
                    // Mostrar os detalhes da tarefa no modal
                    document.getElementById("titulo-tarefa-modal").textContent = tarefa.titulo;
                    document.getElementById("disciplina-tarefa-modal").textContent = tarefa.disciplina || "Não informada";
                    document.getElementById("descricao-tarefa-modal").textContent = tarefa.descricao || "Sem descrição";
                    document.getElementById("data-inicio-modal").textContent = tarefa.data_inicio || "Não definida";
                    document.getElementById("data-entrega-modal").textContent = tarefa.data_entrega || "Não definida";
                    // Armazenar o ID da tarefa no modal para usá-lo na exclusão
                    document.getElementById("titulo-tarefa-modal").dataset.tarefaId = tarefa.id;
                    modalDetalhes.style.display = "flex";
                });
                listaTarefas.appendChild(tarefaItem);
            });
        }
    } catch (error) {
        console.error("Erro ao carregar tarefas:", error);
    }
  }
  
  
  // Funções de login/cadastro (se estiverem na mesma página)
  function mostrarCadastro() {
    document.getElementById("login-box").classList.add("hidden");
    document.getElementById("cadastro-box").classList.remove("hidden");
  }
  
  function mostrarLogin() {
    document.getElementById("cadastro-box").classList.add("hidden");
    document.getElementById("login-box").classList.remove("hidden");
  }
  
  function exibirMensagem(mensagem, tipo = "erro") {
    const container = document.querySelector(".container");
    const mensagemElement = document.createElement("div");
    mensagemElement.classList.add("mensagem", tipo);
    mensagemElement.innerText = mensagem;
    container.appendChild(mensagemElement);
    setTimeout(() => {
      mensagemElement.remove();
    }, 3000);
  }
  
  document.getElementById("login-button").addEventListener("click", async () => {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
  
    try {
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        exibirMensagem("Login realizado com sucesso!", "sucesso");
        window.location.href = "painel.html";
      } else {
        const errorData = await response.json();
        exibirMensagem(errorData.non_field_errors || "Erro ao fazer login.");
      }
    } catch (error) {
      exibirMensagem("Erro ao conectar com o servidor.");
    }
  });
  
  document
    .getElementById("cadastro-button")
    .addEventListener("click", async () => {
      const nome = document.getElementById("cadastro-nome").value;
      const email = document.getElementById("cadastro-email").value;
      const senha = document.getElementById("cadastro-senha").value;
  
      try {
        const response = await fetch("http://127.0.0.1:8000/api/usuarios/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: email, nome, password: senha }),
        });
        if (response.ok) {
          exibirMensagem("Cadastro realizado com sucesso!", "sucesso");
          mostrarLogin();
        } else {
          const errorData = await response.json();
          exibirMensagem(
            errorData.username || errorData.email || "Erro ao cadastrar."
          );
        }
      } catch (error) {
        exibirMensagem("Erro ao conectar com o servidor.");
      }
    });
  