/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Observable } from 'rxjs';
import { AbstractFilterableComponent } from './abstract.filterable.component';

export abstract class AbstractListComponent<T>  extends AbstractFilterableComponent<T> {

    protected pageNo: number = 0;
    protected pageSize: number = 5;
    protected hasMoreRows: boolean;

    constructor() {
        super();
    }

    onReadMore() {
        this.pageNo++;
        this.loadPage();
    }

    protected loadFirstPage(): void {
        this.pageNo = 1;
        super.loadFirstPage();
    }

    protected loadPage(): void {
        super.loadPage({"page-no": this.pageNo, "num-rows": this.pageSize});
    }

}
/*
*/
