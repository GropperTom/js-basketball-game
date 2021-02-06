'use strict';

import Basketball from "./Baskterball";
import SpecialBasketball from "./SpecialBasketball";
import Basket from "./Basket";

export default class Court {
    constructor(id) {
        this.specialBallExists = false;
        this.element = document.getElementById(id);
        this.regularBall = new Basketball('basketball', this);
        this.regularBallTimerProperties = {
            start: 0,
            remaining: 4000,
            timerId: -1,
        }
        this.specialBall = new SpecialBasketball('special-basketball', this);
        this.specialBallTimerProperties = {
            start: 0,
            remaining: 4000,
            timerId: -1,
        }
        this.basket = new Basket('basket');
        this.scoreElement = document.getElementById('score');
        this.score = 0;
        this.init();

        document.getElementById("pause-button").addEventListener('click', () => {
            console.log(this.regularBall.lifeSpanTimer);
            console.log(this.regularBall.activeTimer);
        })
    }

    init() {
        //
    }

    resetRegularTimerProperties() {
        this.regularBallTimerProperties = {
            start: 0,
            remaining: 4000,
            timerId: -1
        };
    }

    resetSpecialTimerProperties() {
        this.specialBallTimerProperties = {
            start: 0,
            remaining: 4000,
            timerId: -1
        };
    }

    spawnBall(ball, delay, randDelay, reset) {
        const rand = Math.random() * randDelay;

    }

    run() {
        this.regularBall.spawn();
        const ballTime = setInterval(() => {
            this.regularBall.spawn();
        }, 8000);

        const repeat = () => {
            let rand = Math.random() * 11;
            const specialBallTime = setTimeout(() => {
                this.specialBallExists = true;
                this.specialBall.spawn();
                repeat();
            }, 20000 + (rand * 1000));
        }
        repeat();
    }

    pause() {

    }

    scoreBasket(ball) {
        console.log(ball.color);
        if(ball instanceof SpecialBasketball) {
            this.specialBallExists = false;
        }
        this.score += ball instanceof SpecialBasketball
            ? 3
            : ball instanceof Basketball
                ? this.specialBallExists
                    ? -3
                    : 1
                : 0;
        console.log(this.specialBallExists, 'second exists');
        // if(ballType === 'special') {
        //     this.score += 3;
        //     this.secondBallExists = false;
        // }
        // else if(ballType === 'regular') {
        //     if(this.specialBallExists === true) {
        //         console.log("-3");
        //         this.score -= 3;
        //     }
        //     else {
        //         console.log("+1");
        //         ++this.score;
        //     }
        // }
        this.scoreElement.textContent = this.score + '';
    }
}
