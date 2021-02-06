'use strict';

import Basketball from "./Baskterball";

export default class SpecialBasketball extends Basketball {
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
