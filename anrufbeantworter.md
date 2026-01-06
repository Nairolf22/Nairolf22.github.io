---
layout: default
title: Die Anrufbeantworter
permalink: /team/
---

<div class="review-dossier">
    <div class="dossier-header">
        <h2>Akte: Die Anrufbeantworter</h2>
        <p>Ermittlerprofil & Mission: Die Experten für Escape Room Reviews</p>
    </div>

    <div style="font-family: 'Courier New', Courier, monospace; line-height: 1.6; margin-bottom: 40px; color: #333;">
        <h3 style="color: var(--rust-primary, #a0522d);">Gegenstand der Untersuchung: Wer sind die Anrufbeantworter?</h3>
        <p>
            Willkommen im <strong>The Escape Archive</strong>. Wir sind "Die Anrufbeantworter" – ein Team aus sechs passionierten Rätsellösern, die seit Jahren die Welt der <strong>Live Escape Games</strong> unsicher machen. Unsere Gruppe ist organisch gewachsen und tief verwurzelt: Wir sind zwei Cousins und eine Cousine, die gemeinsam mit ihren Partnern die Faszination für immersive <strong>Escape Room Erfahrungen</strong> teilen.
        </p>

        <p>
            <strong>Warum "Die Anrufbeantworter"?</strong><br>
            Dieser Name ist das Ergebnis einer langen, ereignisreichen Reise durch unzählige Räume. Er steht für unsere ganz eigene Art, Hinweise zu empfangen, zu verarbeiten und im Team zu kommunizieren. Was als Hobby begann, wurde schnell zur Mission: Wir wollten unsere <strong>Erfahrungsberichte</strong> bündeln und anderen Spielern zugänglich machen.
        </p>

        <h3 style="color: var(--rust-primary, #a0522d); margin-top: 30px;">Unsere Bewertungskriterien & Philosophie</h3>
        <p>
            Auf dieser Seite findet ihr unsere gesammelten <strong>Escape Room Bewertungen</strong>. Unser Ziel ist es, dass andere Teams von unseren Erlebnissen profitieren können. Dabei legen wir besonderen Wert auf:
        </p>
        <ul style="list-style-type: square; margin-left: 20px;">
            <li><strong>Team-Dynamik:</strong> Wir lieben Räume, die uns fordern, intensiv miteinander zu interagieren.</li>
            <li><strong>Parallelität:</strong> Ein gutes Rätsel-Design erlaubt es uns, Aufgaben parallel zu lösen, statt hintereinander anzustehen.</li>
            <li><strong>Kommunikation:</strong> Ohne Austausch kein Erfolg – das ist unser Credo.</li>
        </ul>


<ul style="list-style-type: square; margin-left: 20px;">
            <li><strong>Team-Dynamik:</strong> Wir lieben Räume, die uns fordern, intensiv miteinander zu interagieren.</li>
            <li><strong>Parallelität:</strong> Ein gutes Rätsel-Design erlaubt es uns, Aufgaben parallel zu lösen, statt hintereinander anzustehen.</li>
            <li><strong>Kommunikation:</strong> Ohne Austausch kein Erfolg – das ist unser Credo.</li>
        </ul>

        <p style="margin-top: 1rem;">
            Du willst genau wissen, wie wir vorgehen und welche Tipps wir für dein Spiel haben? <br>
            <a href="/philosophie/" style="font-weight: bold; color: var(--rust-primary); text-decoration: underline;">
                >> Lies hier unsere ausführliche Philosophie & Spiel-Tipps
            </a>
        </p>

        <p style="background-color: #fdf2f2; border: 1px dashed #d9534f; padding: 15px; margin-top: 20px;">
            <strong>Wichtiger Hinweis:</strong> Unsere Rezensionen sind vollkommen <strong>subjektiv</strong>. Wir versuchen stets, <strong>spoilerfrei</strong> zu schreiben, damit die Überraschungen im Raum erhalten bleiben. Dennoch ist beim Lesen Vorsicht geboten, da wir teilweise tiefe Einblicke in unsere Spielerfahrung geben.
        </p>
    </div>

    <hr style="border: 0; border-top: 2px solid #333; margin: 40px 0;">

    <div class="team-grid">
        <h3 style="font-family: 'Courier New', monospace; text-align: center; margin-bottom: 30px;">Identifizierte Teammitglieder:</h3>
        
        {% for member in site.data.members %}
        <div class="team-card" id="{{ member.name | slugify }}">
            <div class="team-photo">
                <img src="/assets/images/{{ member.image }}" alt="{{ member.name }}" onerror="this.src='/assets/images/ui/no-signal.jpg'">
            </div>
            <div class="team-info">
                <h3 class="team-name">{{ member.name }}</h3>
                <span class="team-role">{{ member.role }}</span>
                <p class="team-bio">{{ member.bio }}</p>
            </div>
        </div>
        <hr style="border:0; border-top:1px dashed #999; margin: 2rem 0;">
        {% endfor %}
    </div>
</div>
