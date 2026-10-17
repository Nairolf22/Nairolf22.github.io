---
layout: default
title: "Alle Escape Room Tests im Überblick: Das große Archiv & Verzeichnis"
description: "Das große Escape Room Archiv: Alle unsere ausführlichen Tests und Bewertungen zu Escape Rooms in Deutschland auf einen Blick."
permalink: /archiv/
---

<style>
    /* Neuer Style für den geschlossenen Status auf Kacheln */
    .closed-stamp {
        background-color: #d32f2f;
        color: white;
        padding: 4px 10px;
        font-weight: bold;
        text-transform: uppercase;
        font-size: 0.82rem;
        letter-spacing: 1px;
        border: 1px solid rgba(255,255,255,0.35);
        border-radius: 3px;
    }

    .archive-header-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
        border-bottom: 2px solid var(--rust-primary);
        padding-bottom: 1rem;
        margin-bottom: 1.5rem;
    }

    .sort-controls {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem 1.25rem;
        align-items: center;
    }

    .sort-group {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 6px;
    }

    .sort-label {
        color: #999;
        margin-right: 4px;
        text-transform: uppercase;
        font-size: 0.8rem;
        font-weight: bold;
    }

    @media (max-width: 640px) {
        .archive-header-bar {
            flex-direction: column;
            align-items: stretch;
        }
        .sort-controls {
            flex-direction: column;
            align-items: stretch;
            gap: 0.65rem;
        }
        .sort-group {
            justify-content: space-between;
        }
        .sort-group .btn-sort {
            flex: 1 1 auto;
            text-align: center;
            padding: 0.45rem 0.5rem;
            font-size: 0.8rem;
        }
        .sort-group .select-filter {
            flex: 1 1 auto;
        }
    }
</style>

<div id="archive-top"></div>

<section class="archive-section">
    <div class="archive-header-bar">
        
        <h1 class="section-title" style="margin-bottom:0; border:none; padding:0;">
            <span style="border-bottom: 4px solid var(--rust-primary); padding-bottom: 2px;">FALL-ARCHIV</span>
        </h1>
        
        <div class="sort-controls">
            <div class="sort-group">
                <span class="sort-label">Sortieren:</span>
                <button class="btn-sort" onclick="sortRooms('name', this)">Name</button>
                <button class="btn-sort" onclick="sortRooms('provider', this)">Anbieter</button>
                <button class="btn-sort" onclick="sortRooms('rating', this)">Bewertung</button>
            </div>
            
            <div class="sort-group">
                <span class="sort-label">Anzeigen:</span>
                <select class="select-filter" onchange="changeItemsPerPage(this.value)">
                    <option value="6">6 Akten</option>
                    <option value="12" selected>12 Akten</option>
                    <option value="24">24 Akten</option>
                    <option value="all">Alle</option>
                </select>
            </div>
        </div>
    </div>

    <div class="filter-bar">
        <button class="btn-filter active" id="filter-all" onclick="filterCategory('all')">Alle Akten</button>
        <button class="btn-filter" id="filter-indoor" onclick="filterCategory('indoor')">Indoor Escape Rooms</button>
        <button class="btn-filter" id="filter-outdoor" onclick="filterCategory('outdoor')">Outdoor Games</button>
    </div>

    <div class="card-grid" id="roomGrid">
        {% for review in site.reviews %}
        
        {% assign r = review.ratings %}
        {% assign sum = r.atmosphere.score | plus: r.story.score | plus: r.puzzles.score | plus: r.scenery.score | plus: r.gamemaster.score %}
        {% assign calculated_avg = sum | divided_by: 5.0 %}

        <a href="{{ review.url }}" class="room-card-link"
           data-title="{{ review.title | downcase }}"
           data-provider="{{ review.provider | downcase }}"
           data-outdoor="{% if review.outdoor %}true{% else %}false{% endif %}"
           data-rating="{% if review.pending or review.planned %}-1{% else %}{{ calculated_avg }}{% endif %}">
            
            <article class="room-card {% if review.outdoor %}outdoor-card{% endif %}">
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
                        alt="{{ review.title }} ({{ review.provider }}, {{ review.location.city }}) – Escape Room Test" 
                        loading="lazy" 
                        width="400" 
                        height="200" 
                        style="object-fit: cover; {% if review.closed %}filter: grayscale(100%);{% endif %}"
                    >
                    
                    {% if review.closed %}
                        <div class="pending-overlay">
                            <span class="closed-stamp">AKTE GESCHLOSSEN</span>
                        </div>
                    {% endif %}

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

                    {% if review.badge %}
                        <div class="card-badge-image-container">
                            <img src="/assets/images/{{ review.badge }}.png" class="card-badge-img" alt="Auszeichnung: {{ review.badge }}">
                        </div>
                    {% endif %}
                </div>

                <div class="card-content">
                    <h3>
                        {{ review.title }}
                        {% if review.closed %}
                            <span style="color: #d32f2f; font-size: 0.7em;">[INAKTIV]</span>
                        {% endif %}
                    </h3>
                    <p class="card-meta">
                        {{ review.provider }} | {{ review.location.city }}
                    </p>
                    
                    {% if review.closed %}
                        <div style="margin: 10px 0; color: #d32f2f; font-size: 0.9rem; font-family: 'Courier New'; font-weight: bold;">
                            [NICHT MEHR BUCHBAR]
                        </div>
                    {% elsif review.planned %}
                        <div style="margin: 10px 0; color: #1E88E5; font-size: 0.9rem; font-family: 'Courier New'; font-weight: bold;">
                            [Termin: {{ review.visit_date | date: "%d.%m.%Y" }}]
                        </div>
                    {% elsif review.pending %}
                        <div style="margin: 10px 0; color: #888; font-size: 0.9rem; font-family: 'Courier New';">
                            [Daten werden noch ausgewertet...]
                        </div>
                    {% endif %}
                    
                    {% unless review.planned or review.pending %}
                        <div class="stars small" style="--score: {{ calculated_avg }};">★★★★★</div>
                    {% endunless %}
                    
                    <p class="card-summary">{{ review.summary | truncate: 100, "..." }}</p>
                </div>
            </article>
        </a>
        {% endfor %}
    </div>

    <div id="paginationControls" class="pagination-container"></div>

    {% assign archive_cities = site.pages | where_exp: "item", "item.city" | sort: "city" %}
    {% if archive_cities.size > 0 %}
    <div style="margin-top: 3rem; padding: 1.25rem; background: #181818; border: 1px solid #333; border-radius: 6px; text-align: center;">
        <h2 style="font-size: 0.95rem; text-transform: uppercase; letter-spacing: 1.5px; color: var(--concrete); margin: 0 0 0.85rem 0;">
            📍 Escape Rooms nach Stadt durchsuchen:
        </h2>
        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 0.5rem;">
            {% for cpage in archive_cities %}
            <a href="{{ cpage.url }}" style="background: #242424; border: 1px solid #3f3f3f; color: var(--rust-light); padding: 0.35rem 0.75rem; border-radius: 4px; font-size: 0.82rem; font-weight: bold;">
                {{ cpage.city }}
            </a>
            {% endfor %}
        </div>
    </div>
    {% endif %}

    <div style="margin-top: 2rem; text-align: center;">
        <a href="/" class="btn-back">← Zurück zur Startseite</a>
    </div>

</section>
