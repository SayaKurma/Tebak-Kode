let secretCode = generateSecretCode();
let attempts = 0;
const maxAttempts = 5;

document.getElementById('submitGuess').addEventListener('click', makeGuess);
document.getElementById('restart').addEventListener('click', restartGame);
document.getElementById('infoIcon').addEventListener('click', openModal);
document.getElementById('closeModal').addEventListener('click', closeModal);
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', showInfo);
});

function generateSecretCode() {
    let code = '';
    for (let i = 0; i < 5; i++) {
        code += Math.floor(Math.random() * 10);
    }
    return code;
}

function makeGuess() {
    const guessInput = document.getElementById('guessInput');
    const guess = guessInput.value;

    if (guess.length !== 5 || isNaN(guess)) {
        alert('Masukkan 5 digit angka!');
        return;
    }

    attempts++;
    const feedback = getFeedback(guess);
    displayGuess(guess, feedback);

    if (guess === secretCode) {
        document.getElementById('result').innerText = 'Selamat! Kamu menebak kode dengan benar!';
        document.getElementById('score').innerText = `Skor Kamu: ${calculateScore(attempts)}`;
        endGame();
    } else if (attempts >= maxAttempts) {
        document.getElementById('result').innerText = `Permainan berakhir! Kode rahasia adalah ${secretCode}.`;
        endGame();
    }

    guessInput.value = '';
}

function getFeedback(guess) {
    let feedback = [];
    let secretCodeArray = secretCode.split('');
    let guessArray = guess.split('');

    for (let i = 0; i < 5; i++) {
        if (guessArray[i] === secretCodeArray[i]) {
            feedback[i] = 'green';
            secretCodeArray[i] = null;
            guessArray[i] = 'X';
        } else {
            feedback[i] = null;
        }
    }

    for (let i = 0; i < 5; i++) {
        if (feedback[i] === null && secretCodeArray.includes(guessArray[i])) {
            feedback[i] = 'yellow';
            secretCodeArray[secretCodeArray.indexOf(guessArray[i])] = null;
        } else if (feedback[i] === null) {
            feedback[i] = 'red';
        }
    }

    return feedback;
}

function displayGuess(guess, feedback) {
    const guessesDiv = document.getElementById('guesses');
    const guessDiv = document.createElement('div');
    guessDiv.innerText = guess;

    feedback.forEach(color => {
        const feedbackDiv = document.createElement('span');
        feedbackDiv.className = 'feedback';
        feedbackDiv.style.backgroundColor = color;
        guessDiv.appendChild(feedbackDiv);
    });

    guessesDiv.appendChild(guessDiv);
}

function calculateScore(attempts) {
    return 100 - (attempts - 1) * 20;
}

function endGame() {
    document.getElementById('submitGuess').disabled = true;
    document.getElementById('restart').style.display = 'block';
}

function restartGame() {
    secretCode = generateSecretCode();
    attempts = 0;
    document.getElementById('guesses').innerHTML = '';
    document.getElementById('result').innerText = '';
    document.getElementById('score').innerText = '';
    document.getElementById('submitGuess').disabled = false;
    document.getElementById('restart').style.display = 'none';
    document.getElementById('guessInput').value = '';
}

function openModal() {
    document.getElementById('infoModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('infoModal').style.display = 'none';
    document.getElementById('infoContent').innerHTML = ''; 
}

function showInfo(event) {
    const contentType = event.target.getAttribute('data-content');
    let content = '';

    switch (contentType) {
        case 'deskripsi':
            content = `<h3>Deskripsi Permainan</h3>
                       <p>Tebak Kode adalah permainan logika dan deduksi di mana pemain harus menebak kombinasi angka rahasia yang terdiri dari 5 digit acak (0-9). Angka dalam kode dapat berulang, sehingga pemain perlu memperhatikan setiap tebakan dengan cermat.</p>`;
            break;
        case 'aturan':
            content = `<h3>Aturan Permainan</h3>
                       <ul>
                           <li>Pemain diberikan 5 kesempatan untuk menebak kode yang benar.</li>
                           <li>Setiap tebakan akan diberikan umpan balik dengan sistem warna:</li>
                           <ul>
                               <li>Hijau: Angka tersebut ada dalam kode dan posisinya sudah benar.</li>
                               <li>Kuning: Angka tersebut ada dalam kode, tetapi posisinya salah.</li>
                               <li>Merah: Angka tersebut tidak ada dalam kode.</li>
                           </ul>
                           <li>Pemain menggunakan informasi dari warna umpan balik untuk menyusun strategi di tebakan berikutnya.</li>
                           <li>Jika dalam 5 kali tebakan pemain belum berhasil menebak kode yang benar, permainan berakhir.</li>
                       </ul>`;
            break;
        case 'skor':
            content = `<h3>Rumus Perhitungan Skor</h3>
                       <p>Poin = 100 - (Jumlah Tebakan - 1) × 20</p>`;
            break;
    }

    document.getElementById('infoContent').innerHTML = content;
}

window.onclick = function(event) {
    const modal = document.getElementById('infoModal');
    if (event.target === modal) {
        closeModal();
    }
}
