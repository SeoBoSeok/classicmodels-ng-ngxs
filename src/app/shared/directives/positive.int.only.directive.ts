/*
*/
import { Directive, ElementRef, HostListener } from '@angular/core';

import { AbstractInputPrevent } from './abstract.input.prevent';

@Directive({
    selector: '[positiveIntOnly]'
})
export class PositiveIntOnlyDirective extends AbstractInputPrevent {

    private regex: RegExp;

    constructor(el: ElementRef) {
        super(el);
    }

    protected getRegex(): RegExp {
        if (!this.regex) {
            this.regex = new RegExp(/^[0-9]+$/g);
        }
        return this.regex;
    }
}
