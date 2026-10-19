// Base de datos del rosco con respuestas oficiales
const questionsData = [
    { letter: "A", type: "empieza", answer: "AGUJERONEGRO", question: "Cuerpo celeste oscuro de gran densidad que absorbe todo lo que se encuentra en su entorno, incluida la luz." },
    { letter: "B", type: "empieza", answer: "BIG BANG", question: "Teoría que explica el nacimiento del Universo, partiendo de la idea de que toda la materia y energía del universo se originaron en una gran explosión." },
    { letter: "C", type: "empieza", answer: "COMETA", question: "Pequeño objeto helado que gira alrededor del Sol, y que al acercarse a él empieza a derretirse formando una larga cola luminosa característica." },
    { letter: "D", type: "contiene", answer: "ASTEROIDE", question: "Astros rocosos con tamaños y formas irregulares." },
    { letter: "E", type: "empieza", answer: "ESTRELLA", question: "Gran bola de gas caliente que brilla intensamente y cuyo color depende de su temperatura. Las rojas, aunque parezca mentira, son las menos calientes." },
    { letter: "F", type: "contiene", answer: "AFELIO", question: "Punto de la órbita de distancia máxima entre Tierra y Sol." },
    { letter: "G", type: "empieza", answer: "GRUPO LOCAL", question: "El nombre del cúmulo de galaxias en el que se encuentra la Vía Láctea." },
    { letter: "H", type: "empieza", answer: "HIDROGENO", question: "El elemento químico más pequeño (con 1 protón y 1 electrón) que junto al Helio forma el núcleo de estrellas como nuestro sol." },
    { letter: "I", type: "contiene", answer: "ESPIRAL BARRADA", question: "Tipo de galaxia que posee un centro galáctico en forma de barra y unos brazos que salen de ella. La Vía Láctea es así." },
    { letter: "J", type: "empieza", answer: "JUPITER", question: "Planeta más grande del Sistema Solar, su masa es 2.5 veces la de todos los demás." },
    { letter: "K", type: "empieza", answer: "KUIPER", question: "Cinturón de asteroides (descubierto en 1992) que giran alrededor del Sol a una distancia de 35 UA (algo más lejos que la órbita de Neptuno)." },
    { letter: "L", type: "empieza", answer: "LUNA", question: "Satélite natural con una cara oculta." },
    { letter: "M", type: "empieza", answer: "MARTE", question: "Si la Tierra fuera un tomate cherry, este planeta sería una mora." },
    { letter: "N", type: "empieza", answer: "NEPTUNO", question: "Planeta del Sistema Solar que se encuentra más alejado del Sol." },
    { letter: "Ñ", type: "contiene", answer: "AÑO LUZ", question: "Son 9,46 billones de kilómetros y sirve para medir distancias fuera del Sistema Solar." },
    { letter: "O", type: "empieza", answer: "ORBITA", question: "Curva cerrada que describe un cuerpo celeste o un satélite alrededor de otro cuerpo debido a la gravedad." },
    { letter: "P", type: "empieza", answer: "PLUTON", question: "Planeta del Sistema Solar que comparte su órbita y por eso es enano." },
    { letter: "Q", type: "contiene", answer: "PEQUEÑO", question: "Mercurio es el planeta que más lo es." },
    { letter: "R", type: "empieza", answer: "ROTACION", question: "Movimiento de un astro consistente en girar sobre su eje." },
    { letter: "S", type: "empieza", answer: "SATELITES", question: "Titán, Europa y Ganimedes lo son." },
    { letter: "T", type: "empieza", answer: "TELESCOPIO", question: "Instrumento que capta la radiación electromagnética, para producir una imagen de un objeto lejano." },
    { letter: "U", type: "empieza", answer: "UNIVERSO", question: "Conjunto de todo lo descubierto y por descubrirse." },
    { letter: "V", type: "empieza", answer: "VIA LACTEA", question: "Galaxia a la que pertenece el Sistema Solar." },
    { letter: "W", type: "empieza", answer: "WATER", question: "Solo la Tierra en el Sistema Solar la tiene en estado líquido (In English, please!)." },
    { letter: "X", type: "contiene", answer: "EXTERIORES", question: "Júpiter, Saturno, Urano y Neptuno son esos planetas." },
    { letter: "Y", type: "contiene", answer: "HALLEY", question: "Astrónomo inglés estudioso de los cometas, que predijo acertadamente que uno de ellos pasaría junto a la Tierra cada 76 años, por lo que se le puso al cometa su nombre." },
    { letter: "Z", type: "empieza", answer: "ZODIACO", question: "Conjunto de 12 constelaciones creado por los astrónomos antiguos al dividir la esfera celeste en partes iguales de 30º cada una." }
];

// Variables de estado
let currentIndex = 0;
let hits = 0;
let errors = 0;
let timeLeft = 150;
let timerInterval = null;
let questions = [];
let isUntimed = true;
let isMusicPlaying = false;

// Elementos DOM
const roscoElement = document.getElementById('rosco');
const letterTitle = document.getElementById('letter-title');
const definitionText = document.getElementById('definition-text');
const userInput = document.getElementById('user-input');
const btnSubmit = document.getElementById('btn-submit');
const btnPasapalabra = document.getElementById('btn-pasapalabra');
const timerDisplay = document.getElementById('timer');
const hitsDisplay = document.getElementById('hits-count');
const errorsDisplay = document.getElementById('errors-count');
const endModal = document.getElementById('end-modal');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const btnRestart = document.getElementById('btn-restart');
const gameModeSelect = document.getElementById('game-mode');
const btnMusic = document.getElementById('btn-music');
const bgMusic = document.getElementById('bg-music');

