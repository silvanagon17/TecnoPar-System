const checkbox = document.getElementById("checkbox");

if (localStorage.getItem("theme") === "modo-claro") {
  document.body.classList.add("modo-claro");
  checkbox.checked = true;
}

checkbox.addEventListener("change", () => {
  if (checkbox.checked) {
    document.body.classList.add("modo-claro");
    localStorage.setItem("theme", "modo-claro");
  } else {
    document.body.classList.remove("modo-claro");
    localStorage.setItem("theme", "modo-oscuro");
  }
});


