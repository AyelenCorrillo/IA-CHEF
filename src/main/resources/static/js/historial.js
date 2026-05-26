function obtenerRecetasGuardadas() {
    return JSON.parse(
        localStorage.getItem("recetasGuardadas")
    ) || [];
}

function eliminarReceta(nombre) {

    const recetas =
        obtenerRecetasGuardadas();

    const actualizadas =
        recetas.filter(
            receta => receta.nombre !== nombre
        );

    localStorage.setItem(
        "recetasGuardadas",
        JSON.stringify(actualizadas)
    );

    renderHistorial();
}

function renderHistorial() {

    const container =
        document.getElementById("historial-container");

    const template =
        document.getElementById("recipe-template");

    const recetas =
        obtenerRecetasGuardadas();

    const emptyState =
        document.getElementById("empty-state");

    container.innerHTML = "";

    if (recetas.length === 0) {

        emptyState.classList.remove("hidden");
        container.classList.add("hidden");

        return;
    }

    emptyState.classList.add("hidden");
    container.classList.remove("hidden");
    container.classList.add("flex");

    recetas.forEach(receta => {

        const clone =
            template.content.cloneNode(true);

        clone.querySelector(".recipe-title")
            .textContent = receta.nombre;

        clone.querySelector(".recipe-desc")
            .textContent =
            receta.ingredientes
                .map(i => i.nombre ?? i)
                .join(", ");

        clone.querySelector(".recipe-time")
            .textContent = receta.tiempo;

        clone.querySelector(".recipe-servings")
            .textContent = receta.porciones;

        const pasosContainer =
            clone.querySelector(".recipe-steps");

        pasosContainer.innerHTML =
            receta.pasos
                .map((paso, index) => `
                    <div>
                        <strong>${index + 1}.</strong>
                        ${paso}
                    </div>
                `)
                .join("");

        const toggleBtn =
            clone.querySelector(".recipe-toggle");

        const arrow =
            clone.querySelector(".recipe-arrow");

        const text =
            clone.querySelector(".recipe-text");

        const hat =
            clone.querySelector(".recipe-hat");

        toggleBtn.addEventListener("click", () => {

            const abierto =
                pasosContainer.classList.toggle("hidden");

            arrow.classList.toggle("rotate-180");

            text.classList.toggle("text-[#CC754F]");
            text.classList.toggle("text-[#6E8B4E]");

            hat.src = abierto
                ? "/images/chef-hat-green.png"
                : "/images/chef-hat-orange.png";

            arrow.src = abierto
                ? "/images/down-arrow-green.png"
                : "/images/down-arrow-orange.png";
        });

        const deleteBtn =
            clone.querySelector(".delete-recipe");

        deleteBtn.addEventListener("click", () => {
            eliminarReceta(receta.nombre);
        });

        container.appendChild(clone);
    });
}

document.addEventListener(
    "DOMContentLoaded",
    renderHistorial
);