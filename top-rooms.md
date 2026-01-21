---
layout: default
title: "Die besten Escape Rooms: Unsere Top 5 Testsieger (Gesamtwertung)"
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
        <h2 style="border-bottom: none; margin-bottom: 0;">Die Hall of Fame: Gesamtwertung</h2>
        <p style="font-family: 'Courier New'; color: #666; margin-top: 0; font-size: 0.9rem;">
            // MISSION REPORT: THE BEST OF THE BEST
        </p>
    </div>

    <div style="font-family: 'Courier New', monospace; line-height: 1.6; color: #333;">
        
        <div style="background: rgba(0,0,0,0.03); padding: 20px; border-left: 5px solid #FFD700; margin-bottom: 3rem;">
            <h3 style="margin-top: 0; text-transform: uppercase;">Das perfekte Gesamtpaket</h3>
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

                <a href="{{ room.url }}" style="text-decoration: none; color: inherit; display: block; margin-bottom: 2rem;">
                    <div class="room-card" style="display: flex; flex-direction: row; align-items: stretch; overflow: hidden; position: relative; border: 2px solid {% if rank == 1 %}#FFD700{% else %}#555{% endif %}; transition: transform 0.2s;">
                        
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

                            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap;">
                                <div>
                                    <span style="font-size: 0.8rem; text-transform: uppercase; color: #888;">Gesamtwertung</span><br>
                                    <span style="font-size: 2.5rem; font-weight: bold; color: var(--rust-primary); line-height: 1;">
                                        {{ avg | round: 1 }}
                                    </span>
                                    <span style="color:#ccc;">/ 5</span>
                                </div>
                                
                                <div style="text-align: right;">
                                    <div class="stars" style="--score: {{ avg }}; font-size: 1.2rem;">★★★★★</div>
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
            padding-left: 0 !important;
            margin-top: 10px;
        }
    }
</style>
