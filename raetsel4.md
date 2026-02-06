---
layout: default
title: "Trainingsmodul: Schloss-Identifikation"
permalink: /raetsel/schloesser/
---

<div class="review-dossier">
    <div class="dossier-header">
        <h2 style="border-bottom: none; margin-bottom: 0;">Einsatz-Training: Schlösser</h2>
        <p style="font-family: 'Courier New'; color: #666; margin-top: 0; font-size: 0.9rem;">
            // MODUL 04: MECHANISCHE & ELEKTRONISCHE BARRIEREN
        </p>
    </div>

    <div id="quiz-container" style="font-family: 'Courier New', monospace; background: #1a1a1a; color: #ddd; padding: 2rem; border-radius: 8px; border: 1px solid #444;">
        <div id="setup-screen">
            <h3>Bereit für das Training, Agent?</h3>
            <p>Identifizieren Sie 5 zufällige Schloss-Typen anhand ihrer Merkmale oder Bilder. Fehler kosten Zeit (und Nerven).</p>
            <button onclick="startQuiz()" style="background: var(--rust-primary); color: white; border: none; padding: 15px 30px; cursor: pointer; font-weight: bold; margin-top: 1rem;">>> TRAINING STARTEN</button>
        </div>

        <div id="question-screen" style="display: none;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; border-bottom: 1px solid #444; padding-bottom: 0.5rem;">
                <span id="progress">Frage 1/5</span>
                <span id="score">Score: 0</span>
            </div>
            <div id="question-content">
                <p id="question-text" style="font-size: 1.1rem; margin-bottom: 1.5rem;"></p>
                <div id="image-placeholder" style="width: 100%; height: 200px; background: #333; display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; border: 1px dashed #666;">
                    <span style="color: #888;">[Bild-Dokument geladen]</span>
                </div>
                <div id="options-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    </div>
            </div>
        </div>

        <div id="result-screen" style="display: none; text-align: center;">
            <h2 id="result-title">Training beendet</h2>
            <p id="result-text" style="font-size: 1.2rem;"></p>
            <button onclick="location.reload()" style="background: transparent; color: var(--rust-primary); border: 2px solid var(--rust-primary); padding: 10px 20px; cursor: pointer; margin-top: 2rem;">Wiederholen</button>
            <br><br>
            <a href="/raetsel/" style="color: #888; text-decoration: underline;">Zurück zur Übersicht</a>
        </div>
    </div>
</div>

<script>
const quizData = [
    { q: "Dieses Schloss hat keine Zahlen, sondern reagiert auf Bewegungen (Oben, Unten, Links, Rechts).", a: "Richtungsschloss", options: ["Zahlenschloss", "Richtungsschloss", "Tresorschloss", "Kryptex"] },
    { q: "Wie nennt man das röhrenförmige Schloss mit rotierenden Buchstabenringen aus dem Da Vinci Code?", a: "Kryptex", options: ["Kryptex", "Buchstabenschloss", "Magnetschloss", "Drückschloss"] },
    { q: "Ein Schloss, das sich ohne sichtbares Schlüsselloch durch das Platzieren eines Objekts öffnet.", a: "Magnetschloss", options: ["Fingerabdruck-Schloss", "Magnetschloss", "Schlüsselschloss", "Zeitschloss"] },
    { q: "Was ist der häufigste Schlosstyp, bei dem Rädchen mit Ziffern gedreht werden müssen?", a: "Zahlenschloss", options: ["Tresorschloss", "Zahlenschloss", "Buchstabenschloss", "Drückschloss"] },
    { q: "Welches Schloss erfordert eine exakte Drehsequenz in wechselnden Richtungen (z.B. 3x Links, 2x Rechts)?", a: "Tresorschloss", options: ["Tresorschloss", "Richtungsschloss", "Kryptex", "Zeitschloss"] }
];

let currentIdx = 0;
let score = 0;
let activeQuestions = [];

function startQuiz() {
    activeQuestions = [...quizData].sort(() => 0.5 - Math.random()).slice(0, 5);
    document.getElementById('setup-screen').style.display = 'none';
    document.getElementById('question-screen').style.display = 'block';
    showQuestion();
}

function showQuestion() {
    const q = activeQuestions[currentIdx];
    document.getElementById('progress').innerText = `Frage ${currentIdx + 1}/5`;
    document.getElementById('question-text').innerText = q.q;
    const grid = document.getElementById('options-grid');
    grid.innerHTML = '';
    
    q.options.sort(() => 0.5 - Math.random()).forEach(opt => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.style.cssText = "background: #222; color: white; border: 1px solid #444; padding: 15px; cursor: pointer; transition: 0.2s;";
        btn.onclick = () => checkAnswer(opt);
        btn.onmouseover = () => btn.style.borderColor = "var(--rust-primary)";
        btn.onmouseout = () => btn.style.borderColor = "#444";
        grid.appendChild(btn);
    });
}

function checkAnswer(choice) {
    if (choice === activeQuestions[currentIdx].a) {
        score++;
        document.getElementById('score').innerText = `Score: ${score}`;
    }
    
    currentIdx++;
    if (currentIdx < 5) {
        showQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    document.getElementById('question-screen').style.display = 'none';
    const resScreen = document.getElementById('result-screen');
    resScreen.style.display = 'block';
    
    let msg = "";
    if (score === 5) msg = "Perfekt, Agent! Sie sind bereit für den Feldeinsatz.";
    else if (score >= 3) msg = "Gute Arbeit. Ein wenig mehr Studium der Handbücher schadet aber nicht.";
    else msg = "Training nicht bestanden. Schlösser scheinen nicht Ihre Stärke zu sein.";
    
    document.getElementById('result-text').innerText = `Ergebnis: ${score} von 5 korrekt. \n\n ${msg}`;
}
</script>