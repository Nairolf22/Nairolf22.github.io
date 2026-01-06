---
layout: default
title: Das vollständige Archiv
permalink: /archiv/
---

<div id="archive-top"></div>

<section class="archive-section">
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; border-bottom: 2px solid var(--rust-primary); padding-bottom: 1rem; margin-bottom: 2rem;">
        
        <h2 class="section-title" style="margin-bottom:0; border:none; padding:0;">
            <span style="border-bottom: 5px solid var(--rust-primary);">FALL-ARCHIV</span>
        </h2>
        
        <div class="sort-controls" style="margin-top: 1rem;">
            <span style="color:#888; margin-right:5px; text-transform:uppercase; font-size:0.8rem;">Sortieren:</span>
            <button class="btn-sort" onclick="sortRooms('name')">Name</button>
            <button class="btn-sort" onclick="sortRooms('provider')">Anbieter</button>
            <button class="btn-sort" onclick="sortRooms('rating')">Bewertung</button>

            <span style="color:#888; margin-left:15px; margin-right:5px; text-transform:uppercase; font-size:0.8rem;">Anzeigen:</span>
            <select class="select-filter" onchange="changeItemsPerPage(this.value)">
                <option value="6">6 Akten</option>
                <option value="12" selected>12 Akten</option>
                <option value="24">24 Akten</option>
                <option value="all">Alle</option>
            </select>
        </div>
    </div>

    <div class="card-grid" id="roomGrid">
        {% for review in site.reviews %}
        
        {% assign r = review.ratings %}
        {% assign sum = r.atmosphere.score | plus: r.story.score | plus: r.puzzles.score | plus: r.scenery.score | plus: r.gamemaster.score %}
        {% assign calculated_avg = sum | divided_by: 5.0 %}

        <a href="{{ review.url }}" class="room-card-link"
           data-title="{{ review.title | downcase }}"
           data-provider="{{ review.provider | downcase }}"
           data-rating="{% if review.pending or review.planned %}-1{% else %}{{ calculated_avg }}{% endif %}">
            
            <article class="room-card">
                <div class="card-image-wrapper">
                    {% if review.thumbnail %}
                        {% assign img_src = review.thumbnail %}
                    {% elsif review.images.size > 0 %}
                        {% assign img_src = review.images[0] %}
                    {% else %}
                        {% assign img_src = "ui/no-signal.jpg" %}
                    {% endif %}

                    <img 
                        src="/assets/images/{{ img_src }}" 
                        alt="{{ review.title }}" 
                        loading="lazy" 
                        width="400" 
                        height="200" 
                        style="object-fit: cover;"
                    >
                    
                    {% if review.planned %}
                        <div class="pending-overlay">
                            <span class="planned-stamp">EINSATZ GEPLANT</span>
                        </div>
                    {% elsif review.pending %}
                        <div class="pending-overlay">
                            <span class="pending-stamp">ERMITTLUNG LÄUFT</span>
                        </div>
                    {% else %}
                        <div class="rating-badge">
                            ★ {{ calculated_avg | round: 1 }}
                        </div>
                    {% endif %}
                </div>

                <div class="card-content">
                    <h3>{{ review.title }}</h3>
                    <p class="card-meta">{{ review.provider }} | {{ review.location.city }}</p>
                    
                    {% if review.planned %}
                        <div style="margin: 10px 0; color: #1E88E5; font-size: 0.9rem; font-family: 'Courier New'; font-weight: bold;">
                            [Termin: {{ review.visit_date | date: "%d.%m.%Y" }}]
                        </div>
                    {% elsif review.pending %}
                        <div style="margin: 10px 0; color: #888; font-size: 0.9rem; font-family: 'Courier New';">
                            [Daten werden noch ausgewertet...]
                        </div>
                    {% else %}
                        <div class="stars small" style="--score: {{ calculated_avg }};">★★★★★</div>
                    {% endif %}
                    
                    <p class="card-summary">{{ review.summary | truncate: 100, "..." }}</p>
                </div>
            </article>
        </a>
        {% endfor %}
    </div>

    <div id="paginationControls" class="pagination-container"></div>

    <div style="margin-top: 2rem; text-align: center;">
        <a href="/" class="btn-back">← Zurück zur Startseite</a>
    </div>

</section>
