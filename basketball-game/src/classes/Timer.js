'use strict';

export default class Timer {
    // constructor(action, delay) {
    //     this.action = action;
    //     this.startTime = 0;
    //     this.remaining = delay * 1000;
    //     this.timerId = -1;
    //     this.randDelay = 0;
    // }

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
