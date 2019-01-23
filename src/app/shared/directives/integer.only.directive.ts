/*
*/
import { Directive, ElementRef, HostListener } from '@angular/core';

import { AbstractInputPrevent } from './abstract.input.prevent';

@Directive({
    selector: '[integerOnly]'
})
export class IntegerOnlyDirective extends AbstractInputPrevent {

    private regex: RegExp;

    constructor(el: ElementRef) {
        super(el);
    }

    protected getRegex(): RegExp {
        if (!this.regex) {
            this.regex = new RegExp(/^-?[0-9]+$/g);
        }
        return this.regex;
    }
}
