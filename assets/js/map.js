/* map.js - Angepasst für dynamisches Nachladen (2-Klick-Lösung)
   Der 'DOMContentLoaded' Event-Listener wurde entfernt.
*/

if (document.getElementById('escapeMap')) {

    // 1. Karte initialisieren
    // Wir setzen den View initial auf Deutschland/Mitte, fitBounds macht später den Rest
    var map = L.map('escapeMap').setView([51.1657, 10.4515], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    // Prüfen, ob Daten vorhanden sind
    if (typeof roomData !== 'undefined') {
        
        // --- CLUSTER GRUPPE ERSTELLEN ---
        // WICHTIG: Das erfordert, dass das Leaflet.markercluster Plugin im HTML geladen ist!
        var markers = L.markerClusterGroup({
            showCoverageOnHover: false,
            maxClusterRadius: 50,
            
            // Custom Design für den Cluster-Kreis
            iconCreateFunction: function(cluster) {
                var count = cluster.getChildCount();
                return L.divIcon({
                    html: '<div class="cluster-inner"><span>' + count + '</span></div>',
                    className: 'custom-cluster-icon',
                    iconSize: [40, 40]
                });
            }
        });

        // Array für Bounds (zum Zoomen)
        var allLatLngs = [];

        roomData.forEach(function(room) {
            
            // --- FARB- & TEXT-BERECHNUNG ---
            var colorString;
            var statusHtml;

            // FALL 1: GEPLANT (Blau)
            if (room.planned === true) {
                colorString = '#1E88E5'; // Blueprint Blue
                statusHtml = '<div style="margin: 5px 0; font-weight:bold; color: #1E88E5;">EINSATZ GEPLANT</div>';
            }
            // FALL 2: PENDING (Grau)
            else if (room.pending === true) {
                colorString = '#666666'; // Sattes Grau
                statusHtml = '<div style="margin: 5px 0; font-weight:bold; color: #666;">ERMITTLUNG LÄUFT</div>';
            }
            // FALL 3: FERTIG (Bewertungsskala)
            else {
                var rating = parseFloat(room.rating) || 0;
                var hue = (rating / 5) * 120;
                colorString = `hsl(${hue}, 100%, 40%)`;
                statusHtml = `<div style="margin: 5px 0; font-weight:bold; color: ${colorString};">${room.rating} / 5 Sterne</div>`;
            }

            // --- PIN DESIGN ---
            var coloredIcon = L.divIcon({
                className: 'custom-pin-container',
                html: `<div style="
                        background-color: ${colorString};
                        width: 24px;
                        height: 24px;
                        border-radius: 50%;
                        border: 2px solid #fff;
                        box-shadow: 2px 2px 5px rgba(0,0,0,0.8);
                      "></div>`,
                iconSize: [24, 24],
                iconAnchor: [12, 12],
                popupAnchor: [0, -12]
            });

            // --- MARKER ERSTELLEN ---
            var marker = L.marker([room.lat, room.lng], { icon: coloredIcon });
            
            // --- POPUP INHALT ---
            var popupContent = `
                <div style="text-align:center;">
                    <b style="font-size:1.1rem;">${room.title}</b><br>
                    <span style="font-size:0.8rem; text-transform:uppercase; color:#888;">${room.provider}</span><br>
                    
                    ${statusHtml}
                    
                    <a href="${room.url}" style="background:#333; color:#fff; padding:2px 8px; text-decoration:none; font-size:0.8rem;">>> ZUR AKTE</a>
                </div>
            `;

            marker.bindPopup(popupContent);
            
            // Zur Cluster-Gruppe hinzufügen
            markers.addLayer(marker);
            allLatLngs.push([room.lat, room.lng]);
        });

        // Die fertige Gruppe zur Karte hinzufügen
        map.addLayer(markers);

        // Zoom anpassen, damit alle Punkte sichtbar sind
        if (allLatLngs.length > 0) {
            map.fitBounds(allLatLngs, { padding: [50, 50] });
        }

        // Event: Wenn Leaflet geladen ist, einmal Größe neu berechnen (wichtig beim Einblenden)
        map.invalidateSize();

        /* --- LISTE NACH KARTE FILTERN --- */
        function filterGridByMap() {
            var grid = document.getElementById('roomGrid');
            // Abbruch, wenn wir gar nicht auf der Seite mit Grid sind
            if (!grid) return;
            
            // 1. Hole die Grenzen des aktuellen Kartenausschnitts
            var bounds = map.getBounds();
            var cards = grid.getElementsByClassName('room-card-link');

            // 2. Prüfe jede Karte
            for (var i = 0; i < cards.length; i++) {
                var card = cards[i];
                var lat = parseFloat(card.dataset.lat);
                var lng = parseFloat(card.dataset.lng);

                if (!isNaN(lat) && !isNaN(lng)) {
                    // Erstelle einen Leaflet-Punkt
                    var point = L.latLng(lat, lng);
                    
                    // Prüfe, ob der Punkt im sichtbaren Rechteck liegt
                    if (bounds.contains(point)) {
                        card.style.display = 'block'; // Anzeigen
                    } else {
                        card.style.display = 'none';  // Verstecken
                    }
                }
            }
        }

        // Event-Listener: Feuert, wenn der User zoomt oder die Karte verschiebt
        map.on('moveend', filterGridByMap);
        map.on('zoomend', filterGridByMap);

        // Initial ausführen, damit direkt gefiltert wird
        filterGridByMap();
    }
}
