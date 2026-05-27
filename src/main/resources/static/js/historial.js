document.addEventListener('DOMContentLoaded', async () => {
    cargarRecetasFavoritas();
});

// Separamos la carga en una función independiente para poder refrescar la grilla al borrar
async function cargarRecetasFavoritas() {
    const token = localStorage.getItem('token');
    const contenedor = document.getElementById('historial-container');

    if (!token) {
        alert('Para ver tus recetas favoritas, necesitas iniciar sesión.');
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
                contenedor.innerHTML = `
                            <div class="text-center py-12 bg-white rounded-2xl border border-[#E4DFD8] p-6">
                                <p class="text-[#5C544C] font-medium mb-2">Tu libro de favoritas está vacío.</p>
                                <a href="/" class="text-sm text-[#5B833F] font-bold hover:underline">Ir a cocinar →</a>
                            </div>
                        `;
                return;
            }

            contenedor.innerHTML = "";
            recetas.forEach(receta => {
                const tarjeta = document.createElement('article');
                tarjeta.className = "bg-white p-6 md:p-8 rounded-2xl border-2 border-[#D9D1C7] shadow-[4px_4px_0_#D9D1C7] mb-6";

                const lineasLimpias = receta.cuerpoReceta
                    .split('\n')
                    .map(linea => linea.trim())
                    .filter(linea => linea.length > 0);

                // ESTRUCTURA CON EL BOTÓN ELIMINAR INCORPORADO EN EL ENCABEZADO
                let contenidoHTML = `
                            <div class="flex flex-row justify-between items-center mb-6 border-b-2 border-dashed border-[#E4DFD8] pb-4">
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-full bg-[#E5EFD7] flex items-center justify-center border border-[#9DB27C]">
                                        <img src="/images/chef-hat-green.png" class="w-5 h-5">
                                    </div>
                                    <h3 class="text-xl md:text-2xl font-bold text-[#4B3425] font-fraunces italic">${receta.titulo}</h3>
                                </div>
                                
                                <button onclick="ejecutarEliminacion(${receta.id}, '${receta.titulo}')" 
                                        class="text-xs md:text-sm font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl transition-colors cursor-pointer border border-red-200">
                                    ✕ Eliminar
                                </button>
                            </div>
                            <div class="space-y-4 font-gantari text-[#5C544C]">
                        `;

                lineasLimpias.forEach(linea => {
                    if (/^\d+\.?$/.test(linea)) {
                        contenidoHTML += `<p class="font-bold text-[#5B833F] text-base mt-2">${linea}</p>`;
                    } else {
                        contenidoHTML += `<p class="text-sm md:text-base leading-relaxed pl-2 border-l-2 border-[#E5EFD7] mb-3">${linea}</p>`;
                    }
                });

                contenidoHTML += `</div>`;
                tarjeta.innerHTML = contenidoHTML;
                contenedor.appendChild(tarjeta);
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
            alert('🗑️ Receta eliminada del libro con éxito.');
            cargarRecetasFavoritas(); // Volvemos a renderizar la lista actualizada sin recargar la página entera
        } else {
            alert('No se pudo eliminar la receta. Intente nuevamente.');
        }
    } catch (error) {
        console.error('Error al borrar receta:', error);
        alert('Error de conexión con el servidor.');
    }
}