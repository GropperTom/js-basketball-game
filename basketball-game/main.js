'use strict';

class Timer {
    constructor(object, action, delay, randDelay) {
        this.isPaused = true;
        this.object = object;
        this.action = function(obj) {action(obj)};
        this.startTime = 0;
        this.remaining = delay * 1000;
        this.timerId = -1;
        this.randDelay = randDelay;
        this.isDone = false;
    }

    remainingTime() {
        return this.isDone
            ? 0
            : this.isPaused
                ? this.remaining
                : this.remaining - (Date.now() - this.startTime);
    }

    start() {
        this.isPaused = false;
        this.startTime = Date.now();
        const rand = ((Math.random() * (this.randDelay + 1)) | 0) * 1000;
        this.timerId = setTimeout(() => {
            this.isDone = true;
            this.action(this.object);
        }, this.remaining + rand);
    }

    pause() {
        this.isPaused = true;
        window.clearTimeout(this.timerId);
        this.remaining -= Date.now() - this.startTime;
    }
}

class Basketball {
    constructor(id, court) {
        this.court = court;
        this.element = document.getElementById(id);
        this.timer = null;
        this.init();
        this.scored = false;
    }

    init() {
        this.element.hidden = true;
    }

    spawn() {
        this.scored = false;
        this.element.hidden = false;
        const randomX = Math.random() * 56;
        const randomY = Math.random() * 56;
        this.element.style.left = 25 + randomX + '%';
        this.element.style.top = 20 + randomY + '%';

        this.element.style.backgroundColor = 'red';
        this.timer = new Timer(this, this.enableDrag, 4, 0);
        this.timer.start();
    }

    pause() {
        if(this.timer) {
            this.timer.pause();
        }
    }

    resume() {
        if(this.timer) {
            this.timer.start();
        }
    }

    enableDrag(ball) {
        ball.drag();
        ball.draggable = true;
        ball.element.style.backgroundColor = 'green';
        ball.timer = new Timer(ball, ball.disableDrag, 4, 0);
        ball.timer.start();
    }

    disableDrag(ball) {
        ball.draggable = false;
        ball.despawn();
        ball.element.onmousedown = null;
        ball.element.onmouseup = null;
        ball.stopDrag();
    }

    despawn() {
        //
    }

    drag() {
        const startDrag = (e) => {
            e.preventDefault();
            currTop = e.clientX;
            currLeft = e.clientY;
            document.onmouseup = this.stopDrag;
            document.onmousemove = onDrag;
        }

        const onDrag = (e) => {
            e.preventDefault();
            topChange = currTop - e.clientX;
            leftChange = currLeft - e.clientY;
            currTop = e.clientX;
            currLeft = e.clientY;
            this.element.style.top = (this.element.offsetTop - leftChange) + 'px';
            this.element.style.left = (this.element.offsetLeft - topChange) + 'px';
        }

        let topChange, leftChange, currTop, currLeft;
        this.element.onmousedown = startDrag;
        this.element.onmouseup = (e) => {
            this.element.hidden = true;
            const elemBelow = document.elementFromPoint(e.clientX, e.clientY);
            this.element.hidden = false;
            if(elemBelow.id === 'basket') {
                this.element.hidden = true;
                this.scored = true;
                this.court.scoreBasket(this);
            }
        }
    }

    stopDrag() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

class SpecialBasketball extends Basketball {
    constructor(id, court) {
        super(id, court);
        this.element.hidden = true;
    }

    despawn() {
        this.element.hidden = true;
        this.court.specialBallExists = false;
        if(!this.scored) {
            this.court.updateScore(-2);
        }
    }
}

class Court {
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

class Basket {
    constructor(id, court) {
        this.court = court;
        this.element = document.getElementById(id);
        this.init();
    }

    init() {
        this.element.style.borderLeftStyle = 'solid';
        this.element.style.borderLeftWidth = '5px';
        this.element.style.borderLeftColor = 'white';
    }

    flash(color) {
        this.element.style.borderLeftColor = color;
        setTimeout(() => {
            this.element.style.borderLeftColor = 'white';
        }, 1000);
    }
}

const court = new Court('court');
court.run();