// Normalizar texto
function normalizeText(text) {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().replace(/\s+/g, '').trim();
}

// Inicializar el juego
function initGame() {
    hits = 0;
    errors = 0;
    currentIndex = 0;
    hitsDisplay.textContent = hits;
    errorsDisplay.textContent = errors;
    endModal.classList.add('hidden');
    userInput.value = '';

    isUntimed = gameModeSelect.value === 'untimed';

    if (isUntimed) {
        timerDisplay.textContent = "∞";
        clearInterval(timerInterval);
    } else {
        timeLeft = 150;
        timerDisplay.textContent = timeLeft;
        startTimer();
    }

    questions = questionsData.map(q => ({ ...q, state: 'pending' }));

    renderRosco();
    showCurrentQuestion();
}

// Controlar Música
function toggleMusic() {
    if (isMusicPlaying) {
        bgMusic.pause();
        btnMusic.textContent = "🎵 Música: OFF";
        isMusicPlaying = false;
    } else {
        bgMusic.play().then(() => {
            btnMusic.textContent = "🎵 Música: ON";
            isMusicPlaying = true;
        }).catch(e => {
            console.log("Error al reproducir audio:", e);
        });
    }
}

// Renderizar Rosco
function renderRosco() {
    roscoElement.innerHTML = '';
    const totalLetters = questions.length;
    const radius = 190;

    questions.forEach((q, index) => {
        const angle = (index / totalLetters) * 2 * Math.PI - (Math.PI / 2);
        const x = 230 + radius * Math.cos(angle) - 21;
        const y = 230 + radius * Math.sin(angle) - 21;

        const letterDiv = document.createElement('div');
        letterDiv.className = `letter-circle ${q.state}`;
        letterDiv.id = `letter-${index}`;
        letterDiv.textContent = q.letter;
        letterDiv.style.left = `${x}px`;
        letterDiv.style.top = `${y}px`;

        roscoElement.appendChild(letterDiv);
    });
}

// Mostrar pregunta actual
function showCurrentQuestion() {
    if (checkEndGame()) return;

    while (questions[currentIndex].state !== 'pending') {
        currentIndex = (currentIndex + 1) % questions.length;
    }

    document.querySelectorAll('.letter-circle').forEach(el => el.classList.remove('active'));
    const activeLetter = document.getElementById(`letter-${currentIndex}`);
    if (activeLetter) activeLetter.classList.add('active');

    const q = questions[currentIndex];
    const prefix = q.type === "empieza" ? "CON LA" : "CONTIENE LA";
    letterTitle.textContent = `${prefix} ${q.letter}`;
    definitionText.textContent = q.question;
    userInput.value = '';
    userInput.focus();
}

// Comprobar respuesta
function checkAnswer() {
    const userAns = normalizeText(userInput.value);
    if (!userAns) return;

    const currentQ = questions[currentIndex];
    const correctAns = normalizeText(currentQ.answer);

    if (userAns === correctAns) {
        currentQ.state = 'correct';
        hits++;
        hitsDisplay.textContent = hits;
    } else {
        currentQ.state = 'error';
        errors++;
        errorsDisplay.textContent = errors;
    }

    updateRoscoNode(currentIndex, currentQ.state);
    currentIndex = (currentIndex + 1) % questions.length;
    showCurrentQuestion();
}

// Pasapalabra
function passTurn() {
    const currentQ = questions[currentIndex];
    updateRoscoNode(currentIndex, 'pending');
    currentIndex = (currentIndex + 1) % questions.length;
    showCurrentQuestion();
}

// Actualizar nodo del rosco
function updateRoscoNode(index, state) {
    const node = document.getElementById(`letter-${index}`);
    if (node) {
        node.className = `letter-circle ${state}`;
    }
}

// Temporizador
function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (!isUntimed) {
            timeLeft--;
            timerDisplay.textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                endGame(false, "¡Se ha agotado el tiempo!");
            }
        }
    }, 1000);
}

// Comprobar fin de juego
function checkEndGame() {
    const hasPending = questions.some(q => q.state === 'pending');
    if (!hasPending) {
        clearInterval(timerInterval);
        endGame(true, "¡Has completado todas las palabras!");
        return true;
    }
    return false;
}

// Fin de juego
function endGame(completed, reason) {
    clearInterval(timerInterval);
    modalTitle.textContent = completed && errors === 0 ? "¡ENHORABUENA! ¡HAS GANADO EL BOTE!" : "Juego Terminado";
    modalMessage.textContent = `${reason} Has conseguido ${hits} aciertos y ${errors} fallos.`;
    endModal.classList.remove('hidden');
}

// Event Listeners
btnSubmit.addEventListener('click', checkAnswer);
btnPasapalabra.addEventListener('click', passTurn);
btnMusic.addEventListener('click', toggleMusic);

gameModeSelect.addEventListener('change', initGame);

userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        checkAnswer();
    } else if (e.key === ' ') {
        if (userInput.value.trim() === '') {
            e.preventDefault();
            passTurn();
        }
    }
});

btnRestart.addEventListener('click', initGame);

window.onload = initGame;