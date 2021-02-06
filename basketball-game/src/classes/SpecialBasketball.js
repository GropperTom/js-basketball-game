'use strict';

import Basketball from "./Baskterball";

// export default function SpecialBasketball(id, court) {
//     Basketball.call(this, id, court);
//     // this.color = 'yellow';
//     SpecialBasketball.prototype = Object.create(Basketball.prototype);
// }
//
// Object.defineProperty(SpecialBasketball.prototype, 'constructor', {
//     value: SpecialBasketball,
//     enumerable: false,
//     writable: true
// });
//
// SpecialBasketball.prototype.despawn = function() {
//     this.element.hidden = true;
//     this.court.secondBallExists = false;
// }
//
// SpecialBasketball.prototype.init = function() {
//     this.element.hidden = true;
// }

export default class SpecialBasketball extends Basketball {
    constructor(id, court) {
        super(id, court);
        this.element.hidden = true;
    }

    despawn() {
        this.element.hidden = true;
        this.court.secondBallExists = false;
    }
}
