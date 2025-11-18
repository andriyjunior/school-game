// Game State
let currentGame = '';
let totalScore = 0;
let gameScore = 0;
let streak = 0;
let currentQuestion = 0;
let currentAnimal = null;
let selectedMatch = null;
let playerName = ''; // Player name for current session only
let playerClass = null; // Player class (grade) for current session only
let achievements = {
    firstWin: false,
    streak5: false,
    streak10: false,
    score50: false,
    score100: false,
    allGames: { guess: false, memory: false, spell: false, match: false, sound: false },
    speed: false,
    perfect: false,
    memory: false,
    spelling: false
};

// Stats and Achievements
function updateStats() {
    document.getElementById('total-score').textContent = totalScore;
    document.getElementById('streak-display').textContent = streak;
    const unlockedBadges = Object.values(achievements).filter(v => v === true || Object.values(v).some(x => x === true)).length;
    document.getElementById('badges-count').textContent = unlockedBadges + '/10';
    updateAchievements();
}

function updateAchievements() {
    const badges = [
        { id: 'firstWin', text: '★', title: 'Перша перемога', condition: achievements.firstWin },
        { id: 'streak5', text: '5', title: 'Серія 5', condition: achievements.streak5 },
        { id: 'streak10', text: '10', title: 'Серія 10', condition: achievements.streak10 },
        { id: 'score50', text: '50', title: '50 балів', condition: achievements.score50 },
        { id: 'score100', text: '100', title: '100 балів', condition: achievements.score100 },
        { id: 'allGames', text: '♛', title: 'Всі ігри', condition: Object.values(achievements.allGames).every(x => x) },
        { id: 'speed', text: '⚡', title: 'Швидкість', condition: achievements.speed },
        { id: 'memory', text: '♦', title: 'Пам\'ять', condition: achievements.memory },
        { id: 'spelling', text: '✎', title: 'Правопис', condition: achievements.spelling },
        { id: 'perfect', text: '♚', title: 'Ідеал', condition: achievements.perfect }
    ];

    const display = document.getElementById('achievements-display');
    display.innerHTML = '';
    badges.forEach(badge => {
        const div = document.createElement('div');
        div.className = 'badge' + (badge.condition ? '' : ' locked');
        div.textContent = badge.text;
        div.title = badge.title;
        display.appendChild(div);
    });
}

function checkAchievements() {
    if (totalScore >= 10 && !achievements.firstWin) {
        achievements.firstWin = true;
        showAchievement('Перша перемога!');
    }
    if (streak >= 5 && !achievements.streak5) {
        achievements.streak5 = true;
        showAchievement('Серія 5!');
    }
    if (streak >= 10 && !achievements.streak10) {
        achievements.streak10 = true;
        showAchievement('Серія 10!');
    }
    if (totalScore >= 50 && !achievements.score50) {
        achievements.score50 = true;
        showAchievement('50 балів!');
    }
    if (totalScore >= 100 && !achievements.score100) {
        achievements.score100 = true;
        showAchievement('100 балів!');
    }
    updateStats();
}

// Game Navigation
function startGame(gameType) {
    currentGame = gameType;
    gameScore = 0;
    currentQuestion = 0;
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('stats-bar').style.display = 'flex';

    // Class 2 - Animal Games
    if (gameType === 'guess') {
        document.getElementById('guess-game').classList.add('active');
        document.getElementById('guess-score').textContent = gameScore;
        nextGuessQuestion();
    } else if (gameType === 'memory') {
        document.getElementById('memory-game').classList.add('active');
        document.getElementById('memory-score').textContent = gameScore;
        setupMemoryGame();
    } else if (gameType === 'spell') {
        document.getElementById('spell-game').classList.add('active');
        document.getElementById('spell-score').textContent = gameScore;
        setupSpellGame();
    } else if (gameType === 'match') {
        document.getElementById('match-game').classList.add('active');
        document.getElementById('match-score').textContent = gameScore;
        setupMatchGame();
    } else if (gameType === 'sound') {
        document.getElementById('sound-game').classList.add('active');
        document.getElementById('sound-score').textContent = gameScore;
        nextSoundQuestion();
    }
    // Class 4 - CS Games
    else if (gameType === 'binary') {
        document.getElementById('binary-game').classList.add('active');
        document.getElementById('binary-score').textContent = gameScore;
        setupBinaryGame();
    } else if (gameType === 'parts') {
        document.getElementById('parts-game').classList.add('active');
        document.getElementById('parts-score').textContent = gameScore;
        setupPartsGame();
    } else if (gameType === 'algorithm') {
        document.getElementById('algorithm-game').classList.add('active');
        document.getElementById('algorithm-score').textContent = gameScore;
        setupAlgorithmGame();
    } else if (gameType === 'coding') {
        document.getElementById('coding-game').classList.add('active');
        document.getElementById('coding-score').textContent = gameScore;
        setupCodingGame();
    } else if (gameType === 'pattern') {
        document.getElementById('pattern-game').classList.add('active');
        document.getElementById('pattern-score').textContent = gameScore;
        setupPatternGame();
    }
}

