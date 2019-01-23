/*
*/
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

// usage: <input ... [autoTab]="'id-to-next-element'"
@Directive({
    selector: '[autoTab]'
})
export class AutoTabDirective {
    @Input('autoTab') idToNextElement: string;

    @HostListener('input', ['$event.target']) onInput(input) {
        const length = input.value.length
        const maxLength = input.attributes.maxlength.value
        if (length >= maxLength) {
          document.getElementById(this.idToNextElement).focus();
        }
    }
}
