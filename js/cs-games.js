// Computer Science Games for 4th Grade

// ===== BINARY NUMBER GAME =====
let binaryQuestion = 0;
let binaryTotal = 8;
let currentBinary = null;

function setupBinaryGame() {
    binaryQuestion = 0;
    nextBinaryQuestion();
}

function nextBinaryQuestion() {
    if (binaryQuestion >= binaryTotal) {
        document.getElementById('binary-message').textContent = 'Молодець! Ти освоїв двійкові числа! Рахунок: ' + gameScore;
        document.getElementById('binary-next').classList.add('hidden');
        playSound('success');
        createConfetti();
        return;
    }

    currentBinary = binaryQuestions[Math.floor(Math.random() * binaryQuestions.length)];
    document.getElementById('binary-question').textContent = currentBinary.decimal;
    document.getElementById('binary-hint').textContent = currentBinary.hint;
    document.getElementById('binary-input').value = '';
    document.getElementById('binary-message').textContent = '';
    document.getElementById('binary-input').focus();

    document.getElementById('binary-input').onkeyup = function(e) {
        if (e.key === 'Enter') {
            checkBinary();
        }
    };
}

function checkBinary() {
    const input = document.getElementById('binary-input').value.trim();
    const correct = currentBinary.binary;

    if (input === correct) {
        playSound('correct');
        gameScore += 15;
        totalScore += 15;
        streak++;
        document.getElementById('binary-score').textContent = gameScore;
        document.getElementById('binary-message').textContent = `Правильно! ${currentBinary.decimal} в двійковій = ${currentBinary.binary}`;
        document.getElementById('binary-message').style.color = '#28a745';
        checkAchievements();
        updateStats();

        setTimeout(() => {
            binaryQuestion++;
            nextBinaryQuestion();
        }, 1500);
    } else {
        playSound('wrong');
        streak = 0;
        updateStats();
        document.getElementById('binary-message').textContent = `Невірно! ${currentBinary.decimal} в двійковій = ${currentBinary.binary}`;
        document.getElementById('binary-message').style.color = '#dc3545';

        setTimeout(() => {
            binaryQuestion++;
            nextBinaryQuestion();
        }, 2000);
    }
}

// ===== COMPUTER PARTS MATCHING GAME =====
let partsPairs = [];
let partsMatchedCount = 0;
let selectedPart = null;

function setupPartsGame() {
    document.getElementById('parts-next').classList.add('hidden');
    document.getElementById('parts-message').textContent = '';
    selectedPart = null;
    partsMatchedCount = 0;

    const selectedParts = [];
    const partsCopy = [...computerParts];
    shuffleArray(partsCopy);

    for (let i = 0; i < 5; i++) {
        selectedParts.push(partsCopy[i]);
    }

    partsPairs = selectedParts.map(part => ({
        name: part.name,
        icon: part.icon,
        function: part.function,
        matched: false
    }));

    const leftColumn = partsPairs.map(pair => ({ name: pair.name, icon: pair.icon }));
    const rightColumn = partsPairs.map(pair => pair.function);
    shuffleArray(rightColumn);

    const container = document.getElementById('parts-container');
    container.innerHTML = `
        <div class="match-column" id="parts-left-column"></div>
        <div class="match-column" id="parts-right-column"></div>
    `;

    leftColumn.forEach((item) => {
        const div = document.createElement('div');
        div.className = 'match-item';
        div.innerHTML = '<span style="font-size: 2em; margin-right: 10px;">' + item.icon + '</span>' + item.name;
        div.dataset.type = 'part';
        div.dataset.value = item.name;
        div.onclick = () => selectPart(div);
        document.getElementById('parts-left-column').appendChild(div);
    });

    rightColumn.forEach((item) => {
        const div = document.createElement('div');
        div.className = 'match-item';
        div.textContent = item;
        div.dataset.type = 'function';
        div.dataset.value = item;
        div.onclick = () => selectPart(div);
        document.getElementById('parts-right-column').appendChild(div);
    });
}