function backToMenu() {
    document.querySelectorAll('.game-screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById('main-menu').style.display = 'grid';
    document.getElementById('stats-bar').style.display = 'flex';
    currentGame = '';
    gameScore = 0;
    currentQuestion = 0;
}

// ===== GUESS THE ANIMAL GAME =====
let guessStreak = 0;

function nextGuessQuestion() {
    document.getElementById('guess-next').classList.add('hidden');
    document.getElementById('guess-message').textContent = '';

    currentAnimal = animals[Math.floor(Math.random() * animals.length)];
    document.getElementById('animal-display').innerHTML = getAnimalIcon(currentAnimal.name);

    const options = [currentAnimal.name];
    while (options.length < 4) {
        const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
        if (!options.includes(randomAnimal.name)) {
            options.push(randomAnimal.name);
        }
    }

    shuffleArray(options);

    const optionsContainer = document.getElementById('guess-options');
    optionsContainer.innerHTML = '';
    options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = getMiniIcon(option) + option;
        btn.onclick = () => checkGuess(option, btn);
        optionsContainer.appendChild(btn);
    });
}

function checkGuess(answer, button) {
    const buttons = document.querySelectorAll('#guess-options .option-btn');
    buttons.forEach(btn => btn.disabled = true);

    if (answer === currentAnimal.name) {
        button.classList.add('correct');
        playSound('correct');
        gameScore += 10;
        totalScore += 10;
        streak++;
        guessStreak++;
        document.getElementById('guess-score').textContent = gameScore;
        document.getElementById('guess-message').textContent = 'Правильно! Молодець!';
        document.getElementById('guess-message').style.color = '#28a745';
        if (guessStreak > 0) {
            document.getElementById('guess-streak').style.display = 'inline-block';
            document.getElementById('guess-streak-count').textContent = guessStreak;
        }
        checkAchievements();
    } else {
        button.classList.add('wrong');
        playSound('wrong');
        streak = 0;
        guessStreak = 0;
        document.getElementById('guess-streak').style.display = 'none';
        document.getElementById('guess-message').textContent = 'Спробуй ще раз! Це ' + currentAnimal.name;
        document.getElementById('guess-message').style.color = '#dc3545';
        buttons.forEach(btn => {
            const btnText = btn.textContent || btn.innerText;
            if (btnText.includes(currentAnimal.name)) {
                btn.classList.add('correct');
            }
        });
    }

    updateStats();
    document.getElementById('guess-next').classList.remove('hidden');
}

// ===== MEMORY CARD GAME =====
let memoryCards = [];
let flippedCards = [];
let matchedPairs = 0;
let memoryLevel = 1;
let memoryTimer = 0;
let memoryInterval = null;

function setupMemoryGame() {
    clearInterval(memoryInterval);
    memoryTimer = 0;
    document.getElementById('memory-timer').textContent = 'Час: 0:00';

    memoryInterval = setInterval(() => {
        memoryTimer++;
        const minutes = Math.floor(memoryTimer / 60);
        const seconds = memoryTimer % 60;
        document.getElementById('memory-timer').textContent = 'Час: ' + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    }, 1000);

    const pairs = Math.min(4 + memoryLevel, 8);
    const selectedAnimals = [];
    const animalsCopy = [...animals];
    shuffleArray(animalsCopy);

    for (let i = 0; i < pairs; i++) {
        selectedAnimals.push(animalsCopy[i]);
    }

    memoryCards = [];
    selectedAnimals.forEach(animal => {
        memoryCards.push({ name: animal.name, id: animal.name + '1' });
        memoryCards.push({ name: animal.name, id: animal.name + '2' });
    });

    shuffleArray(memoryCards);
    flippedCards = [];
    matchedPairs = 0;

    const grid = document.getElementById('memory-grid');
    grid.innerHTML = '';
    grid.style.gridTemplateColumns = `repeat(${Math.ceil(Math.sqrt(memoryCards.length))}, 1fr)`;

    memoryCards.forEach((card, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'memory-card';
        cardDiv.innerHTML = `
            <div class="card-back">?</div>
            <div class="card-front">${getAnimalIcon(card.name)}</div>
        `;
        cardDiv.onclick = () => flipCard(cardDiv, card, index);
        grid.appendChild(cardDiv);
    });

    document.getElementById('memory-message').textContent = 'Знайди всі пари!';
}

