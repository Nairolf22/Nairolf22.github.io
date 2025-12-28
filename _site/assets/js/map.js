document.addEventListener('DOMContentLoaded', function() {
    
    // Prüfen, ob der Map-Container existiert
    if (!document.getElementById('escapeMap')) return;

    // 1. Karte initialisieren
    var map = L.map('escapeMap').setView([51.1657, 10.4515], 6);

    // 2. Karten-Kacheln laden (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    // 3. Daten verarbeiten und Marker setzen
    if (typeof roomData !== 'undefined') {
        
        var markers = [];

        roomData.forEach(function(room) {
            
            // --- FARBBERECHNUNG ---
            // Wir nutzen HSL Farben: 0 = Rot, 120 = Grün.
            // Formel: (Rating / 5) * 120
            var rating = parseFloat(room.rating) || 0;
            var hue = (rating / 5) * 120;
            
            // Farbe definieren (HSL)
            // Saturation 100%, Lightness 40% (damit es schön kräftig/dunkel ist)
            var colorString = `hsl(${hue}, 100%, 40%)`;

            // --- CUSTOM MARKER (CSS Pin) ---
            // Wir erstellen einen runden Punkt mit der berechneten Farbe
            var coloredIcon = L.divIcon({
                className: 'custom-pin-container', // Brauchen wir nicht zwingend, aber gut für Debug
                html: `<div style="
                        background-color: ${colorString};
                        width: 24px;
                        height: 24px;
                        border-radius: 50%;
                        border: 2px solid #fff;
                        box-shadow: 2px 2px 5px rgba(0,0,0,0.8);
                      "></div>`,
                iconSize: [24, 24],   // Größe des Icons
                iconAnchor: [12, 12], // Der Punkt, der genau auf der Koordinate liegt (Mitte)
                popupAnchor: [0, -12] // Wo das Popup erscheint (etwas darüber)
            });

            // Marker mit dem neuen Icon erstellen
            var marker = L.marker([room.lat, room.lng], { icon: coloredIcon }).addTo(map);
            
            // Popup Inhalt
            var popupContent = `
                <div style="text-align:center;">
                    <b style="font-size:1.1rem;">${room.title}</b><br>
                    <span style="font-size:0.8rem; text-transform:uppercase; color:#888;">${room.provider}</span><br>
                    <div style="margin: 5px 0; font-weight:bold; color: ${colorString};">
                        ${room.rating} / 5 Sterne
                    </div>
                    <a href="${room.url}" style="background:#333; color:#fff; padding:2px 8px; text-decoration:none; font-size:0.8rem;">>> ZUR AKTE</a>
                </div>
            `;

            marker.bindPopup(popupContent);
            markers.push([room.lat, room.lng]);
        });

        // 4. Automatisch Zoomen
        if (markers.length > 0) {
            var bounds = new L.LatLngBounds(markers);
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }
});
