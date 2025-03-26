document.addEventListener("DOMContentLoaded", () => {
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
  
    window.mostrarCadastro = function () {
      document.getElementById("login-box").classList.add("hidden");
      document.getElementById("cadastro-box").classList.remove("hidden");
    };
  
    window.mostrarLogin = function () {
      document.getElementById("cadastro-box").classList.add("hidden");
      document.getElementById("login-box").classList.remove("hidden");
    };
  
    document
      .getElementById("login-button")
      .addEventListener("click", async () => {
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
  });
  