function flipCard(cardDiv, card, index) {
    if (flippedCards.length >= 2 || cardDiv.classList.contains('flipped') || cardDiv.classList.contains('matched')) {
        return;
    }

    cardDiv.classList.add('flipped');
    flippedCards.push({ card, cardDiv, index });

    if (flippedCards.length === 2) {
        const [first, second] = flippedCards;

        if (first.card.name === second.card.name && first.index !== second.index) {
            playSound('correct');
            setTimeout(() => {
                first.cardDiv.classList.add('matched');
                second.cardDiv.classList.add('matched');
                matchedPairs++;
                gameScore += 20;
                totalScore += 20;
                streak++;
                document.getElementById('memory-score').textContent = gameScore;
                updateStats();
                checkAchievements();

                if (matchedPairs === memoryCards.length / 2) {
                    clearInterval(memoryInterval);
                    document.getElementById('memory-message').textContent = 'Всі пари знайдено! Час: ' + Math.floor(memoryTimer / 60) + ':' + (memoryTimer % 60 < 10 ? '0' : '') + (memoryTimer % 60);
                    playSound('success');
                    createConfetti();

                    if (memoryTimer < 60) {
                        achievements.speed = true;
                        showAchievement('Швидкість!');
                    }
                    if (memoryLevel >= 3) {
                        achievements.memory = true;
                        showAchievement('Майстер пам\'яті!');
                    }
                }
                flippedCards = [];
            }, 500);
        } else {
            playSound('wrong');
            streak = 0;
            updateStats();
            setTimeout(() => {
                first.cardDiv.classList.remove('flipped');
                second.cardDiv.classList.remove('flipped');
                flippedCards = [];
            }, 1000);
        }
    }
}

function nextMemoryRound() {
    memoryLevel++;
    setupMemoryGame();
}

// ===== SPELLING GAME =====
let spellQuestion = 0;
let spellTotal = 10;

function setupSpellGame() {
    spellQuestion = 0;
    nextSpellQuestion();
}

function nextSpellQuestion() {
    if (spellQuestion >= spellTotal) {
        document.getElementById('spell-message').textContent = 'Гра завершена! Рахунок: ' + gameScore;
        playSound('success');
        createConfetti();
        if (gameScore >= 80) {
            achievements.spelling = true;
            showAchievement('Майстер правопису!');
        }
        return;
    }

    currentAnimal = animals[Math.floor(Math.random() * animals.length)];
    document.getElementById('spell-display').innerHTML = getAnimalIcon(currentAnimal.name);
    document.getElementById('spell-hint').textContent = currentAnimal.hint;
    document.getElementById('spell-input').value = '';
    document.getElementById('spell-message').textContent = '';
    document.getElementById('spell-input').focus();

    const progress = (spellQuestion / spellTotal) * 100;
    document.getElementById('spell-progress').style.width = progress + '%';
    document.getElementById('spell-progress').textContent = spellQuestion + '/' + spellTotal;

    document.getElementById('spell-input').onkeyup = function(e) {
        if (e.key === 'Enter') {
            checkSpelling();
        }
    };
}

function checkSpelling() {
    const input = document.getElementById('spell-input').value.trim().toLowerCase();
    const correct = currentAnimal.name.toLowerCase();

    if (input === correct) {
        playSound('correct');
        gameScore += 10;
        totalScore += 10;
        streak++;
        document.getElementById('spell-score').textContent = gameScore;
        document.getElementById('spell-message').textContent = 'Правильно!';
        document.getElementById('spell-message').style.color = '#28a745';
        checkAchievements();
        updateStats();

        setTimeout(() => {
            spellQuestion++;
            nextSpellQuestion();
        }, 1500);
    } else {
        playSound('wrong');
        streak = 0;
        updateStats();
        document.getElementById('spell-message').textContent = 'Невірно! Правильно: ' + currentAnimal.name;
        document.getElementById('spell-message').style.color = '#dc3545';

        setTimeout(() => {
            spellQuestion++;
            nextSpellQuestion();
        }, 2000);
    }
}

