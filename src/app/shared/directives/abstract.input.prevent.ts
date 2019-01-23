/*
*/
import { Directive, ElementRef, HostListener } from '@angular/core';

export abstract class AbstractInputPrevent {
    private specialKeys: Array<string> = [ 
        'Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight'
    ];
    protected abstract getRegex(): RegExp;

    constructor(private el: ElementRef) {
    }

    @HostListener('keydown', [ '$event' ])
    onKeyDown(event: KeyboardEvent) {
//console.log("AbstractInputPrevent.keyDown");
        if (this.specialKeys.indexOf(event.key) !== -1) {
            return;
        }
        let prev: string = this.el.nativeElement.value;
        let curr: string = prev.concat(event.key);
        if (!curr.match(this.getRegex())) {
            event.preventDefault();
        }
    }
}
