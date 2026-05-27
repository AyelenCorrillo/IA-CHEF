function filterIngredients(category) {
    const cards = document.querySelectorAll('.ingredient-card');
    const buttons = document.querySelectorAll('.filter-btn');

    // FILTRAR INGREDIENTES
    cards.forEach(card => {
        const cat = card.getAttribute('data-category');

        const ingredientName = card.dataset.name;

        const alreadySelected = selectedIngredients.some(
            item => item.name === ingredientName
        );

        if (
            (category === 'all' || cat === category)
            && !alreadySelected
        ) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });

    buttons.forEach(btn => {
        btn.classList.remove(
            'bg-[#5B833F]',
            'text-[#EEEEE3]',
            'border-black',
            'shadow-[2px_2px_0px_black]'
        );

        btn.classList.add('bg-white', 'border-[#E0DEDD]');
    });

    const activeBtn = Array.from(buttons).find(btn =>
        btn.textContent.includes(getLabel(category))
    );

    if (activeBtn) {
        activeBtn.classList.add(
            'bg-[#5B833F]',
            'text-[#EEEEE3]',
            'border-black',
            'shadow-[2px_2px_0px_black]'
        );

        activeBtn.classList.remove('bg-white', 'border-[#E0DEDD]');
    }
}

function getLabel(category) {
    const map = {
        'all': 'Todos',
        'Verduras': 'Verduras',
        'Frutas': 'Frutas',
        'Proteinas': 'Proteínas',
        'Lacteos': 'Lácteos',
        'Legumbres': 'Legumbres',
        'Otros': 'Otros'
    };
    return map[category];
}

window.addEventListener("DOMContentLoaded", () => {
    filterIngredients('all');
});


const dropZone = document.getElementById("drop-zone");

let selectedIngredients = [];

document.querySelectorAll(".ingredient-card").forEach(card => {

    card.addEventListener("dragstart", (e) => {
        const data = {
            name: card.dataset.name,
            img: card.querySelector("img").src
        };

        e.dataTransfer.setData("ingredient", JSON.stringify(data));
    });

    card.addEventListener("click", () => {
        const ing = card.dataset.name;
        const img = card.querySelector("img").src;
        addIngredient(ing, img);
    });
});

dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add(
        "border-orange-400",
        "shadow-[8px_8px_0px_#f59e0b]"
    );
});

dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove(
        "border-orange-400",
        "shadow-[8px_8px_0px_#f59e0b]"
    );
});

dropZone.addEventListener("drop", (e) => {
    e.preventDefault();

    const raw = e.dataTransfer.getData("ingredient");
    console.log("DATA:", raw);

    if (!raw) return;

    const data = JSON.parse(raw);

    addIngredient(data.name, data.img);

    dropZone.classList.remove(
        "border-orange-400",
        "shadow-[8px_8px_0px_#f59e0b]"
    );
});

function renderDropZone() {
    dropZone.classList.remove("justify-center");
    dropZone.classList.add("justify-start");


    if (selectedIngredients.length === 0) {
        dropZone.classList.remove("justify-start");
        dropZone.classList.add("justify-center");

        dropZone.innerHTML = `
            <img src="/images/tomate-icon.png" alt="Tomate Icon">

            <p class="text-lg font-semibold text-gray-800">
                Tu tabla está vacía
            </p>

            <p class="text-sm text-gray-500 mt-1">
                Arrastrá o hace click - mínimo 2 ingredientes
            </p>
        `;
        return;
    }

    dropZone.innerHTML = `
    <div class="w-full flex flex-col items-start justify-start">

        <p class="text-sm font-semibold mb-4">
            — TU TABLA · ${selectedIngredients.length} —
        </p>

        <div class="flex gap-4 flex-wrap justify-start">
            ${selectedIngredients.map(ing => `
                <div class="flex flex-col items-center relative group">

                    <button onclick="removeIngredient('${ing.name}')"
                        class="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 border-2 border-black text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        ✕
                    </button>

                    <div class="w-16 h-16 bg-gray-100 rounded-xl border-2 border-gray-300 shadow-[2px_2px_0px_#9ca3af] flex items-center justify-center">
                        <img src="${ing.img}" class="w-12 h-12 object-contain" />
                    </div>

                    <p class="text-s font-semibold mt-1">${ing.name}</p>
                </div>
            `).join("")}
        </div>
    </div>
`;
}


function addIngredient(ing, img) {

    hideError();

    const checkbox = document.querySelector(`input[data-name="${ing}"]`);

    if (checkbox) {
        checkbox.checked = true;
        console.log("CHECKED:", ing);
    } else {
        console.log("NO ENCONTRADO:", ing);
    }

    if (selectedIngredients.some(item => item.name === ing)) return;

    selectedIngredients.push({ name: ing, img });

    const card =
        document.querySelector(`.ingredient-card[data-name="${ing}"]`);

    if (card) {
        card.style.display = "none";
    }

    updateGenerateButton();
    renderDropZone();
}