// ===== MATCH WORDS GAME =====
let matchPairs = [];
let matchedPairsCount = 0;

function setupMatchGame() {
    document.getElementById('match-next').classList.add('hidden');
    document.getElementById('match-message').textContent = '';
    selectedMatch = null;
    matchedPairsCount = 0;

    const selectedAnimals = [];
    const animalsCopy = [...animals];
    shuffleArray(animalsCopy);

    for (let i = 0; i < 5; i++) {
        selectedAnimals.push(animalsCopy[i]);
    }

    matchPairs = selectedAnimals.map(animal => ({
        animal: animal.name,
        animalIcon: getAnimalIcon(animal.name),
        home: animal.home,
        matched: false
    }));

    const leftColumn = matchPairs.map(pair => ({ name: pair.animal, icon: pair.animalIcon }));
    const rightColumn = matchPairs.map(pair => pair.home);
    shuffleArray(rightColumn);

    const container = document.getElementById('match-container');
    container.innerHTML = `
        <div class="match-column" id="left-column"></div>
        <div class="match-column" id="right-column"></div>
    `;

    leftColumn.forEach((item) => {
        const div = document.createElement('div');
        div.className = 'match-item';
        div.innerHTML = '<div style="display:inline-block;width:40px;height:40px;vertical-align:middle;margin-right:10px;">' + item.icon + '</div>' + item.name;
        div.dataset.type = 'animal';
        div.dataset.value = item.name;
        div.onclick = () => selectMatch(div);
        document.getElementById('left-column').appendChild(div);
    });

    rightColumn.forEach((item) => {
        const div = document.createElement('div');
        div.className = 'match-item';
        div.textContent = item;
        div.dataset.type = 'home';
        div.dataset.value = item;
        div.onclick = () => selectMatch(div);
        document.getElementById('right-column').appendChild(div);
    });
}

function selectMatch(element) {
    if (element.classList.contains('matched')) return;

    if (!selectedMatch) {
        document.querySelectorAll('.match-item').forEach(item => {
            if (!item.classList.contains('matched')) {
                item.classList.remove('selected');
            }
        });
        element.classList.add('selected');
        selectedMatch = element;
    } else {
        if (selectedMatch.dataset.type === element.dataset.type) {
            return;
        }

        const animal = selectedMatch.dataset.type === 'animal' ? selectedMatch.dataset.value : element.dataset.value;
        const home = selectedMatch.dataset.type === 'home' ? selectedMatch.dataset.value : element.dataset.value;

        const pair = matchPairs.find(p => (p.animal === animal && p.home === home));

        if (pair) {
            playSound('correct');
            selectedMatch.classList.add('matched');
            element.classList.add('matched');
            matchedPairsCount++;
            gameScore += 15;
            totalScore += 15;
            streak++;
            document.getElementById('match-score').textContent = gameScore;
            document.getElementById('match-message').textContent = 'Правильно!';
            document.getElementById('match-message').style.color = '#28a745';
            checkAchievements();
            updateStats();

            if (matchedPairsCount === matchPairs.length) {
                setTimeout(() => {
                    document.getElementById('match-message').textContent = 'Всі пари знайдено! Молодець!';
                    document.getElementById('match-next').classList.remove('hidden');
                    playSound('success');
                    createConfetti();
                }, 500);
            }
        } else {
            playSound('wrong');
            streak = 0;
            updateStats();
            document.getElementById('match-message').textContent = 'Невірно! Спробуй ще раз';
            document.getElementById('match-message').style.color = '#dc3545';
            setTimeout(() => {
                document.getElementById('match-message').textContent = '';
            }, 1500);
        }

        selectedMatch.classList.remove('selected');
        selectedMatch = null;
    }
}

function nextMatchRound() {
    setupMatchGame();
}

// ===== ANIMAL SOUNDS GAME =====
function nextSoundQuestion() {
    document.getElementById('sound-next').classList.add('hidden');
    document.getElementById('sound-message').textContent = '';

    currentAnimal = animals[Math.floor(Math.random() * animals.length)];
    document.getElementById('sound-question').textContent = 'Хто говорить: "' + currentAnimal.sound + '"?';

    const options = [currentAnimal.name];
    while (options.length < 4) {
        const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
        if (!options.includes(randomAnimal.name)) {
            options.push(randomAnimal.name);
        }
    }

    shuffleArray(options);

    const optionsContainer = document.getElementById('sound-options');
    optionsContainer.innerHTML = '';
    options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = getMiniIcon(option) + option;
        btn.onclick = () => checkSound(option, btn);
        optionsContainer.appendChild(btn);
    });
}

