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

/**
 * ANBIETER WIDGET GENERATOR LOGIK
 */
document.addEventListener('DOMContentLoaded', function() {
    initWidgetGenerator();
});

function initWidgetGenerator() {
    const generator = document.getElementById('eaWidgetGenerator');
    if (!generator) return;

    const data = {
        title: generator.dataset.title || 'Escape Room',
        provider: generator.dataset.provider || 'Anbieter',
        city: generator.dataset.city || '',
        score: parseFloat(generator.dataset.score || '0.0').toFixed(1),
        url: generator.dataset.url || 'https://www.escapearchive.de/',
        atm: parseFloat(generator.dataset.atm || '0.0').toFixed(1),
        sty: parseFloat(generator.dataset.sty || '0.0').toFixed(1),
        puz: parseFloat(generator.dataset.puz || '0.0').toFixed(1),
        scn: parseFloat(generator.dataset.scn || '0.0').toFixed(1),
        gm:  parseFloat(generator.dataset.gm  || '0.0').toFixed(1)
    };

    let currentType = 'badge';    // 'badge' | 'scorecard'
    let currentTheme = 'dark';    // 'dark' | 'light'
    let currentMode = 'html';     // 'html' | 'iframe'

    const previewArea = document.getElementById('widgetPreviewArea');
    const codeTextarea = document.getElementById('widgetCodeTextarea');
    const copyBtn = document.getElementById('btnCopyWidget');

    function escapeHtml(str) {
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function buildHtmlSnippet(type, theme) {
        const safeTitle = escapeHtml(data.title);
        const safeProvider = escapeHtml(data.provider);
        const safeCity = escapeHtml(data.city);
        const metaLocation = safeCity ? ` (${safeCity})` : '';

        if (type === 'badge') {
            if (theme === 'dark') {
                return `<!-- The Escape Archive • Die Anrufbeantworter Test-Siegel -->\n<a href="${data.url}" target="_blank" rel="noopener" title="Escape Room Testbericht: ${safeTitle} von Die Anrufbeantworter" style="display:inline-flex;align-items:center;gap:12px;padding:10px 14px;background:#1e1e1e;color:#e0e0e0;border:1px solid #3a3a3a;border-radius:8px;text-decoration:none;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:13px;line-height:1.4;box-shadow:0 4px 12px rgba(0,0,0,0.3);max-width:340px;width:100%;box-sizing:border-box;">\n  <div style="background:#2a1810;border:1px solid #8d4004;color:#ffb74d;padding:6px 8px;border-radius:6px;min-width:62px;text-align:center;flex-shrink:0;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;justify-content:center;">\n    <div style="font-size:1.3rem;font-weight:800;line-height:1;font-family:'Courier New',Courier,monospace;">★ ${data.score}</div>\n    <div style="font-size:0.6rem;opacity:0.85;margin-top:2px;letter-spacing:0.5px;">VON 5.0</div>\n  </div>\n  <div style="flex:1;min-width:0;">\n    <div style="display:flex;align-items:center;gap:5px;margin-bottom:2px;">\n      <img src="https://www.escapearchive.de/assets/images/logo-escape-archive_400.webp" alt="Die Anrufbeantworter" style="height:15px;width:auto;max-width:38px;object-fit:contain;display:block;" loading="lazy">\n      <span style="font-size:0.65rem;font-weight:700;color:#ff9800;text-transform:uppercase;letter-spacing:0.6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">DIE ANRUFBEANTWORTER</span>\n    </div>\n    <div style="font-size:0.92rem;font-weight:700;color:#ffffff;line-height:1.25;margin-bottom:2px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;word-break:break-word;" title="${safeTitle}">${safeTitle}</div>\n    <div style="font-size:0.75rem;color:#aaaaaa;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${safeProvider}${metaLocation}">${safeProvider}${metaLocation}</div>\n    <div style="font-size:0.7rem;color:#ff9800;margin-top:3px;font-weight:600;display:inline-flex;align-items:center;gap:3px;"><span>Testbericht lesen</span><span style="font-size:0.85rem;line-height:1;">&raquo;</span></div>\n  </div>\n</a>`;
            } else {
                return `<!-- The Escape Archive • Die Anrufbeantworter Test-Siegel -->\n<a href="${data.url}" target="_blank" rel="noopener" title="Escape Room Testbericht: ${safeTitle} von Die Anrufbeantworter" style="display:inline-flex;align-items:center;gap:12px;padding:10px 14px;background:#ffffff;color:#333333;border:1px solid #e0e0e0;border-radius:8px;text-decoration:none;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:13px;line-height:1.4;box-shadow:0 4px 14px rgba(0,0,0,0.08);max-width:340px;width:100%;box-sizing:border-box;">\n  <div style="background:#fff3e0;border:1px solid #ffe0b2;color:#e65100;padding:6px 8px;border-radius:6px;min-width:62px;text-align:center;flex-shrink:0;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;justify-content:center;">\n    <div style="font-size:1.3rem;font-weight:800;line-height:1;font-family:'Courier New',Courier,monospace;">★ ${data.score}</div>\n    <div style="font-size:0.6rem;opacity:0.85;margin-top:2px;letter-spacing:0.5px;">VON 5.0</div>\n  </div>\n  <div style="flex:1;min-width:0;">\n    <div style="display:flex;align-items:center;gap:5px;margin-bottom:2px;">\n      <img src="https://www.escapearchive.de/assets/images/logo-escape-archive_400.webp" alt="Die Anrufbeantworter" style="height:15px;width:auto;max-width:38px;object-fit:contain;display:block;" loading="lazy">\n      <span style="font-size:0.65rem;font-weight:700;color:#d75a08;text-transform:uppercase;letter-spacing:0.6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">DIE ANRUFBEANTWORTER</span>\n    </div>\n    <div style="font-size:0.92rem;font-weight:700;color:#111111;line-height:1.25;margin-bottom:2px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;word-break:break-word;" title="${safeTitle}">${safeTitle}</div>\n    <div style="font-size:0.75rem;color:#666666;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${safeProvider}${metaLocation}">${safeProvider}${metaLocation}</div>\n    <div style="font-size:0.7rem;color:#d75a08;margin-top:3px;font-weight:600;display:inline-flex;align-items:center;gap:3px;"><span>Testbericht lesen</span><span style="font-size:0.85rem;line-height:1;">&raquo;</span></div>\n  </div>\n</a>`;
            }
        } else {
            // Scorecard
            const pctAtm = Math.round((parseFloat(data.atm) / 5.0) * 100);
            const pctSty = Math.round((parseFloat(data.sty) / 5.0) * 100);
            const pctPuz = Math.round((parseFloat(data.puz) / 5.0) * 100);
            const pctScn = Math.round((parseFloat(data.scn) / 5.0) * 100);
            const pctGm  = Math.round((parseFloat(data.gm)  / 5.0) * 100);

            if (theme === 'dark') {
                return `<!-- The Escape Archive • Die Anrufbeantworter Bewertungs-Box -->\n<a href="${data.url}" target="_blank" rel="noopener" title="Escape Room Testbericht: ${safeTitle} von Die Anrufbeantworter" style="display:block;padding:14px 16px;background:#1e1e1e;color:#e0e0e0;border:1px solid #3a3a3a;border-radius:10px;text-decoration:none;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:13px;line-height:1.4;box-shadow:0 6px 16px rgba(0,0,0,0.35);max-width:360px;width:100%;box-sizing:border-box;">\n  <div style="display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:10px;border-bottom:1px solid #333333;margin-bottom:10px;gap:10px;">\n    <div style="flex:1;min-width:0;">\n      <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">\n        <img src="https://www.escapearchive.de/assets/images/logo-escape-archive_400.webp" alt="Die Anrufbeantworter" style="height:18px;width:auto;max-width:44px;object-fit:contain;display:block;" loading="lazy">\n        <span style="font-size:0.66rem;font-weight:700;color:#ff9800;text-transform:uppercase;letter-spacing:0.7px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">DIE ANRUFBEANTWORTER</span>\n      </div>\n      <div style="font-size:1.02rem;font-weight:700;color:#ffffff;line-height:1.25;margin-bottom:2px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;word-break:break-word;" title="${safeTitle}">${safeTitle}</div>\n      <div style="font-size:0.75rem;color:#aaaaaa;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${safeProvider}${metaLocation}">${safeProvider}${metaLocation}</div>\n    </div>\n    <div style="background:#2a1810;border:1px solid #8d4004;color:#ffb74d;padding:4px 8px;border-radius:6px;text-align:center;flex-shrink:0;min-width:58px;">\n      <div style="font-size:1.15rem;font-weight:800;line-height:1;font-family:'Courier New',Courier,monospace;">★ ${data.score}</div>\n      <div style="font-size:0.6rem;opacity:0.85;margin-top:2px;">GESAMT</div>\n    </div>\n  </div>\n  <div style="display:flex;flex-direction:column;gap:7px;margin-bottom:12px;">\n    <div style="display:flex;align-items:center;justify-content:space-between;font-size:0.8rem;gap:8px;">\n      <span style="color:#cccccc;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Atmosphäre &amp; Immersion</span>\n      <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">\n        <div style="width:65px;height:6px;background:#333333;border-radius:3px;overflow:hidden;"><div style="width:${pctAtm}%;height:100%;background:#e65100;border-radius:3px;"></div></div>\n        <span style="font-family:'Courier New',monospace;font-weight:700;width:24px;text-align:right;color:#fff;">${data.atm}</span>\n      </div>\n    </div>\n    <div style="display:flex;align-items:center;justify-content:space-between;font-size:0.8rem;gap:8px;">\n      <span style="color:#cccccc;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Story &amp; Storytelling</span>\n      <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">\n        <div style="width:65px;height:6px;background:#333333;border-radius:3px;overflow:hidden;"><div style="width:${pctSty}%;height:100%;background:#e65100;border-radius:3px;"></div></div>\n        <span style="font-family:'Courier New',monospace;font-weight:700;width:24px;text-align:right;color:#fff;">${data.sty}</span>\n      </div>\n    </div>\n    <div style="display:flex;align-items:center;justify-content:space-between;font-size:0.8rem;gap:8px;">\n      <span style="color:#cccccc;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Rätseldesign &amp; Logik</span>\n      <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">\n        <div style="width:65px;height:6px;background:#333333;border-radius:3px;overflow:hidden;"><div style="width:${pctPuz}%;height:100%;background:#e65100;border-radius:3px;"></div></div>\n        <span style="font-family:'Courier New',monospace;font-weight:700;width:24px;text-align:right;color:#fff;">${data.puz}</span>\n      </div>\n    </div>\n    <div style="display:flex;align-items:center;justify-content:space-between;font-size:0.8rem;gap:8px;">\n      <span style="color:#cccccc;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Kulisse &amp; Ausstattung</span>\n      <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">\n        <div style="width:65px;height:6px;background:#333333;border-radius:3px;overflow:hidden;"><div style="width:${pctScn}%;height:100%;background:#e65100;border-radius:3px;"></div></div>\n        <span style="font-family:'Courier New',monospace;font-weight:700;width:24px;text-align:right;color:#fff;">${data.scn}</span>\n      </div>\n    </div>\n    <div style="display:flex;align-items:center;justify-content:space-between;font-size:0.8rem;gap:8px;">\n      <span style="color:#cccccc;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Gamemaster &amp; Service</span>\n      <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">\n        <div style="width:65px;height:6px;background:#333333;border-radius:3px;overflow:hidden;"><div style="width:${pctGm}%;height:100%;background:#e65100;border-radius:3px;"></div></div>\n        <span style="font-family:'Courier New',monospace;font-weight:700;width:24px;text-align:right;color:#fff;">${data.gm}</span>\n      </div>\n    </div>\n  </div>\n  <div style="display:flex;justify-content:space-between;align-items:center;padding-top:8px;border-top:1px solid #333333;font-size:0.72rem;color:#888888;font-weight:600;gap:8px;">\n    <span>✓ Geprüft von Die Anrufbeantworter</span>\n    <span style="color:#ff9800;white-space:nowrap;">Bericht lesen &raquo;</span>\n  </div>\n</a>`;
            } else {
                return `<!-- The Escape Archive • Die Anrufbeantworter Bewertungs-Box -->\n<a href="${data.url}" target="_blank" rel="noopener" title="Escape Room Testbericht: ${safeTitle} von Die Anrufbeantworter" style="display:block;padding:14px 16px;background:#ffffff;color:#333333;border:1px solid #e0e0e0;border-radius:10px;text-decoration:none;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:13px;line-height:1.4;box-shadow:0 6px 18px rgba(0,0,0,0.08);max-width:360px;width:100%;box-sizing:border-box;">\n  <div style="display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:10px;border-bottom:1px solid #f0f0f0;margin-bottom:10px;gap:10px;">\n    <div style="flex:1;min-width:0;">\n      <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">\n        <img src="https://www.escapearchive.de/assets/images/logo-escape-archive_400.webp" alt="Die Anrufbeantworter" style="height:18px;width:auto;max-width:44px;object-fit:contain;display:block;" loading="lazy">\n        <span style="font-size:0.66rem;font-weight:700;color:#d75a08;text-transform:uppercase;letter-spacing:0.7px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">DIE ANRUFBEANTWORTER</span>\n      </div>\n      <div style="font-size:1.02rem;font-weight:700;color:#111111;line-height:1.25;margin-bottom:2px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;word-break:break-word;" title="${safeTitle}">${safeTitle}</div>\n      <div style="font-size:0.75rem;color:#666666;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${safeProvider}${metaLocation}">${safeProvider}${metaLocation}</div>\n    </div>\n    <div style="background:#fff3e0;border:1px solid #ffe0b2;color:#e65100;padding:4px 8px;border-radius:6px;text-align:center;flex-shrink:0;min-width:58px;">\n      <div style="font-size:1.15rem;font-weight:800;line-height:1;font-family:'Courier New',Courier,monospace;">★ ${data.score}</div>\n      <div style="font-size:0.6rem;opacity:0.85;margin-top:2px;">GESAMT</div>\n    </div>\n  </div>\n  <div style="display:flex;flex-direction:column;gap:7px;margin-bottom:12px;">\n    <div style="display:flex;align-items:center;justify-content:space-between;font-size:0.8rem;gap:8px;">\n      <span style="color:#555555;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Atmosphäre &amp; Immersion</span>\n      <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">\n        <div style="width:65px;height:6px;background:#eeeeee;border-radius:3px;overflow:hidden;"><div style="width:${pctAtm}%;height:100%;background:#e65100;border-radius:3px;"></div></div>\n        <span style="font-family:'Courier New',monospace;font-weight:700;width:24px;text-align:right;color:#222;">${data.atm}</span>\n      </div>\n    </div>\n    <div style="display:flex;align-items:center;justify-content:space-between;font-size:0.8rem;gap:8px;">\n      <span style="color:#555555;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Story &amp; Storytelling</span>\n      <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">\n        <div style="width:65px;height:6px;background:#eeeeee;border-radius:3px;overflow:hidden;"><div style="width:${pctSty}%;height:100%;background:#e65100;border-radius:3px;"></div></div>\n        <span style="font-family:'Courier New',monospace;font-weight:700;width:24px;text-align:right;color:#222;">${data.sty}</span>\n      </div>\n    </div>\n    <div style="display:flex;align-items:center;justify-content:space-between;font-size:0.8rem;gap:8px;">\n      <span style="color:#555555;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Rätseldesign &amp; Logik</span>\n      <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">\n        <div style="width:65px;height:6px;background:#eeeeee;border-radius:3px;overflow:hidden;"><div style="width:${pctPuz}%;height:100%;background:#e65100;border-radius:3px;"></div></div>\n        <span style="font-family:'Courier New',monospace;font-weight:700;width:24px;text-align:right;color:#222;">${data.puz}</span>\n      </div>\n    </div>\n    <div style="display:flex;align-items:center;justify-content:space-between;font-size:0.8rem;gap:8px;">\n      <span style="color:#555555;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Kulisse &amp; Ausstattung</span>\n      <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">\n        <div style="width:65px;height:6px;background:#eeeeee;border-radius:3px;overflow:hidden;"><div style="width:${pctScn}%;height:100%;background:#e65100;border-radius:3px;"></div></div>\n        <span style="font-family:'Courier New',monospace;font-weight:700;width:24px;text-align:right;color:#222;">${data.scn}</span>\n      </div>\n    </div>\n    <div style="display:flex;align-items:center;justify-content:space-between;font-size:0.8rem;gap:8px;">\n      <span style="color:#555555;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Gamemaster &amp; Service</span>\n      <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">\n        <div style="width:65px;height:6px;background:#eeeeee;border-radius:3px;overflow:hidden;"><div style="width:${pctGm}%;height:100%;background:#e65100;border-radius:3px;"></div></div>\n        <span style="font-family:'Courier New',monospace;font-weight:700;width:24px;text-align:right;color:#222;">${data.gm}</span>\n      </div>\n    </div>\n  </div>\n  <div style="display:flex;justify-content:space-between;align-items:center;padding-top:8px;border-top:1px solid #f0f0f0;font-size:0.72rem;color:#777777;font-weight:600;gap:8px;">\n    <span>✓ Geprüft von Die Anrufbeantworter</span>\n    <span style="color:#d75a08;white-space:nowrap;">Bericht lesen &raquo;</span>\n  </div>\n</a>`;
            }
        }
    }

    function buildIframeSnippet(type, theme) {
        const query = new URLSearchParams({
            type: type,
            theme: theme,
            title: data.title,
            provider: data.provider,
            city: data.city,
            score: data.score,
            atm: data.atm,
            sty: data.sty,
            puz: data.puz,
            scn: data.scn,
            gm: data.gm,
            url: data.url
        });

        const iframeSrc = `https://www.escapearchive.de/widget.html?${query.toString()}`;
        const width = type === 'badge' ? '340' : '360';
        const height = type === 'badge' ? '98' : '290';

        return `<!-- The Escape Archive • Die Anrufbeantworter Widget (iFrame) -->\n<iframe src="${iframeSrc}" width="${width}" height="${height}" frameborder="0" scrolling="no" style="border:none;overflow:hidden;max-width:100%;" loading="lazy"></iframe>`;
    }

    function updateGenerator() {
        // Update Pill Buttons
        generator.querySelectorAll('.widget-pill-btn').forEach(btn => {
            const grp = btn.dataset.group;
            const val = btn.dataset.val;
            if (
                (grp === 'type' && val === currentType) ||
                (grp === 'theme' && val === currentTheme) ||
                (grp === 'mode' && val === currentMode)
            ) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Update Preview Container Background
        previewArea.className = `widget-preview-area preview-bg-${currentTheme}`;

        // Generate HTML & Render Preview
        const previewHtml = buildHtmlSnippet(currentType, currentTheme);
        previewArea.innerHTML = `<span class="widget-preview-label">Live-Vorschau</span>` + previewHtml;

        // Generate Code for Textarea
        let finalCode = '';
        if (currentMode === 'html') {
            finalCode = previewHtml;
        } else {
            finalCode = buildIframeSnippet(currentType, currentTheme);
        }
        codeTextarea.value = finalCode;
    }

    // Attach click listeners to pill buttons
    generator.querySelectorAll('.widget-pill-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const grp = this.dataset.group;
            const val = this.dataset.val;

            if (grp === 'type') currentType = val;
            if (grp === 'theme') currentTheme = val;
            if (grp === 'mode') currentMode = val;

            updateGenerator();
        });
    });

    // Copy to clipboard
    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            codeTextarea.select();
            navigator.clipboard.writeText(codeTextarea.value).then(() => {
                const originalText = copyBtn.innerHTML;
                copyBtn.classList.add('copied');
                copyBtn.innerHTML = '✓ Code kopiert!';
                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                    copyBtn.innerHTML = originalText;
                }, 2500);
            }).catch(err => {
                // Fallback for older browsers
                document.execCommand('copy');
                copyBtn.classList.add('copied');
                copyBtn.innerHTML = '✓ Code kopiert!';
                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                    copyBtn.innerHTML = '📋 Code kopieren';
                }, 2500);
            });
        });
    }

    // Auto-select text on textarea click
    if (codeTextarea) {
        codeTextarea.addEventListener('click', function() {
            this.select();
        });
    }

    // Initial render
    updateGenerator();
}