function selectPart(element) {
    if (element.classList.contains('matched')) return;

    if (!selectedPart) {
        document.querySelectorAll('.match-item').forEach(item => {
            if (!item.classList.contains('matched')) {
                item.classList.remove('selected');
            }
        });
        element.classList.add('selected');
        selectedPart = element;
    } else {
        if (selectedPart.dataset.type === element.dataset.type) {
            return;
        }

        const partName = selectedPart.dataset.type === 'part' ? selectedPart.dataset.value : element.dataset.value;
        const functionName = selectedPart.dataset.type === 'function' ? selectedPart.dataset.value : element.dataset.value;

        const pair = partsPairs.find(p => (p.name === partName && p.function === functionName));

        if (pair) {
            playSound('correct');
            selectedPart.classList.add('matched');
            element.classList.add('matched');
            partsMatchedCount++;
            gameScore += 20;
            totalScore += 20;
            streak++;
            document.getElementById('parts-score').textContent = gameScore;
            document.getElementById('parts-message').textContent = 'Правильно!';
            document.getElementById('parts-message').style.color = '#28a745';
            checkAchievements();
            updateStats();

            if (partsMatchedCount === partsPairs.length) {
                setTimeout(() => {
                    document.getElementById('parts-message').textContent = 'Всі пари знайдено! Молодець!';
                    document.getElementById('parts-next').classList.remove('hidden');
                    playSound('success');
                    createConfetti();
                }, 500);
            }
        } else {
            playSound('wrong');
            streak = 0;
            updateStats();
            document.getElementById('parts-message').textContent = 'Невірно! Спробуй ще раз';
            document.getElementById('parts-message').style.color = '#dc3545';
            setTimeout(() => {
                document.getElementById('parts-message').textContent = '';
            }, 1500);
        }

        selectedPart.classList.remove('selected');
        selectedPart = null;
    }
}

function nextPartsRound() {
    setupPartsGame();
}

// ===== ALGORITHM SEQUENCE GAME =====
let currentAlgorithm = null;
let algorithmIndex = 0;

function setupAlgorithmGame() {
    algorithmIndex = 0;
    nextAlgorithmTask();
}

function nextAlgorithmTask() {
    if (algorithmIndex >= algorithmTasks.length) {
        algorithmIndex = 0; // Loop back
    }

    currentAlgorithm = algorithmTasks[algorithmIndex];
    document.getElementById('algorithm-title').textContent = currentAlgorithm.title;
    document.getElementById('algorithm-message').textContent = '';
    document.getElementById('algorithm-check').classList.remove('hidden');
    document.getElementById('algorithm-next').classList.add('hidden');

    const shuffledSteps = [...currentAlgorithm.steps];
    shuffleArray(shuffledSteps);

    const container = document.getElementById('algorithm-container');
    container.innerHTML = '';

    shuffledSteps.forEach((step, index) => {
        const div = document.createElement('div');
        div.className = 'algorithm-step';
        div.draggable = true;
        div.innerHTML = `
            <span class="step-number">${index + 1}</span>
            <span>${step}</span>
        `;
        div.dataset.step = step;
        div.dataset.index = index;

        div.addEventListener('dragstart', handleDragStart);
        div.addEventListener('dragover', handleDragOver);
        div.addEventListener('drop', handleDrop);
        div.addEventListener('dragend', handleDragEnd);

        container.appendChild(div);
    });
}

let draggedElement = null;

function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    if (draggedElement !== this) {
        const container = document.getElementById('algorithm-container');
        const allSteps = [...container.children];
        const draggedIndex = allSteps.indexOf(draggedElement);
        const targetIndex = allSteps.indexOf(this);

        if (draggedIndex < targetIndex) {
            container.insertBefore(draggedElement, this.nextSibling);
        } else {
            container.insertBefore(draggedElement, this);
        }

        // Update numbers
        allSteps.forEach((step, idx) => {
            step.querySelector('.step-number').textContent = idx + 1;
        });
    }

    return false;
}

function handleDragEnd(e) {
    this.classList.remove('dragging');

    const container = document.getElementById('algorithm-container');
    const allSteps = [...container.children];
    allSteps.forEach((step, idx) => {
        step.querySelector('.step-number').textContent = idx + 1;
        step.dataset.index = idx;
    });
}

function checkAlgorithm() {
    const container = document.getElementById('algorithm-container');
    const steps = [...container.children];
    let correct = true;

    steps.forEach((step, index) => {
        const stepText = step.dataset.step;
        if (stepText === currentAlgorithm.steps[index]) {
            step.classList.add('correct');
            step.classList.remove('wrong');
        } else {
            step.classList.add('wrong');
            step.classList.remove('correct');
            correct = false;
        }
    });

    if (correct) {
        playSound('correct');
        gameScore += 25;
        totalScore += 25;
        streak++;
        document.getElementById('algorithm-score').textContent = gameScore;
        document.getElementById('algorithm-message').textContent = 'Відмінно! Алгоритм правильний!';
        document.getElementById('algorithm-message').style.color = '#28a745';
        document.getElementById('algorithm-check').classList.add('hidden');
        document.getElementById('algorithm-next').classList.remove('hidden');
        checkAchievements();
        updateStats();
        createConfetti();

        algorithmIndex++;
    } else {
        playSound('wrong');
        streak = 0;
        updateStats();
        document.getElementById('algorithm-message').textContent = 'Не зовсім! Спробуй ще раз';
        document.getElementById('algorithm-message').style.color = '#dc3545';

        setTimeout(() => {
            steps.forEach(step => {
                step.classList.remove('correct', 'wrong');
            });
            document.getElementById('algorithm-message').textContent = '';
        }, 2000);
    }
}

