/**
 * Sortierfunktion für das Fall-Archiv
 * type: 'name', 'provider' oder 'rating'
 */
function sortRooms(type) {
    const grid = document.getElementById('roomGrid');
    const items = Array.from(grid.getElementsByClassName('room-card-link'));

    // Wir sortieren das Array der HTML-Elemente
    items.sort((a, b) => {
        let valA, valB;

        if (type === 'rating') {
            // Bei Zahlen (Bewertung) müssen wir parsen
            // Wir multiplizieren mit -1 für absteigende Sortierung (beste zuerst)
            valA = parseFloat(a.dataset.rating);
            valB = parseFloat(b.dataset.rating);
            return valB - valA;
        } else if (type === 'name') {
            // Nach Titel (Alphabetisch)
            valA = a.dataset.title;
            valB = b.dataset.title;
            return valA.localeCompare(valB);
        } else if (type === 'provider') {
            // Nach Anbieter (Alphabetisch)
            valA = a.dataset.provider;
            valB = b.dataset.provider;
            return valA.localeCompare(valB);
        }
    });

    // Die sortierten Elemente wieder ins DOM einfügen
    // (Das verschiebt sie automatisch an die richtige Stelle)
    items.forEach(item => grid.appendChild(item));
}
