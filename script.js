document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.querySelector('.game-container');
    const movesCountEl = document.getElementById('moves-count');
    const timerEl = document.getElementById('timer');
    const restartBtn = document.getElementById('restart-btn');

    // Sons
    const flipSound = document.getElementById('flip-sound');
    const matchSound = document.getElementById('match-sound');
    const unmatchSound = document.getElementById('unmatch-sound');
    const winSound = document.getElementById('win-sound');

    // Images de base (28 images pour 56 cartes au total)
    const baseImages = [
        'dessin1.png', 'dessin2.png', 'dessin3.png', 'dessin4.png',
        'dessin5.png', 'dessin6.png', 'dessin7.png', 'dessin8.png',
        'dessin9.png', 'dessin10.png', 'dessin11.png', 'dessin12.png',
        'dessin13.png', 'dessin14.png', 'dessin15.png', 'dessin16.png',
        'dessin17.png', 'dessin18.png', 'dessin19.png', 'dessin20.png',
        'dessin21.png', 'dessin22.png', 'dessin23.png', 'dessin24.png',
        'dessin25.png', 'dessin26.png', 'dessin27.png', 'dessin28.png',
    ];

    // Crée la liste de 56 cartes pour le jeu
    const allCards = [...baseImages, ...baseImages];

    let shuffledCards;
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let matchedPairs = 0;
    let moves = 0;
    let timerInterval;
    let time = 0;

    // Fonction pour initialiser/réinitialiser le jeu
    function initGame() {
        gameContainer.innerHTML = '';
        shuffledCards = allCards.sort(() => Math.random() - 0.5);
        
        firstCard = null;
        secondCard = null;
        lockBoard = false;
        matchedPairs = 0;
        moves = 0;
        time = 0;

        movesCountEl.textContent = moves;
        timerEl.textContent = '0s';
        clearInterval(timerInterval);

        createCards();
        startTimer();
    }

    // Démarrer le minuteur
    function startTimer() {
        timerInterval = setInterval(() => {
            time++;
            timerEl.textContent = `${time}s`;
        }, 1000);
    }

    // Créer les cartes
    function createCards() {
        shuffledCards.forEach(image => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.image = image;

            card.innerHTML = `
                <div class="card-face card-front">
                    <img src="images/${image}" alt="Image de la carte">
                </div>
                <div class="card-face card-back"></div>
            `;

            card.addEventListener('click', flipCard);
            gameContainer.appendChild(card);
        });
    }

    // Gérer le retournement de la carte
    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;

        this.classList.add('flipped');
        if (flipSound) flipSound.play();

        if (!firstCard) {
            firstCard = this;
            return;
        }

        secondCard = this;
        lockBoard = true;
        
        moves++;
        movesCountEl.textContent = moves;

        checkForMatch();
    }

    // Vérifier si les cartes correspondent
    function checkForMatch() {
        const isMatch = firstCard.dataset.image === secondCard.dataset.image;

        isMatch ? disableCards() : unflipCards();
    }

    // Les cartes correspondent
    function disableCards() {
        if (matchSound) matchSound.play();
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');

        resetBoard();
        matchedPairs++;

        if (matchedPairs === baseImages.length) {
            if (winSound) winSound.play();
            clearInterval(timerInterval);
            
            setTimeout(revealWinText, 500);
        }
    }

    // Les cartes ne correspondent pas
    function unflipCards() {
        if (unmatchSound) unmatchSound.play();
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
        }, 1000);
    }

    // Réinitialiser les variables
    function resetBoard() {
        [firstCard, secondCard, lockBoard] = [null, null, false];
    }
    
    // Fonction pour révéler le texte de victoire sur les cartes
    function revealWinText() {
        const cards = document.querySelectorAll('.card');
        // Le message à afficher
        const winText = "BIENJOUE"; 
        const totalCards = cards.length;

        // On peut s'assurer que le message est assez long, sinon il se répétera
        if (winText.length < totalCards) {
            console.warn("Le message de victoire est plus court que le nombre de cartes. Il sera répété.");
        }

        cards.forEach((card, index) => {
            const letter = winText[index % winText.length];
            const cardFront = card.querySelector('.card-front');
            
            // Retirer le contenu précédent (l'image)
            cardFront.innerHTML = `<p>${letter}</p>`;
            // Ajouter la classe pour le style du texte
            cardFront.classList.add('win-text');
            // Retourner la carte
            card.classList.add('flipped');
        });
    }

    // Gérer le bouton de redémarrage
    restartBtn.addEventListener('click', () => {
        initGame();
    });

    // Lancer le jeu au chargement de la page
    initGame();
});