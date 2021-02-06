'use strict';

import Timer from "./Timer";

export default class Basketball {
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
