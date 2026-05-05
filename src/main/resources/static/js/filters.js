function filterIngredients(category) {
    const cards = document.querySelectorAll('.ingredient-card');
    const buttons = document.querySelectorAll('.filter-btn');

    // FILTRAR INGREDIENTES
    cards.forEach(card => {
        const cat = card.getAttribute('data-category');

        if (category === 'all' || cat === category) {
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
    if (selectedIngredients.length === 0) return;

    dropZone.innerHTML = `
        <p class="text-sm font-semibold mb-4 text-left w-full">
            — TU TABLA · ${selectedIngredients.length} —
        </p>

        <div class="flex gap-4 flex-wrap justify-center">
            ${selectedIngredients.map(ing => `
                <div class="flex flex-col items-center">
                    <div class="w-16 h-16 bg-white rounded-xl border-2 border-gray-300 shadow-[2px_2px_0px_#9ca3af] flex items-center justify-center">
                        <img src="${ing.img}" class="w-12 h-12 object-contain" />
                    </div>
                    <p class="text-s font-semibold mt-1">${ing.name}</p>
                </div>
            `).join("")}
        </div>
    `;
}

function addIngredient(ing, img) {
    if (selectedIngredients.some(item => item.name === ing)) return;

    selectedIngredients.push({ name: ing, img: img });

    const checkbox = document.querySelector(`input[value="${ing}"]`);
    if (checkbox) checkbox.checked = true;

    const card = document.querySelector(`.ingredient-card[data-name="${ing}"]`);
    if (card) card.style.display = "none";

    renderDropZone();
}
