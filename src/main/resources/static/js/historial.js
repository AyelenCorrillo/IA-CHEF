document.addEventListener('DOMContentLoaded', async () => {
    cargarRecetasFavoritas();
});

// Separamos la carga en una función independiente para poder refrescar la grilla al borrar
async function cargarRecetasFavoritas() {
    const token = localStorage.getItem('token');
    const contenedorMensajes =
        document.getElementById('historial-container');

    const recipesGrid =
        document.getElementById('recipes-grid');

    if (!token) {
        sessionStorage.setItem(
            'toast',
            'Para ver tus recetas favoritas, necesitas iniciar sesión.'
        );

        window.location.href = '/login';

        return;
    }

    try {
        const response = await fetch('/api/recetas/favoritas', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const recetas = await response.json();

            if (recetas.length === 0) {
                contenedorMensajes.innerHTML = `
                            <div class="text-center py-12 bg-white rounded-2xl border border-[#E4DFD8] p-6">
                                <p class="text-[#5C544C] font-medium mb-2">Tu libro de favoritas está vacío.</p>
                                <a href="/" class="text-sm text-[#5B833F] font-bold hover:underline">Ir a cocinar →</a>
                            </div>
                        `;

                recipesGrid.innerHTML = "";
                return;
            }

            contenedorMensajes.innerHTML = "";
            recipesGrid.innerHTML = "";

            recetas.forEach(receta => {

                const template = document.getElementById('recipe-template');

                const clone = template.content.cloneNode(true);

                // TITULO
                clone.querySelector('.recipe-title').textContent = receta.titulo;

                clone.querySelector('.recipe-desc').textContent =
                    receta.ingredientes || "Ingredientes no disponibles";

                clone.querySelector('.recipe-time').textContent =
                    receta.tiempo || "30 min";

                clone.querySelector('.recipe-servings').textContent =
                    receta.porciones || "2 personas";

                // PASOS
                // PASOS
                const contenedorPasos =
                    clone.querySelector('.recipe-steps');

                const pasos = (receta.pasos || "")
                    .split('\n')
                    .filter(paso => paso.trim().length > 0);

                contenedorPasos.innerHTML = pasos
                    .map((paso, index) => `
        <div class="flex gap-2">
            <span class="font-bold text-[#6E8B4E]">
                ${index + 1}.
            </span>

            <p>${paso}</p>
        </div>
    `)
                    .join("");

                // TOGGLE
                const toggleBtn =
                    clone.querySelector('.recipe-toggle');

                const arrow =
                    clone.querySelector('.recipe-arrow');

                const text =
                    clone.querySelector('.recipe-text');

                const hat =
                    clone.querySelector('.recipe-hat');

                toggleBtn.addEventListener('click', () => {

                    const abierto =
                        contenedorPasos.classList.toggle('hidden');

                    arrow.classList.toggle('rotate-180');

                    text.classList.toggle('text-[#CC754F]');
                    text.classList.toggle('text-[#6E8B4E]');

                    arrow.classList.toggle("brightness-0");
                    arrow.classList.toggle("sepia");
                    arrow.classList.toggle("saturate-[5]");
                    arrow.classList.toggle("hue-rotate-[340deg]");

                    hat.src = abierto
                        ? "/images/chef-hat-green.png"
                        : "/images/chef-hat-orange.png";

                    arrow.src = abierto
                        ? "/images/down-arrow-green.png"
                        : "/images/down-arrow-orange.png";
                });

                // BOTON ELIMINAR
                const botonEliminar = clone.querySelector('.recipe-delete');

                botonEliminar.addEventListener('click', () => {
                    ejecutarEliminacion(receta.id, receta.titulo);
                });

                recipesGrid.appendChild(clone);

            });

        } else {
            localStorage.clear();
            window.location.href = '/login';
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// FUNCIÓN ASÍNCRONA QUE DISPARA EL BORRADO AL BACKEND
async function ejecutarEliminacion(idReceta, tituloReceta) {
    // Confirmación de cortesía para evitar borrados accidentales
    const confirmar = confirm(`¿Estás segura de que querés eliminar "${tituloReceta}" de tus favoritas?`);
    if (!confirmar) return;

    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`/api/recetas/eliminar/${idReceta}`, {
            method: 'POST', // Tipo de petición correspondiente
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            mostrarToast('🗑️ Receta eliminada del libro con éxito.');
            cargarRecetasFavoritas(); // Volvemos a renderizar la lista actualizada sin recargar la página entera
        } else {
            mostrarToast('No se pudo eliminar la receta. Intente nuevamente.');
        }
    } catch (error) {
        console.error('Error al borrar receta:', error);
        mostrarToast('Error de conexión con el servidor.');
    }
}