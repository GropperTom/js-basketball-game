'use strict';

import Basketball from "./Baskterball";
import SpecialBasketball from "./SpecialBasketball";
import Basket from "./Basket";
import Timer from "./Timer";

export default class Court {
    constructor(id) {
        this.specialBallExists = false;
        this.element = document.getElementById(id);
        this.regularBall = new Basketball('basketball', this);
        this.specialBall = new SpecialBasketball('special-basketball', this);
        this.regularBallTimer = null;
        this.specialBallTimer = null;
        this.gameTimeUpdateTimer = null;
        this.gameTimer = null;
        this.regularBallUpdateTimer = null;
        this.specialBallUpdateTimer = null;
        this.basket = new Basket('basket');
        this.scoreElement = document.getElementById('score');
        this.score = 0;
        this.isPaused = false;
        this.init();
    }

    init() {
        const pauseModal = document.getElementById('modal');
        const pauseButton = document.getElementById("pause-button");
        pauseButton.addEventListener('click', () => {
            this.isPaused = !this.isPaused;
            if(this.isPaused) {
                pauseModal.style.display = 'flex';
                pauseButton.textContent = 'Resume';
                this.pause();
            }
            else {
                pauseModal.style.display = 'none';
                pauseButton.textContent = 'Pause';
                this.resume();
            }
        });
    }

    run() {
        this.gameTimer = new Timer(this,() => {
            this.lose();
        }, 180, 0);
        this.gameTimer.start();

        const gameTimeUpdateTimerRepeat = () => {
            this.gameTimeUpdateTimer = new Timer(this,(court) => {
                document.getElementById('game-time').textContent = ((court.gameTimer.remainingTime() / 1000) | 0) + ' seconds';
                gameTimeUpdateTimerRepeat();
            }, 1, 0);
            this.gameTimeUpdateTimer.start();
        }
        gameTimeUpdateTimerRepeat();

        const regularTimerRepeat = (firstSpawn) => {
            this.regularBallTimer = new Timer(this,(court) => {
                if(!this.regularBall.scored && !firstSpawn) {
                    this.updateScore(-1);
                }
                court.regularBall.spawn();
                regularTimerRepeat(false);
            }, 8, 0);
            this.regularBallTimer.start();
        }
        regularTimerRepeat(true);

        const regularBallUpdateTimerRepeat = () => {
            this.regularBallUpdateTimer = new Timer(this,(court) => {
                if(court.regularBall.timer != null) {
                    document.getElementById('regular-ball-time').textContent = court.regularBall.timer.isDone || court.regularBall.scored
                        ? '- seconds'
                        : ((court.regularBall.timer.remainingTime() / 1000) | 0) + 1 + ' seconds';
                }
                else {
                    document.getElementById('regular-ball-time').textContent = '- seconds';
                }
                regularBallUpdateTimerRepeat();
            }, 1, 0);
            this.regularBallUpdateTimer.start();
        }
        regularBallUpdateTimerRepeat();

        const specialTimerRepeat = (firstSpawn) => {
            this.specialBallTimer = new Timer(this,(court) => {
                court.specialBallExists = true;
                court.specialBall.spawn();
                specialTimerRepeat(false);
            }, 20, 10);
            this.specialBallTimer.start();
        }
        specialTimerRepeat(true);

        const specialBallUpdateTimerRepeat = () => {
            this.specialBallUpdateTimer = new Timer(this,(court) => {
                if(court.specialBall.timer != null) {
                    document.getElementById('special-ball-time').textContent = ((court.specialBall.timer.remainingTime() / 1000) | 0) + 1 + ' seconds';
                    document.getElementById('special-ball-time').textContent = court.specialBall.timer.isDone || court.specialBall.scored
                        ? '- seconds'
                        : ((court.specialBall.timer.remainingTime() / 1000) | 0) + 1 + ' seconds';
                }
                else {
                    document.getElementById('special-ball-time').textContent = '- seconds';
                }
                specialBallUpdateTimerRepeat();
            }, 1, 0);
            this.specialBallUpdateTimer.start();
        }
        specialBallUpdateTimerRepeat();
    }

    pause() {
        this.gameTimer.pause();
        this.gameTimeUpdateTimer.pause();
        this.regularBallUpdateTimer.pause();
        this.regularBallTimer.pause();
        this.regularBall.pause();
        this.specialBallUpdateTimer.pause();
        this.specialBallTimer.pause();
        this.specialBall.pause();
    }

    resume() {
        this.gameTimer.start();
        this.gameTimeUpdateTimer.start();
        this.regularBallUpdateTimer.start();
        this.regularBallTimer.start();
        this.regularBall.resume();
        this.specialBallUpdateTimer.start();
        this.specialBallTimer.start();
        this.specialBall.resume();
    }

    updateScore(amount) {
        this.score += amount;
        this.scoreElement.textContent = 'score: ' + this.score;
        this.basket.flash(amount < 0 ? 'red' : 'green');
        if(this.score >= 10) {
            this.win();
        }
    }

    scoreBasket(ball) {
        if(ball instanceof SpecialBasketball) {
            this.specialBallExists = false;
        }
        const updateScore = ball instanceof SpecialBasketball
            ? 2
            : ball instanceof Basketball
                ? this.specialBallExists
                    ? -2
                    : 1
                : 0;
        this.updateScore(updateScore);
    }

    lose() {
        this.pause();
        document.getElementById('modal-text').textContent = "Time's up! You lost!";
        document.getElementById('modal').style.display = 'flex';
        document.getElementById("pause-button").hidden = true;
    }

    win() {
        this.pause();
        document.getElementById('modal-text').textContent = "You have 10 points or more! You won!";
        document.getElementById('modal').style.display = 'flex';
        document.getElementById("pause-button").hidden = true;
    }
}
