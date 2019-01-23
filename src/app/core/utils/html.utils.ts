/*
 Copyright(c) 2009-2019 by GGoons.
*/

export class HtmlUtils {

    static loadExternalScript(scriptUrl: string, parent?:any, attrs?: any): Promise<any> {
        parent = (parent ? parent.nativeElement : document.body);
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = scriptUrl;
            if (attrs) {
                Object.keys(attrs).forEach((attr) => {
                    script[attr] = attrs[attr];
                });
            }
            script.onload = resolve;
            parent.appendChild(script);
        });
    }

}
