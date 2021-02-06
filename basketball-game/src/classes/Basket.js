'use strict';

export default class Basket {
    constructor(id, court) {
        this.court = court;
        this.element = document.getElementById(id);
        this.isCursorIn = false;
        this.init();
    }

    init() {
        this.element.onmouseenter = (e) => {
            e.preventDefault();
        }
        this.element.onmouseleave = (e) => {
            e.preventDefault();
        }
        this.element.ondragover = (e) => {
            e.preventDefault();
        }
        this.element.ondrop = (e) => {
            e.preventDefault();
            // const eventFromBall = e.dataTransfer.getData('ballDroppedOnTime');
            // if(eventFromBall) {
            //     console.log(eventFromBall);
            // }
        };
    }
}
