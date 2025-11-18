// ===== 2ND GRADE GAMES (2 КЛАС) =====
// Age: 7-8 years - Simple games for younger children

// Game 1: Count Animals
let countGameData = [];
let countCurrentQuestion = 0;

function setupCountGame() {
    countCurrentQuestion = 0;
    nextCountQuestion();
}

function nextCountQuestion() {
    if (countCurrentQuestion >= 5) {
        document.getElementById('count-message').textContent = '🎉 Гра завершена! Рахунок: ' + gameScore;
        playSound('success');
        createConfetti();
        return;
    }

    const animal = animals[Math.floor(Math.random() * animals.length)];
    const count = Math.floor(Math.random() * 5) + 1; // 1-5 animals

    document.getElementById('count-question').textContent = 'Порахуй скільки тут тварин:';

    const displayContainer = document.getElementById('count-display');
    displayContainer.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const icon = document.createElement('div');
        icon.style.width = '80px';
        icon.style.height = '80px';
        icon.style.display = 'inline-block';
        icon.style.margin = '10px';
        icon.innerHTML = getAnimalIcon(animal.name);
        displayContainer.appendChild(icon);
    }

    const options = [count];
    while (options.length < 4) {
        const num = Math.floor(Math.random() * 7) + 1;
        if (!options.includes(num)) {
            options.push(num);
        }
    }
    shuffleArray(options);

    const optionsContainer = document.getElementById('count-options');
    optionsContainer.innerHTML = '';
    options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option;
        btn.style.fontSize = '2em';
        btn.onclick = () => checkCount(option, count, btn);
        optionsContainer.appendChild(btn);
    });
}

function checkCount(answer, correct, button) {
    const buttons = document.querySelectorAll('#count-options .option-btn');
    buttons.forEach(btn => btn.disabled = true);

    if (answer === correct) {
        button.classList.add('correct');
        playSound('correct');
        gameScore += 10;
        totalScore += 10;
        streak++;
        document.getElementById('count-score').textContent = gameScore;
        document.getElementById('count-message').textContent = 'Правильно! Молодець!';
        document.getElementById('count-message').style.color = '#28a745';
        checkAchievements();
        updateStats();
    } else {
        button.classList.add('wrong');
        playSound('wrong');
        streak = 0;
        updateStats();
        document.getElementById('count-message').textContent = 'Невірно! Правильна відповідь: ' + correct;
        document.getElementById('count-message').style.color = '#dc3545';
        buttons.forEach(btn => {
            if (parseInt(btn.textContent) === correct) {
                btn.classList.add('correct');
            }
        });
    }

    setTimeout(() => {
        countCurrentQuestion++;
        nextCountQuestion();
    }, 2000);
}

// Game 2: Color Matching
const colors = [
    { name: 'Червоний', color: '#FF0000', emoji: '🍎' },
    { name: 'Синій', color: '#0000FF', emoji: '🫐' },
    { name: 'Жовтий', color: '#FFD700', emoji: '🍋' },
    { name: 'Зелений', color: '#00FF00', emoji: '🍏' },
    { name: 'Помаранчевий', color: '#FF8C00', emoji: '🍊' },
    { name: 'Фіолетовий', color: '#800080', emoji: '🍇' },
    { name: 'Рожевий', color: '#FFB6C1', emoji: '🌸' },
    { name: 'Коричневий', color: '#8B4513', emoji: '🥔' }
];

let colorCurrentQuestion = 0;

function setupColorGame() {
    colorCurrentQuestion = 0;
    nextColorQuestion();
}

function nextColorQuestion() {
    if (colorCurrentQuestion >= 5) {
        document.getElementById('color-message').textContent = '🎉 Гра завершена! Рахунок: ' + gameScore;
        playSound('success');
        createConfetti();
        return;
    }

    const currentColor = colors[Math.floor(Math.random() * colors.length)];

    document.getElementById('color-display').innerHTML = `
        <div style="width: 200px; height: 200px; background: ${currentColor.color};
                    border-radius: 20px; margin: 20px auto; box-shadow: 0 10px 30px rgba(0,0,0,0.3);"></div>
    `;

    const options = [currentColor.name];
    while (options.length < 3) {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        if (!options.includes(randomColor.name)) {
            options.push(randomColor.name);
        }
    }
    shuffleArray(options);

    const optionsContainer = document.getElementById('color-options');
    optionsContainer.innerHTML = '';
    options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option;
        btn.onclick = () => checkColor(option, currentColor.name, btn);
        optionsContainer.appendChild(btn);
    });
}