function removeIngredient(name) {

    selectedIngredients = selectedIngredients.filter(item => item.name !== name);

    const card = document.querySelector(`.ingredient-card[data-name="${name}"]`);
    if (card) card.style.display = "block";

    const checkbox = document.querySelector(`input[value="${name}"]`);
    if (checkbox) checkbox.checked = false;

    updateGenerateButton();
    renderDropZone();
}

const searchInput = document.getElementById('ingredientSearch');
const ingredientCards = document.querySelectorAll('.ingredient-card');

searchInput.addEventListener('input', () => {
    const searchText = searchInput.value.toLowerCase();

    ingredientCards.forEach(card => {
        const ingredientName = card.textContent.toLowerCase();

        if (ingredientName.includes(searchText)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});

function renderRecipes(recetas) {

    const container = document.getElementById("recipes-container");
    const template = document.getElementById("recipe-template");

    container.innerHTML = "";

    recetas.forEach(receta => {

        const clone = template.content.cloneNode(true);

        clone.querySelector(".recipe-title").textContent =
            receta.nombre;

        clone.querySelector(".recipe-desc").textContent =
            receta.ingredientes.map(i => i.nombre ?? i).join(", ");

        clone.querySelector(".recipe-time").textContent =
            receta.tiempo;

        clone.querySelector(".recipe-servings").textContent =
            receta.porciones;

        // PASOS
        const pasosContainer =
            clone.querySelector(".recipe-steps");

        pasosContainer.innerHTML = receta.pasos
            .map((paso, index) => `
                <div class="flex gap-2">
                    <span class="font-bold text-[#6E8B4E]">
                        ${index + 1}.
                    </span>

                    <p>${paso}</p>
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

            // cambiar color flecha
            arrow.classList.toggle("brightness-0");
            arrow.classList.toggle("sepia");
            arrow.classList.toggle("saturate-[5]");
            arrow.classList.toggle("hue-rotate-[340deg]");

            // cambiar imagen gorrito
            hat.src = abierto
                ? "/images/chef-hat-green.png"
                : "/images/chef-hat-orange.png";

            arrow.src = abierto
                ? "/images/down-arrow-green.png"
                : "/images/down-arrow-orange.png";
        });

        container.appendChild(clone);
    });
}


document.getElementById("generate-recipes").addEventListener("click", async (e) => {

    e.preventDefault();

    if (selectedIngredients.length < 2) {
        showError("Seleccioná al menos 2 ingredientes.");
        return;
    }

    const button = document.getElementById("generate-recipes");

    button.disabled = true;

    button.innerHTML = `
    <div class="flex items-center justify-center gap-2">
        <img src="/images/star_icon.png" class="w-5 h-5">
        <span>Cocinando ideas...</span>
    </div>
`;

    button.classList.remove(
        "bg-[#5B833F]",
        "text-[#EEEEE3]"
    );

    button.classList.add(
        "bg-[#B7C7A1]",
        "text-white",
        "cursor-not-allowed"
    );

    button.classList.add("animate-pulse");

    const ingredientes = Array.from(
        document.querySelectorAll(
            'input[name="ingredientesSeleccionados"]:checked'
        )
    ).map(i => i.value);

    hideError();

    try {

        const res = await fetch("/generar-recetas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ ingredientes })
        });

        if (!res.ok) {
            throw new Error("Error en la respuesta del servidor");
        }

        const recetas = await res.json();

        if (!recetas || recetas.length === 0) {
            throw new Error("La IA devolvió una respuesta vacía");
        }

        const seccion = document.getElementById("recetas");

        seccion.classList.remove("hidden");

        renderRecipes(recetas);

        seccion.scrollIntoView({
            behavior: "smooth"
        });

    } catch (error) {

        console.error(error);

        if (error.message.includes("vacía")) {
            showError("No se pudieron generar recetas con esos ingredientes.");
        } else {
            showError("Error de conexión. Intentá nuevamente.");
        }

    }

    finally {

        button.disabled = false;

        button.innerHTML = "Generar 3 recetas";

        button.classList.remove(
            "bg-[#B7C7A1]",
            "cursor-not-allowed"
        );

        button.classList.add(
            "bg-[#5B833F]",
            "text-[#EEEEE3]"
        );

        button.classList.remove("animate-pulse");

    }

});

function updateGenerateButton() {

    const button =
        document.getElementById("generate-recipes");

    button.disabled = selectedIngredients.length < 2;
}

function showError(message) {
    const errorBox = document.getElementById("error-message");

    errorBox.textContent = message;
    errorBox.classList.remove("hidden");
}

function hideError() {
    const errorBox = document.getElementById("error-message");

    errorBox.classList.add("hidden");
}

document.addEventListener('DOMContentLoaded', () => {
    verificarEstadoSesion();
    activarEscuchadoresDeRecetas();
});

// 1. COMPROBAR EL ESTADO DE LA SESIÓN EN EL NAVBAR
function verificarEstadoSesion() {
    const token = localStorage.getItem('token');
    const nombre = localStorage.getItem('usuario_nombre');
    const menu = document.getElementById('contenedor-autenticacion');

    if (token && nombre) {
        if (menu) {
            menu.innerHTML = `
                        <span class="text-sm text-gray-600 font-medium">Hola, <b class="text-[#5B833F]">${nombre}</b></span>
                        <button onclick="cerrarSesion()" class="text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-xl border border-red-200 transition-colors cursor-pointer ml-2">
                            Salir
                        </button>
                    `;
        }
    }

    const mobileAuth = document.getElementById("mobile-auth");
    const mobileUserInfo = document.getElementById("mobile-user-info");
    const mobileLogin = document.getElementById("mobile-login-link");

    if (token && nombre) {

        if (mobileUserInfo) {
            mobileUserInfo.innerHTML = `
            <div class="pb-3 border-b border-[#E4DFD8]">
                Hola, <span class="font-bold text-[#5B833F]">${nombre}</span>
            </div>
        `;
        }

        if (mobileLogin) {
            mobileLogin.remove();
        }

        if (mobileAuth) {
            mobileAuth.innerHTML = `
            <button
                onclick="cerrarSesion()"
                class="w-full text-left text-red-500 font-medium cursor-pointer">
                Salir
            </button>
        `;
        }
    }

}

function cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario_nombre');
    alert('Sesión cerrada. Ahora estás navegando de forma anónima.');
    window.location.reload();
}

// 3. LOGICA QUE INYECTA LOS BOTONES DE GUARDAR EN LAS TARJETAS DE ELI
function activarEscuchadoresDeRecetas() {
    const contenedorPadre = document.getElementById('recipes-container');
    if (!contenedorPadre) return;

    const ComicObserver = new MutationObserver(() => {
        const tarjetas = contenedorPadre.querySelectorAll('article');
        tarjetas.forEach(tarjeta => {
            let botonFavorito = tarjeta.querySelector('.btn-guardar-receta');

            if (!botonFavorito) {
                const contenedorBotones = tarjeta.querySelector('.p-4, .p-6') || tarjeta;
                const divBoton = document.createElement('div');
                divBoton.className = "mt-auto pt-4 border-t border-dashed border-gray-200";
                divBoton.innerHTML = `
                            <button class="btn-guardar-receta w-full flex items-center justify-center gap-2 px-4 py-2 text-xs md:text-sm bg-white text-[#5B833F] font-bold rounded-xl border border-[#9DB27C] transition-all duration-200 hover:bg-[#E5EFD7] cursor-pointer">
                                <img src="/images/star_icon.png" class="w-3.5 h-3.5 opacity-80" style="filter: invert(47%) sepia(18%) saturate(1081%) hue-rotate(54deg) brightness(93%) contrast(85%);">
                                <span>Guardar en mis favoritas</span>
                            </button>
                        `;
                contenedorBotones.appendChild(divBoton);
                botonFavorito = divBoton.querySelector('.btn-guardar-receta');
            }

            if (botonFavorito && !botonFavorito.dataset.conectado) {
                botonFavorito.dataset.conectado = "true";
                botonFavorito.addEventListener('click', () => {
                    const tituloReceta = tarjeta.querySelector('.recipe-title').innerText;
                    const instruccionesReceta = tarjeta.querySelector('.recipe-steps').innerText || tarjeta.querySelector('.recipe-desc').innerText;

                    // Disparamos la verificación inteligente
                    procesarGuardadoFavorito(tituloReceta, instruccionesReceta);
                });
            }
        });
    });
    ComicObserver.observe(contenedorPadre, { childList: true });
}

// 3. INTELIGENCIA DEL BOTÓN: ¿Logueado o Anónimo?
function procesarGuardadoFavorito(titulo, cuerpo) {
    const token = localStorage.getItem('token');

    if (!token) {
        // Si es un usuario visitante: Guardamos la receta en el limbo temporal
        const recetaTemporal = { titulo: titulo, cuerpoReceta: cuerpo };
        sessionStorage.setItem('receta_pendiente', JSON.stringify(recetaTemporal));

        alert('¡Qué rico plato! Para poder guardar esta receta en tu historial de Favoritos, necesitas iniciar sesión.');
        // Lo mandamos a la pantalla externa de Login/Registro
        window.location.href = "/login";
    } else {
        // Si ya inició sesión: Despachamos directo a la base de datos de usuarios
        despacharHaciaPostgres(titulo, cuerpo, token);
    }
}

// 4. PETICIÓN REST SEgURA CON TOKEN JWT
async function despacharHaciaPostgres(titulo, cuerpoReceta, token) {
    try {
        const response = await fetch('/api/recetas/guardar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Adjuntamos las credenciales seguras
            },
            body: JSON.stringify({
                titulo: titulo,
                cuerpoReceta: cuerpoReceta
            })

        });

        // Verificamos si el servidor nos devolvió una respuesta con error antes de parsear
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Detalle del error en el servidor:", errorData);
            alert('No se pudo guardar la receta. Tu sesión puede haber expirado.');
            return;
        }

        const data = await response.json();
        alert('✨ ¡Espectacular! La receta se guardó correctamente en tus Favoritos.');

    } catch (error) {
        // Esto te va a mostrar en la consola F12 el motivo exacto si la red falla
        console.error('Error completo atrapado en el catch:', error);
        alert('Error de conexión con el servidor.');
    }
}


const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
});