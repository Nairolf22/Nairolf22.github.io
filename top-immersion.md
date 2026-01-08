---
layout: default
title: Die Top 5 der Immersion
permalink: /hall-of-fame/top-immersion/
---

{% assign ranked_rooms = "" %}

{% for review in site.reviews %}
    {% if review.pending or review.planned %}
        {% continue %}
    {% endif %}

    {% assign s_atmo = review.ratings.atmosphere.score %}
    {% assign s_scen = review.ratings.scenery.score %}
    {% assign s_story = review.ratings.story.score %}
    {% assign s_puzz = review.ratings.puzzles.score %}
    {% assign s_gm = review.ratings.gamemaster.score %}
    {% assign s_date = review.visit_date | date: "%Y%m%d" %}

    {% capture key %}{{ s_atmo }}-{{ s_scen }}-{{ s_story }}-{{ s_puzz }}-{{ s_gm }}-{{ s_date }}::{{ review.url }}{% endcapture %}
    
    {% assign ranked_rooms = ranked_rooms | append: key | append: "|||" %}
{% endfor %}

{% assign sorted_rooms = ranked_rooms | split: "|||" | sort | reverse %}


<div class="review-dossier">

    <div class="dossier-header">
        <h2 style="border-bottom: none; margin-bottom: 0;">Die Hall of Fame der Immersion</h2>
        <p style="font-family: 'Courier New'; color: #666; margin-top: 0; font-size: 0.9rem;">
            // TOP 5 RANKING: ATMOSPHÄRE & KULISSE
        </p>
    </div>

    <div style="font-family: 'Courier New', monospace; line-height: 1.6; color: #333;">
        
        <div style="background: rgba(0,0,0,0.03); padding: 20px; border-left: 5px solid var(--rust-primary); margin-bottom: 3rem;">
            <h3 style="margin-top: 0; text-transform: uppercase;">Was bedeutet eigentlich "Immersion"?</h3>
            <p>
                Immersion (vom lateinischen <em>immergere</em> „eintauchen“) beschreibt den Zustand, in dem wir die reale Welt um uns herum vergessen und vollständig mit der Spielwelt verschmelzen.
            </p>
            <p>
                In einem perfekten immersiven Escape Room schaust du nicht mehr auf die Uhr. Du siehst keine bemalten Wände, sondern einen echten Bunker. Du löst keine "Rätsel", sondern reparierst einen Generator, weil dein Überleben davon abhängt. 
                Hier zeigen wir dir die TOP 5 der Räume zum Eintauchen in eine andere Welt.
            </p>
        </div>

        <div class="ranking-list">
            
            {% for item in sorted_rooms limit:5 %}
                {% assign parts = item | split: "::" %}
                {% assign room_url = parts[1] %}
                
                {% assign room = site.reviews | where: "url", room_url | first %}
                
                {% assign rank = forloop.index %}

                <a href="{{ room.url }}" style="text-decoration: none; color: inherit; display: block; margin-bottom: 2rem;">
                    <div class="room-card" style="display: flex; flex-direction: row; align-items: stretch; overflow: hidden; position: relative; border: 2px solid #555; transition: transform 0.2s;">
                        
                        <div style="
                            position: absolute; 
                            top: 0; 
                            left: 0; 
                            background: {% if rank == 1 %}#FFD700{% elsif rank == 2 %}#C0C0C0{% elsif rank == 3 %}#CD7F32{% else %}#333{% endif %}; 
                            color: {% if rank <= 3 %}#000{% else %}#fff{% endif %}; 
                            padding: 5px 15px; 
                            font-weight: bold; 
                            z-index: 10; 
                            box-shadow: 2px 2px 5px rgba(0,0,0,0.5);
                            font-family: 'Arial Black', sans-serif;
                            font-size: 1.2rem;
                        ">
                            #{{ rank }}
                        </div>

                        <div style="flex: 1; min-width: 250px; max-width: 300px; position: relative;">
                            {% if room.thumbnail %}
                                {% assign img_src = room.thumbnail %}
                            {% else %}
                                {% assign img_src = room.images[0] %}
                            {% endif %}
                            <img src="/assets/images/{{ img_src }}" alt="{{ room.title }}" style="width: 100%; height: 100%; object-fit: cover; border: none;">
                        </div>

                        <div class="card-content" style="flex: 2; padding: 1.5rem; display: flex; flex-direction: column; justify-content: center;">
                            <h3 style="margin: 0; color: var(--rust-primary); font-size: 1.4rem; padding-left: 40px;">{{ room.title }}</h3>
                            <span style="color: #666; font-size: 0.9rem; margin-bottom: 10px; padding-left: 40px;">
                                {{ room.provider }} | {{ room.location.city }}
                            </span>
                            
                            <hr style="border: 0; border-top: 1px dotted #ccc; margin: 10px 0;">

                            <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                                <div>
                                    <span style="font-size: 0.8rem; text-transform: uppercase; color: #888;">Atmosphäre</span><br>
                                    <span style="font-size: 1.5rem; font-weight: bold; color: var(--rust-primary);">
                                        {{ room.ratings.atmosphere.score }}
                                    </span>
                                </div>
                                <div>
                                    <span style="font-size: 0.8rem; text-transform: uppercase; color: #888;">Kulisse</span><br>
                                    <span style="font-size: 1.2rem; font-weight: bold; color: #555;">
                                        {{ room.ratings.scenery.score }}
                                    </span>
                                </div>
                                <div>
                                    <span style="font-size: 0.8rem; text-transform: uppercase; color: #888;">Story</span><br>
                                    <span style="font-size: 1.2rem; font-weight: bold; color: #555;">
                                        {{ room.ratings.story.score }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
            {% endfor %}
            
        </div>

    </div>
</div>

<div style="margin-top: 2rem; text-align: center;">
    <a href="/archiv/" class="btn-back">← Zum gesamten Archiv</a>
</div>

<style>
    @media (max-width: 700px) {
        .room-card {
            flex-direction: column !important;
        }
        .room-card img {
            height: 200px !important;
        }
        .card-content h3, .card-content span {
            padding-left: 0 !important; /* Badge verdeckt Text nicht mobil */
            margin-top: 10px;
        }
    }
</style>