function checkSound(answer, button) {
    const buttons = document.querySelectorAll('#sound-options .option-btn');
    buttons.forEach(btn => btn.disabled = true);

    if (answer === currentAnimal.name) {
        button.classList.add('correct');
        playSound('correct');
        gameScore += 10;
        totalScore += 10;
        streak++;
        document.getElementById('sound-score').textContent = gameScore;
        document.getElementById('sound-message').textContent = 'Правильно! Молодець!';
        document.getElementById('sound-message').style.color = '#28a745';
        checkAchievements();
        updateStats();
    } else {
        button.classList.add('wrong');
        playSound('wrong');
        streak = 0;
        updateStats();
        document.getElementById('sound-message').textContent = 'Невірно! Це ' + currentAnimal.name;
        document.getElementById('sound-message').style.color = '#dc3545';
        buttons.forEach(btn => {
            const btnText = btn.textContent || btn.innerText;
            if (btnText.includes(currentAnimal.name)) {
                btn.classList.add('correct');
            }
        });
    }

    document.getElementById('sound-next').classList.remove('hidden');
}

// Populate menu based on class
function populateMenu(classNumber) {
    const menu = document.getElementById('main-menu');
    menu.innerHTML = '';

    let games = [];

    if (classNumber === 2) {
        // Class 2 - Animal Games
        games = [
            { id: 'guess', name: 'Вгадай Тварину', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
            { id: 'memory', name: 'Знайди Пару', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
            { id: 'spell', name: 'Напиши Слово', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
            { id: 'match', name: "З'єднай Слова", gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
            { id: 'sound', name: 'Хто як говорить?', gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' }
        ];
    } else if (classNumber === 4) {
        // Class 4 - Computer Science Games
        games = [
            { id: 'binary', name: '🔢 Двійкові числа', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
            { id: 'parts', name: '🖥️ Частини комп\'ютера', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
            { id: 'algorithm', name: '📝 Алгоритми', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
            { id: 'coding', name: '💻 Основи програмування', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
            { id: 'pattern', name: '🧩 Закономірності', gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' }
        ];
    } else {
        // For other classes, show a message
        menu.innerHTML = '<div style="text-align:center; padding:40px; font-size:1.5em; color:#667eea;">Ігри для цього класу ще в розробці! 🎮</div>';
        return;
    }

    games.forEach(game => {
        const btn = document.createElement('button');
        btn.className = 'menu-btn';
        btn.textContent = game.name;
        btn.style.background = game.gradient;
        btn.onclick = () => startGame(game.id);
        menu.appendChild(btn);
    });
}

// Player Name Modal Handler
function initializePlayerName() {
    const modal = document.getElementById('name-modal');
    const nameInput = document.getElementById('player-name-input');
    const startBtn = document.getElementById('start-btn');
    const playerWelcome = document.getElementById('player-welcome');
    const classButtons = document.querySelectorAll('.class-btn');

    // Focus on input when page loads
    nameInput.focus();

    // Handle class selection
    classButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent form submission
            classButtons.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            playerClass = parseInt(btn.dataset.class);
        });
    });

    // Handle Enter key in input
    nameInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter' && nameInput.value.trim() && playerClass) {
            startGameSession();
        }
    });

    // Handle start button click
    startBtn.addEventListener('click', startGameSession);

    function startGameSession() {
        const name = nameInput.value.trim();

        // Validate name
        if (!name) {
            nameInput.style.borderColor = '#dc3545';
            nameInput.placeholder = 'Будь ласка, введи своє ім\'я';
            return;
        }

        // Validate class selection
        if (!playerClass) {
            alert('Будь ласка, вибери свій клас!');
            return;
        }

        playerName = name;
        modal.style.display = 'none';

        // Show welcome message with name and class
        playerWelcome.textContent = `Привіт, ${playerName}! 🎮 Ти в ${playerClass} класі`;
        playerWelcome.style.display = 'block';

        // Populate menu with games for this class
        populateMenu(playerClass);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializePlayerName();
    updateAchievements();
});
