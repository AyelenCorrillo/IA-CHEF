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
        'Otros': 'Otros'
    };
    return map[category];
}

window.addEventListener("DOMContentLoaded", () => {
    filterIngredients('all');
});