function mostrarErrorInput(inputId, mensaje) {
  const input = document.getElementById(inputId);
  if (!input) return;

  const inputBox = input.closest(".input-box");
  if (!inputBox) return;

  inputBox.classList.add("has-error");

  let errorDiv = inputBox.querySelector(".error-message");
  if (!errorDiv) {
    errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    inputBox.appendChild(errorDiv);
  }
  errorDiv.textContent = mensaje;
}

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".input-box input").forEach((input) => {
    input.addEventListener("input", () => {
      const inputBox = input.closest(".input-box");
      if (inputBox) {
        inputBox.classList.remove("has-error");
      }

      const globalAlert = document.getElementById("loginGlobalError");
      if (globalAlert) {
        globalAlert.classList.add("hidden");
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const globalAlert = document.getElementById("loginGlobalError");

  if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      if (globalAlert) globalAlert.classList.add("hidden");

      const email = document.getElementById("loginEmail").value;
      const contrasenha = document.getElementById("loginPassword").value;

      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            contrasenha: contrasenha,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("token", data.token);

          const userId =
            data.id || data.usuarioId || (data.usuario && data.usuario.id);
          if (userId) {
            localStorage.setItem("usuarioId", userId);
          }

          const nombre =
            data.nombre || (data.usuario && data.usuario.nombre) || "";
          const apellido =
            data.apellido || (data.usuario && data.usuario.apellido) || "";
          const nombreCompleto = `${nombre} ${apellido}`.trim();

          localStorage.setItem("nombreCompleto", nombreCompleto);

          let rol =
            data.tipoUsuario ||
            data.rol ||
            (data.usuario && data.usuario.tipoUsuario) ||
            "";
          rol = rol.toString().trim().toUpperCase().replace("ROLE_", "");
          localStorage.setItem("tipoUsuario", rol);

          if (rol === "ADMIN") {
            window.location.href = "/pages/admin/dashboard.html";
          } else {
            window.location.href = "/index.html";
          }
        } else {
          if (globalAlert) {
            globalAlert.textContent =
              "El correo o la contraseña son incorrectos.";
            globalAlert.className = "text-sm text-red-500";
            globalAlert.classList.remove("hidden");
            mostrarErrorInput("loginEmail");
            mostrarErrorInput("loginPassword");
          }
        }
      } catch (error) {
        console.error("Error al iniciar sesión: ", error);
        if (globalAlert) {
          globalAlert.textContent =
            "Ocurrió un error al conectar con el servidor.";
          globalAlert.classList.remove("hidden");
        }
      }
    });
  }

  const registroFrom = document.getElementById("registroForm");

  if (registroFrom) {
    registroFrom.addEventListener("submit", async function (e) {
      e.preventDefault();

      const nombre = document.getElementById("registroNombre").value;
      const apellido = document.getElementById("registroApellido").value;
      const email = document.getElementById("registroEmail").value;
      const contrasenha = document.getElementById("registroPassword").value;

      try {
        const response = await fetch("/api/auth/registro", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre: nombre,
            apellido: apellido,
            email: email,
            contrasenha: contrasenha,
          }),
        });

        if (response.ok) {
          alert("¡Usuario registrado con éxito! Ahora podés iniciar sesión.");
          registroFrom.reset();
          goToLoginView();
        } else {
          const mensajeError = await response.text();
          if (
            mensajeError.toLowerCase().includes("correo") ||
            mensajeError.toLowerCase().includes("existe") ||
            response.status === 409
          ) {
            mostrarErrorInput(
              "registroEmail",
              "Este correo electrónico ya se encuentra registrado.",
            );
          } else {
            alert("Error al registrar: " + mensajeError);
          }
        }
      } catch (error) {
        console.error("Error al registrar usuario: ", error);
        alert("Ocurrió un error al procesar el registro");
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const tipoUsuario = localStorage.getItem("tipoUsuario");
  if (tipoUsuario === "ADMIN" || tipoUsuario === "ROLE_ADMIN") {
    document.getElementById("btn-panel-admin")?.classList.remove("hidden");
  } else {
    document.getElementById("btn-panel-admin")?.classList.add("hidden");
  }

  if (tipoUsuario === "ADMIN" || tipoUsuario === "ROLE_ADMIN") {
    document.getElementById("btn-notify")?.classList.remove("hidden");
    document.getElementById("btn-house")?.classList.add("hidden");
  } else {
    document.getElementById("btn-notify")?.classList.add("hidden");
    document.getElementById("btn-house")?.classList.remove("hidden");
  }
});
