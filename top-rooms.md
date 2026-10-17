---
layout: default
title: "Die besten Escape Rooms: Unsere Top 5 Testsieger (Gesamtwertung)"
description: "Die absoluten Spitzenreiter: Unsere Top 5 Testsieger mit der höchsten Gesamtwertung aus all unseren Escape Room Tests."
permalink: /hall-of-fame/top-rooms/
---

{% assign ranked_rooms = "" %}

{% for review in site.reviews %}
    {% if review.pending or review.planned %}
        {% continue %}
    {% endif %}

    {% assign r = review.ratings %}
    {% assign sum = r.atmosphere.score | plus: r.story.score | plus: r.puzzles.score | plus: r.scenery.score | plus: r.gamemaster.score %}
    {% assign calculated_avg = sum | divided_by: 5.0 %}
    
    {% assign s_date = review.visit_date | date: "%Y%m%d" %}

    {% capture key %}{{ calculated_avg }}-{{ s_date }}::{{ review.url }}{% endcapture %}
    
    {% assign ranked_rooms = ranked_rooms | append: key | append: "|||" %}
{% endfor %}

{% assign sorted_rooms = ranked_rooms | split: "|||" | sort | reverse %}


<div class="review-dossier">

    <div class="dossier-header">
        <h1 style="border-bottom: none; margin-bottom: 0;">Die Hall of Fame: Gesamtwertung</h1>
        <p style="font-family: 'Courier New'; color: #666; margin-top: 0; font-size: 0.9rem;">
            // MISSION REPORT: THE BEST OF THE BEST
        </p>
    </div>

    <div style="font-family: 'Courier New', monospace; line-height: 1.6; color: #333;">
        
        <div style="background: rgba(0,0,0,0.03); padding: 20px; border-left: 5px solid #FFD700; margin-bottom: 3rem;">
            <h2 style="margin-top: 0; text-transform: uppercase; font-size: 1.15rem;">Das perfekte Gesamtpaket</h2>
            <p>
                Hier ehren wir die Räume, die uns auf ganzer Linie überzeugt haben. Es reicht nicht, nur schöne Kulissen oder knackige Rätsel zu haben – für die Spitze dieser Liste muss alles stimmen.
            </p>
            <p>
                Ein Top-Raum ist wie ein gut geöltes Uhrwerk: Story, Atmosphäre, Rätsel und Service greifen nahtlos ineinander. Wenn wir nach dem Spiel sprachlos sind und sofort den nächsten Termin buchen wollen, dann gehört der Raum hierher.
            </p>
        </div>

        <div class="ranking-list">
            
            {% for item in sorted_rooms limit:5 %}
                {% assign parts = item | split: "::" %}
                {% assign room_url = parts[1] %}
                {% assign room = site.reviews | where: "url", room_url | first %}
                {% assign rank = forloop.index %}
                
                {% assign r = room.ratings %}
                {% assign sum = r.atmosphere.score | plus: r.story.score | plus: r.puzzles.score | plus: r.scenery.score | plus: r.gamemaster.score %}
                {% assign avg = sum | divided_by: 5.0 %}

                <a href="{{ room.url }}" style="text-decoration: none; color: inherit; display: block; margin-bottom: 1.75rem;">
                    <div class="room-card ranking-card" style="border: 2px solid {% if rank == 1 %}#FFD700{% else %}#555{% endif %};">
                        
                        <div class="ranking-card-media">
                            <div class="ranking-badge" style="
                                background: {% if rank == 1 %}#FFD700{% elsif rank == 2 %}#C0C0C0{% elsif rank == 3 %}#CD7F32{% else %}#333{% endif %}; 
                                color: {% if rank <= 3 %}#000{% else %}#fff{% endif %}; 
                            ">
                                #{{ rank }}
                            </div>
                            {% if room.thumbnail %}
                                {% assign img_src = room.thumbnail %}
                            {% else %}
                                {% assign img_src = room.images[0] %}
                            {% endif %}
                            <img src="/assets/images/{{ img_src }}" alt="Platz {{ rank }}: {{ room.title }} ({{ room.provider }}, {{ room.location.city }})" loading="lazy" width="400" height="250">
                        </div>

                        <div class="ranking-card-body">
                            <h3 style="margin: 0 0 4px 0; color: var(--rust-light); font-size: 1.35rem;">{{ room.title }}</h3>
                            <span style="color: #aaa; font-size: 0.88rem; margin-bottom: 10px;">
                                {{ room.provider }} | {{ room.location.city }}
                            </span>
                            
                            <hr style="border: 0; border-top: 1px dotted #444; margin: 10px 0;">

                            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
                                <div>
                                    <span style="font-size: 0.78rem; text-transform: uppercase; color: #999;">Gesamtwertung</span><br>
                                    <span style="font-size: 2.2rem; font-weight: bold; color: var(--rust-light); line-height: 1;">
                                        {{ avg | round: 1 }}
                                    </span>
                                    <span style="color:#aaa;">/ 5</span>
                                </div>
                                
                                <div style="text-align: right;">
                                    <div class="stars" style="--score: {{ avg }}; font-size: 1.25rem;">★★★★★</div>
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
    <a href="/hall-of-fame/" class="btn-back">← Zurück zur Hall of Fame</a>
</div>
