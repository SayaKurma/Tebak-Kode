let secretCode = '';
let attempts = 0;
const maxAttempts = 5;

document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
    setupEventListeners();
});

function initializeGame() {
    secretCode = generateSecretCode();
    attempts = 0;
    resetGameUI();
}

function setupEventListeners() {
    const submitButton = document.getElementById('submitGuess');
    const restartButton = document.getElementById('restart');
    const infoIcon = document.getElementById('infoIcon');
    const closeModalButton = document.getElementById('closeModal');
    const menuItems = document.querySelectorAll('.menu-item');

    if (submitButton) submitButton.addEventListener('click', handleGuess);
    if (restartButton) restartButton.addEventListener('click', restartGame);
    if (infoIcon) infoIcon.addEventListener('click', openModal);
    if (closeModalButton) closeModalButton.addEventListener('click', closeModal);

    menuItems.forEach(item => item.addEventListener('click', handleInfoMenu));

    window.addEventListener('click', (event) => {
        if (event.target === document.getElementById('infoModal')) closeModal();
    });
}

function generateSecretCode() {
    return Array.from({ length: 5 }, () => Math.floor(Math.random() * 10)).join('');
}

function handleGuess() {
    const guessInput = document.getElementById('guessInput');
    const guess = guessInput.value;

    if (!validateGuess(guess)) return;

    attempts++;
    const feedback = generateFeedback(guess);
    displayGuess(guess, feedback);

    if (guess === secretCode) {
        handleWin();
    } else if (attempts >= maxAttempts) {
        handleLoss();
    }

    guessInput.value = '';
}

function validateGuess(guess) {
    if (guess.length !== 5 || isNaN(guess)) {
        alert('Masukkan 5 digit angka!');
        return false;
    }
    return true;
}

function generateFeedback(guess) {
    const secretArray = secretCode.split('');
    const guessArray = guess.split('');
    const feedback = new Array(5).fill(null);

    guessArray.forEach((digit, index) => {
        if (digit === secretArray[index]) {
            feedback[index] = 'green';
            secretArray[index] = null;
            guessArray[index] = null;
        }
    });

    guessArray.forEach((digit, index) => {
        if (digit !== null) {
            const matchIndex = secretArray.indexOf(digit);
            if (matchIndex !== -1) {
                feedback[index] = 'yellow';
                secretArray[matchIndex] = null;
            } else {
                feedback[index] = 'red';
            }
        }
    });

    return feedback;
}

function displayGuess(guess, feedback) {
    const guessesDiv = document.getElementById('guesses');
    const guessDiv = document.createElement('div');
    const guessText = document.createElement('span');

    guessText.textContent = guess;
    guessDiv.appendChild(guessText);

    feedback.forEach(color => {
        const feedbackDiv = document.createElement('span');
        feedbackDiv.className = 'feedback';
        feedbackDiv.style.backgroundColor = color;
        guessDiv.appendChild(feedbackDiv);
    });

    guessesDiv.appendChild(guessDiv);
    guessesDiv.scrollTop = guessesDiv.scrollHeight;
}

function handleWin() {
    document.getElementById('result').textContent = 'Selamat! Kamu menebak kode dengan benar!';
    document.getElementById('score').textContent = `Skor Kamu: ${calculateScore(attempts)}`;
    endGame();
}

function handleLoss() {
    document.getElementById('result').textContent = `Permainan berakhir! Kode rahasia adalah ${secretCode}.`;
    endGame();
}

function calculateScore(attempts) {
    return Math.max(0, 100 - (attempts - 1) * 20);
}

function endGame() {
    document.getElementById('submitGuess').disabled = true;
    document.getElementById('restart').style.display = 'block';
}

function restartGame() {
    secretCode = generateSecretCode();
    attempts = 0;

    document.getElementById('guesses').innerHTML = '';
    document.getElementById('result').textContent = '';
    document.getElementById('score').textContent = '';

    document.getElementById('submitGuess').disabled = false;
    document.getElementById('restart').style.display = 'none';
}

function openModal() {
    document.getElementById('infoModal').style.display = 'block';
    const deskripsiItem = document.querySelector('.menu-item[data-content="deskripsi"]');
    
    if (deskripsiItem) {
        document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
        deskripsiItem.classList.add('active');
    }
    
    showInfo('deskripsi');
}

function closeModal() {
    document.getElementById('infoModal').style.display = 'none';
}

function handleInfoMenu(event) {
    document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
    event.target.classList.add('active');
    showInfo(event.target.getAttribute('data-content'));
}

function showInfo(contentType) {
    const infoContent = document.getElementById('infoContent');
    let content = '';

    if (contentType === 'deskripsi') {
        content = `
            <h3>Deskripsi Permainan</h3>
            <p>Tebak Kode adalah permainan logika yang menantang. Tugasmu adalah menebak kombinasi 5 digit rahasia dalam 5 kesempatan. Gunakan petunjuk warna untuk mendekati kode yang benar!</p>
        `;
    } else if (contentType === 'aturan') {
        content = `
            <h3>Aturan Permainan</h3>
            <ul>
                <li>Kamu punya 5 kesempatan untuk menebak kode 5 digit</li>
                <li>Petunjuk warna akan membantu:</li>
                <li>🟢 Hijau: Angka benar dan posisi tepat</li>
                <li>🟡 Kuning: Angka benar tapi posisi salah</li>
                <li>🔴 Merah: Angka tidak ada dalam kode</li>
            </ul>
        `;
    } else if (contentType === 'skor') {
        content = `
            <h3>Perhitungan Skor</h3>
            <p>Poin = 100 - (Jumlah Tebakan - 1) * 20</p>
        `;
    }

    infoContent.innerHTML = content;
}

function resetGameUI() {
    document.getElementById('guessInput').value = '';
    document.getElementById('guesses').innerHTML = '';
    document.getElementById('result').textContent = '';
    document.getElementById('score').textContent = '';
    document.getElementById('submitGuess').disabled = false;
    document.getElementById('restart').style.display = 'none';
}
