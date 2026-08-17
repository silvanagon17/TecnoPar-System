/**
 * @param {string} containerId
 * @param {Array} datos
 */

function inicializarCombobox(containerId, datos) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const input = container.querySelector(".combo-input");
  const hiddenInput = container.querySelector(".combo-value");
  const button = container.querySelector(".combo-button");
  const optionsContainer = container.querySelector(".combo-options");

  let optionSelected = null;

  function renderOptions(filtro = "") {
    optionsContainer.innerHTML = "";

    const filtradas = datos.filter((item) =>
      item.nombre.toLowerCase().includes(filtro.toLowerCase()),
    );
    if (filtradas.length === 0) {
      optionsContainer.innerHTML = `<li class="relative cursor-default select-none py-2 px-4">No se escontraron opciones</li>`;
      return;
    }

    filtradas.forEach((item) => {
      const li = document.createElement("li");
      li.className =
        "relative li-option cursor-pointer select-none py-2 px-3  transition-colors duration-100";
      li.innerText = item.nombre;

      li.addEventListener("click", (e) => {
        e.stopPropagation();
        input.value = item.nombre;
        hiddenInput.value = item.id;
        optionSelected = item;
        optionsContainer.classList.add("hidden");

        hiddenInput.dispatchEvent(new Event("change"));
      });

      optionsContainer.appendChild(li);
    });
  }

  input.addEventListener("focus", () => {
    renderOptions(input.value);
    optionsContainer.classList.remove("hidden");
  });

  input.addEventListener("input", (e) => {
    if (e.target.value === "") {
      hiddenInput.value = "";
      optionSelected = null;
      hiddenInput.dispatchEvent(new Event("change"));
    }
    renderOptions(e.target.value);
    optionsContainer.classList.remove("hidden");
  });

  button.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = !optionsContainer.classList.contains("hidden");
    if (isOpen) {
      optionsContainer.classList.add("hidden");
    } else {
      input.focus();
    }
  });

  document.addEventListener("click", (e) => {
    if (!container.contains(e.target)) {
      optionsContainer.classList.add("hidden");

      if (!optionSelected && hiddenInput.value) {
        optionSelected =
          datos.find((item) => String(item.id) === String(hiddenInput.value)) ||
          null;
      }

      if (optionSelected) {
        input.value = optionSelected.nombre;
      } else {
        const valor = hiddenInput.value !== "";
        input.value = "";
        hiddenInput.value = "";

        if (valor) {
          hiddenInput.dispatchEvent(new Event("change"));
        }
      }
    }
  });
}