// ===== CODING CONCEPTS QUIZ =====
let codingIndex = 0;
let codingStreak = 0;
let currentCodingQuestion = null;

function setupCodingGame() {
    codingIndex = 0;
    codingStreak = 0;
    nextCodingQuestion();
}

function nextCodingQuestion() {
    if (codingIndex >= codingConcepts.length) {
        document.getElementById('coding-message').textContent = 'Вітаємо! Ти пройшов весь тест! Рахунок: ' + gameScore;
        document.getElementById('coding-message').style.color = '#28a745';
        document.getElementById('coding-next').classList.add('hidden');
        playSound('success');
        createConfetti();
        return;
    }

    document.getElementById('coding-next').classList.add('hidden');
    document.getElementById('coding-message').textContent = '';
    document.getElementById('coding-explanation').classList.remove('show');

    currentCodingQuestion = codingConcepts[codingIndex];
    document.getElementById('coding-question').textContent = currentCodingQuestion.question;

    const optionsContainer = document.getElementById('coding-options');
    optionsContainer.innerHTML = '';

    currentCodingQuestion.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option;
        btn.onclick = () => checkCodingAnswer(index, btn);
        optionsContainer.appendChild(btn);
    });
}

function checkCodingAnswer(selectedIndex, button) {
    const buttons = document.querySelectorAll('#coding-options .option-btn');
    buttons.forEach(btn => btn.disabled = true);

    if (selectedIndex === currentCodingQuestion.correct) {
        button.classList.add('correct');
        playSound('correct');
        gameScore += 15;
        totalScore += 15;
        streak++;
        codingStreak++;
        document.getElementById('coding-score').textContent = gameScore;
        document.getElementById('coding-message').textContent = 'Правильно! Молодець!';
        document.getElementById('coding-message').style.color = '#28a745';

        if (codingStreak > 0) {
            document.getElementById('coding-streak').style.display = 'inline-block';
            document.getElementById('coding-streak-count').textContent = codingStreak;
        }

        checkAchievements();
        updateStats();
    } else {
        button.classList.add('wrong');
        playSound('wrong');
        streak = 0;
        codingStreak = 0;
        document.getElementById('coding-streak').style.display = 'none';
        document.getElementById('coding-message').textContent = 'Невірно!';
        document.getElementById('coding-message').style.color = '#dc3545';
        updateStats();

        // Show correct answer
        buttons[currentCodingQuestion.correct].classList.add('correct');
    }

    // Show explanation
    document.getElementById('coding-explanation').textContent = currentCodingQuestion.explanation;
    document.getElementById('coding-explanation').classList.add('show');

    document.getElementById('coding-next').classList.remove('hidden');
    codingIndex++;
}

// ===== PATTERN RECOGNITION GAME =====
let patternIndex = 0;
let currentPattern = null;

function setupPatternGame() {
    patternIndex = 0;
    nextPattern();
}

function nextPattern() {
    if (patternIndex >= patterns.length) {
        patternIndex = 0; // Loop back
    }

    document.getElementById('pattern-next').classList.add('hidden');
    document.getElementById('pattern-message').textContent = '';

    currentPattern = patterns[patternIndex];
    document.getElementById('pattern-type').textContent = 'Тип: ' + currentPattern.type;

    const display = document.getElementById('pattern-display');
    display.innerHTML = '';

    currentPattern.sequence.forEach(item => {
        const div = document.createElement('div');
        div.className = 'pattern-item' + (item === '?' ? ' question' : '');
        div.textContent = item;
        display.appendChild(div);
    });

    const optionsContainer = document.getElementById('pattern-options');
    optionsContainer.innerHTML = '';

    currentPattern.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option;
        btn.style.fontSize = '2em';
        btn.onclick = () => checkPattern(index, btn);
        optionsContainer.appendChild(btn);
    });
}

function checkPattern(selectedIndex, button) {
    const buttons = document.querySelectorAll('#pattern-options .option-btn');
    buttons.forEach(btn => btn.disabled = true);

    if (selectedIndex === currentPattern.correct) {
        button.classList.add('correct');
        playSound('correct');
        gameScore += 20;
        totalScore += 20;
        streak++;
        document.getElementById('pattern-score').textContent = gameScore;
        document.getElementById('pattern-message').textContent = 'Правильно! Ти знайшов закономірність!';
        document.getElementById('pattern-message').style.color = '#28a745';
        checkAchievements();
        updateStats();
    } else {
        button.classList.add('wrong');
        playSound('wrong');
        streak = 0;
        updateStats();
        document.getElementById('pattern-message').textContent = 'Невірно! Правильна відповідь: ' + currentPattern.options[currentPattern.correct];
        document.getElementById('pattern-message').style.color = '#dc3545';

        buttons[currentPattern.correct].classList.add('correct');
    }

    document.getElementById('pattern-next').classList.remove('hidden');
    patternIndex++;
}