function checkColor(answer, correct, button) {
    const buttons = document.querySelectorAll('#color-options .option-btn');
    buttons.forEach(btn => btn.disabled = true);

    if (answer === correct) {
        button.classList.add('correct');
        playSound('correct');
        gameScore += 10;
        totalScore += 10;
        streak++;
        document.getElementById('color-score').textContent = gameScore;
        document.getElementById('color-message').textContent = 'Правильно! Це ' + correct + '!';
        document.getElementById('color-message').style.color = '#28a745';
        checkAchievements();
        updateStats();
    } else {
        button.classList.add('wrong');
        playSound('wrong');
        streak = 0;
        updateStats();
        document.getElementById('color-message').textContent = 'Невірно! Це ' + correct;
        document.getElementById('color-message').style.color = '#dc3545';
        buttons.forEach(btn => {
            if (btn.textContent === correct) {
                btn.classList.add('correct');
            }
        });
    }

    setTimeout(() => {
        colorCurrentQuestion++;
        nextColorQuestion();
    }, 2000);
}

// Game 3: Simple Shapes
const shapes = [
    { name: 'Коло', svg: '<circle cx="50" cy="50" r="40" fill="#FF6B6B"/>' },
    { name: 'Квадрат', svg: '<rect x="10" y="10" width="80" height="80" fill="#4ECDC4"/>' },
    { name: 'Трикутник', svg: '<polygon points="50,10 10,90 90,90" fill="#FFD93D"/>' },
    { name: 'Зірка', svg: '<polygon points="50,5 61,35 92,35 67,55 78,85 50,65 22,85 33,55 8,35 39,35" fill="#6BCF7F"/>' },
    { name: 'Серце', svg: '<path d="M50,85 C50,85 10,55 10,35 C10,20 20,10 30,10 C40,10 50,20 50,30 C50,20 60,10 70,10 C80,10 90,20 90,35 C90,55 50,85 50,85" fill="#FF6B9D"/>' }
];

let shapeCurrentQuestion = 0;

function setupShapeGame() {
    shapeCurrentQuestion = 0;
    nextShapeQuestion();
}

function nextShapeQuestion() {
    if (shapeCurrentQuestion >= 5) {
        document.getElementById('shape-message').textContent = '🎉 Гра завершена! Рахунок: ' + gameScore;
        playSound('success');
        createConfetti();
        return;
    }

    const currentShape = shapes[Math.floor(Math.random() * shapes.length)];

    document.getElementById('shape-display').innerHTML = `
        <svg viewBox="0 0 100 100" style="width: 200px; height: 200px; margin: 20px auto; display: block;">
            ${currentShape.svg}
        </svg>
    `;

    const options = [currentShape.name];
    while (options.length < 3) {
        const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
        if (!options.includes(randomShape.name)) {
            options.push(randomShape.name);
        }
    }
    shuffleArray(options);

    const optionsContainer = document.getElementById('shape-options');
    optionsContainer.innerHTML = '';
    options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option;
        btn.onclick = () => checkShape(option, currentShape.name, btn);
        optionsContainer.appendChild(btn);
    });
}

function checkShape(answer, correct, button) {
    const buttons = document.querySelectorAll('#shape-options .option-btn');
    buttons.forEach(btn => btn.disabled = true);

    if (answer === correct) {
        button.classList.add('correct');
        playSound('correct');
        gameScore += 10;
        totalScore += 10;
        streak++;
        document.getElementById('shape-score').textContent = gameScore;
        document.getElementById('shape-message').textContent = 'Правильно! Це ' + correct + '!';
        document.getElementById('shape-message').style.color = '#28a745';
        checkAchievements();
        updateStats();
    } else {
        button.classList.add('wrong');
        playSound('wrong');
        streak = 0;
        updateStats();
        document.getElementById('shape-message').textContent = 'Невірно! Це ' + correct;
        document.getElementById('shape-message').style.color = '#dc3545';
        buttons.forEach(btn => {
            if (btn.textContent === correct) {
                btn.classList.add('correct');
            }
        });
    }

    setTimeout(() => {
        shapeCurrentQuestion++;
        nextShapeQuestion();
    }, 2000);
}
