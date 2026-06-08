/**
 * GLOBALE VARIABLEN FÜR PAGINIERUNG
 */
let currentPage = 1;
let itemsPerPage = 12; // Standardwert
let activeCategory = 'all';

document.addEventListener('DOMContentLoaded', function() {
    // Wenn wir auf der Archiv-Seite sind, initialisieren wir die Ansicht
    if (document.getElementById('paginationControls')) {
        updatePagination();
    }
});

/**
 * Sortierfunktion für das Fall-Archiv
 * type: 'name', 'provider' oder 'rating'
 */
function sortRooms(type) {
    const grid = document.getElementById('roomGrid');
    if (!grid) return;

    const items = Array.from(grid.getElementsByClassName('room-card-link'));

    // Sortieren
    items.sort((a, b) => {
        let valA, valB;

        if (type === 'rating') {
            valA = parseFloat(a.dataset.rating);
            valB = parseFloat(b.dataset.rating);
            return valB - valA; // Absteigend
        } else if (type === 'name') {
            valA = a.dataset.title;
            valB = b.dataset.title;
            return valA.localeCompare(valB);
        } else if (type === 'provider') {
            valA = a.dataset.provider;
            valB = b.dataset.provider;
            return valA.localeCompare(valB);
        }
    });

    // Neu ins DOM einfügen (dadurch ändert sich die Reihenfolge)
    items.forEach(item => grid.appendChild(item));

    // WICHTIG: Nach dem Sortieren springen wir auf Seite 1 und aktualisieren die Ansicht
    if (document.getElementById('paginationControls')) {
        currentPage = 1;
        updatePagination();
    }
}

/**
 * Ändert die Anzahl der Elemente pro Seite
 */
function changeItemsPerPage(value) {
    itemsPerPage = value === 'all' ? 9999 : parseInt(value);
    currentPage = 1; // Reset auf Seite 1
    updatePagination();
}

/**
 * Wechselt die Seite
 */
function goToPage(page) {
    currentPage = page;
    updatePagination();
    // Nach oben scrollen
    document.getElementById('archive-top').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Hauptlogik: Zeigt nur die Items der aktuellen Seite an
 */
function updatePagination() {
    const grid = document.getElementById('roomGrid');
    if (!grid) return;
    const items = Array.from(grid.getElementsByClassName('room-card-link'));
    const controls = document.getElementById('paginationControls');
    if (!controls) return;
    
    // 1. Filtere Items nach aktiver Kategorie
    const filteredItems = items.filter(item => {
        if (activeCategory === 'all') return true;
        const isOutdoor = item.dataset.outdoor === 'true';
        if (activeCategory === 'outdoor') return isOutdoor;
        if (activeCategory === 'indoor') return !isOutdoor;
        return true;
    });

    // Blende alle nicht passenden aus
    items.forEach(item => {
        if (!filteredItems.includes(item)) {
            item.style.display = 'none';
        }
    });

    // 2. Zeige nur die Items der aktuellen Seite an
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    filteredItems.forEach((item, index) => {
        if (index >= start && index < end) {
            item.style.display = 'block'; // Anzeigen
        } else {
            item.style.display = 'none';  // Verstecken
        }
    });

    // 3. Buttons generieren
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    let buttonsHtml = '';

    if (totalPages > 1) {
        // Zurück Button
        if (currentPage > 1) {
            buttonsHtml += `<button onclick="goToPage(${currentPage - 1})" class="btn-page">&laquo;</button>`;
        }

        // Nummerierte Buttons
        for (let i = 1; i <= totalPages; i++) {
            if (i === currentPage) {
                buttonsHtml += `<button class="btn-page active" disabled>${i}</button>`;
            } else {
                buttonsHtml += `<button onclick="goToPage(${i})" class="btn-page">${i}</button>`;
            }
        }

        // Vorwärts Button
        if (currentPage < totalPages) {
            buttonsHtml += `<button onclick="goToPage(${currentPage + 1})" class="btn-page">&raquo;</button>`;
        }
    }

    controls.innerHTML = buttonsHtml;
}

/**
 * Filtert das Aktenarchiv nach Kategorie (Indoor, Outdoor, Alle)
 */
function filterCategory(type) {
    activeCategory = type;
    currentPage = 1; // Reset auf erste Seite

    // Aktualisiere die Buttons in der Filterleiste
    const buttons = document.getElementsByClassName('btn-filter');
    Array.from(buttons).forEach(btn => {
        btn.classList.remove('active');
    });

    const activeBtn = document.getElementById('filter-' + type);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }

    updatePagination();
}
