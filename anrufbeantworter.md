---
layout: default
title: Die Anrufbeantworter
permalink: /team/
---

<div class="review-dossier">
    <div class="dossier-header">
        <h2>Akte: Die Anrufbeantworter</h2>
        <p>Das Ermittler-Team im Profil.</p>
    </div>

    <div class="team-grid">
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