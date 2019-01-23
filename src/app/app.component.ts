import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent {
    languages = {
        "ko": "Korean",
        "en": "English",
        "zh": "Chinese"
    };

    constructor (public translate: TranslateService)
    {
        translate.setDefaultLang('en');
        translate.use('en');
    }

    get languageCodes() {
        return Object.keys(this.languages);
    }

    get current_language() {
        return this.languages[this.translate.currentLang];
    }

    set_language(code) {
        this.translate.use(code);
    }

    scrollTop() {
        window.scrollTo(0, 0);
    }
}
