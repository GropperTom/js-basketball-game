'use strict';

// const Basketball =  function(id, court) {
//     this.court = court;
//     this.element = document.getElementById(id);
//     this.init();
//     this.color = 'orange';
// }
//
// Basketball.prototype.init = function() {
//     //
// }
//
// Basketball.prototype.spawn = function() {
//     this.element.hidden = false;
//     const randomX = Math.random() * 51;
//     const randomY = Math.random() * 51;
//     this.element.style.left = 25 + randomX + '%';
//     this.element.style.top = 25 + randomY + '%';
//     this.element.style.backgroundColor = 'red';
//     setTimeout(() => {
//         this.drag();
//         // this.element.draggable = true;
//         // this.element.ondragstart = (e) => {
//         //     this.currTop = e.clientX;
//         //     this.currLeft = e.clientY;
//         //     this.element.style.transition = '0.01s';
//         //     this.element.style.transform = 'translateX(-9999px)';
//         //     console.log('drag start');
//         // }
//         // this.element.ondragend = (e) => {
//         //     console.log('drag end');
//         //     this.court.dispatchEvent(new CustomEvent('ballDropped'));
//         //     this.element.style.transition = '0.01s';
//         //     this.element.style.transform = 'translateX(0px)';
//         //     const topChange = this.currTop - e.clientX;
//         //     const leftChange = this.currLeft - e.clientY;
//         //     this.element.style.top = (this.element.offsetTop - leftChange) + 'px';
//         //     this.element.style.left = (this.element.offsetLeft - topChange) + 'px';
//         // }
//
//         this.element.style.backgroundColor = this.color;
//         setTimeout(() => {
//             // this.element.ondragend = () => {};
//             // if(this.element.hidden === 'special') {
//             //     this.element.hidden = true;
//             // }
//             this.despawn();
//             // this.element.draggable = false;
//             // this.court.removeChild(this.element);
//             this.element.onmousedown = null;
//             this.element.onmouseup = null;
//             this.stopDrag();
//         }, 4000);
//     }, 4000);
// }
//
// Basketball.prototype.despawn = function() {
//     //
// }
//
// Basketball.prototype.drag = function() {
//     const startDrag = (e) => {
//         e.preventDefault();
//         currTop = e.clientX;
//         currLeft = e.clientY;
//         document.onmouseup = this.stopDrag;
//         document.onmousemove = onDrag;
//     }
//
//     const onDrag = (e) => {
//         e.preventDefault();
//         topChange = currTop - e.clientX;
//         leftChange = currLeft - e.clientY;
//         currTop = e.clientX;
//         currLeft = e.clientY;
//         this.element.style.top = (this.element.offsetTop - leftChange) + 'px';
//         this.element.style.left = (this.element.offsetLeft - topChange) + 'px';
//     }
//
//     let topChange, leftChange, currTop, currLeft;
//     this.element.onmousedown = startDrag;
//     this.element.onmouseup = (e) => {
//         this.element.hidden = true;
//         const elemBelow = document.elementFromPoint(e.clientX, e.clientY);
//         this.element.hidden = false;
//         if(elemBelow.id === 'basket') {
//             this.element.hidden = true;
//             this.court.scoreBasket(this);
//         }
//     }
// }
//
// Basketball.prototype.stopDrag = function() {
//     document.onmouseup = null;
//     document.onmousemove = null;
// }
//
// export default Basketball;

export default class Basketball {
    constructor(id, court) {
        this.court = court;
        this.element = document.getElementById(id);
        this.timerProperties = {
            start: 0,
            remaining: 4000,
            timerId: -1,
        }
        this.draggable = false;
        this.init();
    }

    // get color() {
    //     return this.color;
    // }
    //
    // set color(newColor) {
    //     this.color = newColor;
    // }

    init() {
        this.element.hidden = true;
    }

    pause() {
        window.clearTimeout(this.timerProperties.timerId);
        this.timerProperties.remaining -= Date.now() - this.timerProperties.start;
    }

    resume() {
        this.timerProperties.start = Date.now();
        this.timerProperties.timerId = setTimeout(this.draggable
            ? this.disableDrag
            : this.enableDrag,
            this.timerProperties.remaining);
    }

    resetTimerProperties() {
        this.timerProperties = {
            start: 0,
            remaining: 4000,
            timerId: -1
        };
    }

    spawn() {
        this.resetTimerProperties();
        this.element.hidden = false;
        const randomX = Math.random() * 56;
        const randomY = Math.random() * 56;
        this.element.style.left = 25 + randomX + '%';
        this.element.style.top = 20 + randomY + '%';

        // this.element.style.left = '25%';
        // this.element.style.top = '20%';
        //
        // this.element.style.left = '12.6%';
        // this.element.style.top = '12.6%';

        this.element.style.backgroundColor = 'red';
        this.timerProperties.start = Date.now();
        this.timerProperties.timerId = setTimeout(() => {
            // this.element.draggable = true;
            // this.element.ondragstart = (e) => {
            //     this.currTop = e.clientX;
            //     this.currLeft = e.clientY;
            //     this.element.style.transition = '0.01s';
            //     this.element.style.transform = 'translateX(-9999px)';
            //     console.log('drag start');
            // }
            // this.element.ondragend = (e) => {
            //     console.log('drag end');
            //     this.court.dispatchEvent(new CustomEvent('ballDropped'));
            //     this.element.style.transition = '0.01s';
            //     this.element.style.transform = 'translateX(0px)';
            //     const topChange = this.currTop - e.clientX;
            //     const leftChange = this.currLeft - e.clientY;
            //     this.element.style.top = (this.element.offsetTop - leftChange) + 'px';
            //     this.element.style.left = (this.element.offsetLeft - topChange) + 'px';
            // }
            this.enableDrag();
        }, 4000);
    }

    enableDrag() {
        this.resetTimerProperties();
        this.drag();
        this.draggable = true;
        this.element.style.backgroundColor = 'green';
        this.timerProperties.start = Date.now();
        this.timerProperties.timerId = setTimeout(() => {
            this.disableDrag();
        }, 4000);
    }

    disableDrag() {
        this.draggable = false;
        // this.element.ondragend = () => {};
        // if(this.type === 'special') {
        //     this.element.hidden = true;
        // }
        this.despawn();
        // this.element.draggable = false;
        // this.court.removeChild(this.element);
        this.element.onmousedown = null;
        this.element.onmouseup = null;
        this.stopDrag();
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
                this.court.scoreBasket(this);
            }
        }
    }

    stopDrag() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
