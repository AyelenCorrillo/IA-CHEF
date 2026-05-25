const container =
    document.getElementById("historial-container");

const recetas =
    JSON.parse(
        localStorage.getItem("recetasGuardadas")
    ) || [];

recetas.forEach(receta => {

    container.innerHTML += `
        <article>
            <h2>${receta.nombre}</h2>

            <p>
                ${receta.ingredientes
            .map(i => i.nombre ?? i)
            .join(", ")}
            </p>

            <p>${receta.tiempo}</p>

            <p>${receta.porciones}</p>
        </article>
    `;
});

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

    container.innerHTML = "";

    if (recetas.length === 0) {

        container.innerHTML = `
            <p class="text-xl text-gray-500">
                No hay recetas guardadas.
            </p>
        `;

        return;
    }

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

        toggleBtn.addEventListener("click", () => {
            pasosContainer.classList.toggle("hidden");
        });

        const deleteBtn =
            clone.querySelector(".delete-recipe");

        deleteBtn.addEventListener("click", () => {
            eliminarReceta(receta.nombre);
        });

        const saveBtn =
            clone.querySelector(".save-recipe-btn");

        saveBtn.addEventListener("click", () => {
            guardarReceta(receta);
        });

        container.appendChild(clone);
    });
}

document.addEventListener(
    "DOMContentLoaded",
    renderHistorial
);