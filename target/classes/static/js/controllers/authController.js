document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();

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
        }
      } catch (error) {
        console.error("Error al iniciar sesión: ", error);
        alert("Ocurrió un error al conectar con el servidor.");
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
        } else {
          const mensajeError = await response.text();
          alert("Error al registrar: " + mensajeError);
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
  const btnPanelAdmin = document.getElementById("btn-panel-admin"); // Asegúrate de darle este ID a tu botón o enlace en el HTML

  if (btnPanelAdmin) {
    if (tipoUsuario === "ADMIN") {
      btnPanelAdmin.style.display = "flex"; // O "flex" / "inline-block" según tu diseño CSS
    } else {
      btnPanelAdmin.style.display = "none"; // Lo oculta completamente para clientes
    }
  }
});
