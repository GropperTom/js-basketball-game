'use strict';

export default class Basket {
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
