class PhishGame {
  constructor(scenarios) {
    this.scenarios = scenarios;
    this.total = scenarios.length;
    
    // Persistent tracking
    this.currentIndex = parseInt(localStorage.getItem('phish_currentIndex')) || 0;
    this.score = parseInt(localStorage.getItem('phish_score')) || 0;
    
    this.setupEventHandlers();
    
    // If already finished, skip to end
    if (this.currentIndex >= this.total) {
      this.finishGame();
    }
  }

  setupEventHandlers() {
    // Action Buttons
    document.getElementById('clickButton').addEventListener('click', () => this.onAction('click'));
    document.getElementById('reportButton').addEventListener('click', () => this.onAction('report'));

    // Start Screen Buttons - Targets IDs from HTML
    const startBtn = document.getElementById('startButton');
    const instructBtn = document.getElementById('instructionButton');

    if (startBtn) {
      startBtn.addEventListener('click', () => this.startGame());
    }
    
    if (instructBtn) {
      instructBtn.addEventListener('click', () => {
        alert('Review each email. If legit, "Click Link". If fake, "Report Phishing".');
      });
    }
  }

  startGame() {
    // Hide start screen and show game
    document.getElementById('start').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'block';
    this.loadScenario(this.currentIndex);
  }

  loadScenario(index) {
    if (index >= this.total) {
      this.finishGame();
      return;
    }
    this.currentIndex = index;
    const scen = this.scenarios[index];
    
    document.getElementById('emailFrom').textContent = 'From: ' + scen.sender;
    document.getElementById('emailSubject').textContent = 'Subject: ' + scen.subject;
    document.getElementById('emailBody').textContent = scen.body;
    
    const linkEl = document.getElementById('emailLink');
    linkEl.textContent = scen.linkText;
    
    // Direct phishing to YouTube
    linkEl.href = scen.isPhishing ? "https://www.youtube.com/watch?v=ZprQXfyMkL4" : scen.linkText; 
    
    document.getElementById('currentIndex').textContent = index + 1;
    localStorage.setItem('phish_currentIndex', this.currentIndex);
  }

  onAction(actionType) {
    const scen = this.scenarios[this.currentIndex];
    const isPhish = scen.isPhishing;
    let correct = (actionType === 'report' && isPhish) || (actionType === 'click' && !isPhish);
    
    if (correct) {
      this.score++;
      localStorage.setItem('phish_score', this.score);
    }

    const feedbackEl = document.getElementById('feedback');
    feedbackEl.style.display = 'block';
    feedbackEl.className = correct ? 'feedback correct' : 'feedback incorrect';
    feedbackEl.textContent = correct ? '✅ Correct!' : '❌ Incorrect.';

    // Redirect for clicking
    if (actionType === 'click') {
        const url = isPhish ? "https://www.youtube.com/watch?v=ZprQXfyMkL4" : scen.linkText;
        setTimeout(() => window.open(url, '_blank'), 800); 
    }

    setTimeout(() => {
      feedbackEl.style.display = 'none';
      this.loadScenario(this.currentIndex + 1);
    }, 1500);
  }

  finishGame() {
    const gameContainer = document.getElementById('gameContainer');
    document.getElementById('start').style.display = 'none';
    gameContainer.style.display = 'block';
    gameContainer.innerHTML = `
        <h1>Simulation Complete!</h1>
        <p>Your score: ${this.score} / ${this.total}</p>
        <button class="btn" onclick="localStorage.clear(); location.reload();">Restart</button>
    `;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const game = new PhishGame(window.SCENARIOS || []);
});