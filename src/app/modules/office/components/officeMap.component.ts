/*
 Copyright(c) 2009-2019 by GGoons.
*/
import { Component, Inject, Input, Output, OnInit, OnDestroy, 
         EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Observer, from, of } from 'rxjs';
import { 
    distinctUntilChanged, 
    concatMap, delay, filter, flatMap, map, takeWhile, skip, tap 
} from 'rxjs/operators';

import { OfficeFacade } from '../state/office.facade';
import {
    SERVER_HOST,
    Office,
    Employee,
    OfficeService,
    ArrayUtils,
    DateUtils,
    ObjectUtils,
    StringUtils,
    UriUtils,
    CoreModule
} from '../../../core';
import { AbstractFilterableComponent } from '../../abstract.filterable.component';

declare var google: any;

@Component({
    selector: 'office-map',
    templateUrl: 'officeMap.component.html',
    styles: [`
        html, body { height: 100%; margin: 0; padding: 0; }
        #map { height: 100%; }
    `]
})
export class OfficeMapComponent extends AbstractFilterableComponent<Office> implements OnInit, OnDestroy {

    offices: Office[];
    office: Office;
    employeeListFilter: any;
    protected map: any;
    protected geocoder: any;

    constructor(
        public translate: TranslateService,
        public route: ActivatedRoute,
        public router: Router,
        private officeFacade: OfficeFacade
    ) {
        super();

        officeFacade.officeMap$.pipe(
                takeWhile(() => this.isAlived),
                filter(offices => !!offices && offices.length > 0),
                distinctUntilChanged()
    ,tap(offices => this.initMap(offices))
            )
            .subscribe(offices => this.offices = offices);

        this.officeFacade.selectedOfficeInOfficeMap$
            .pipe(takeWhile(() => this.isAlived))
            .subscribe(office => this.office = office)
            ;

        officeFacade.selectedOfficeParamsToEmployeeListInOfficeMap$
            .pipe(takeWhile(() => this.isAlived))
            .pipe(
                takeWhile(() => this.isAlived),
                filter(value => !!value),
                distinctUntilChanged()
            )
            .subscribe(employeeListFilter => this.employeeListFilter = employeeListFilter)
            ;
    }

    ngOnInit() {
        this.initLoadByParams(this.route);
    }

    createFilterToEmbeddedTasks(office: Office) {
        this.officeFacade.selectedOfficeInOfficeMap(office);
        this.officeFacade.selectedOfficeParamsToEmployeeListInOfficeMap({
            "officeCode": office.officeCode
        });
    }

    protected setConditionsToObserver(conditions: any): void {
        this.officeFacade.getOfficeMap(conditions);
    }

    rowSelected(office: Office) : void {
        this.createFilterToEmbeddedTasks(office);
    }

    protected initMap(offices: Array<Office>) {
        if (!this.map) {
            this.createMap();
        }
        if (!this.geocoder) {
            this.geocoder = new google.maps.Geocoder();
        }

        offices.forEach(office => {
                let content = "<table class='table table-border'>"
                    + "<tr><td>" + this.translate.instant('officeCode') + "</td><td>" + office.officeCode + "</td></tr>"
                    + "<tr><td>" + this.translate.instant('city') + "</td><td>" + office.city + "</td></tr>"
                    + "<tr><td>" + this.translate.instant('phone') + "</td><td>" + office.phone + "</td></tr>"
                    + "<tr><td>" + this.translate.instant('addressLine1') + "</td><td>" + office.addressLine1 + "</td></tr>"
                    + "<tr><td>" + this.translate.instant('addressLine2') + "</td><td>" + office.addressLine2 + "</td></tr>"
                    + "<tr><td>" + this.translate.instant('state') + "</td><td>" + office.state + "</td></tr>"
                    + "<tr><td>" + this.translate.instant('country') + "</td><td>" + office.country + "</td></tr>"
                    + "<tr><td>" + this.translate.instant('postalCode') + "</td><td>" + office.postalCode + "</td></tr>"
                    + "<tr><td>" + this.translate.instant('territory') + "</td><td>" + office.territory + "</td></tr>"
                    + "</table>"
                    ;
                let address = office.city + " " + office.addressLine1 + " " + office.addressLine2;
                this.geocoding(address)
                    .subscribe(geoResults => {
                        geoResults.forEach(r => {
                            let latlng = r.geometry.location;
                    //console.log(counter+": addr: "+address+", latlng: "+latlng);
                            this.addMarkerAndContent(latlng, content, office);
                            let oldCenter = this.map.getCenter();
                    //console.log("old Center: "+oldCenter);
                            if (!oldCenter) {
                                console.log("set new Center: "+latlng);
                                this.map.setZoom(13);
                                this.map.setCenter(latlng);
                                this.map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
                            }
                        });
                    }, 
                    err => console.log("Error: "+err)
                );
            }); 
    }

    createMap() {
    //console.log("createMap()...");
        let mapEle = document.getElementById('map');
        this.map = new google.maps.Map(mapEle);
        google.maps.event.addListenerOnce(this.map, 'idle', () => {
            mapEle.classList.add('show-map');
        });
    //console.log("done.");
    }

    addMarkerAndContent(latlng: any, content: string, office: Office) {
        let marker = new google.maps.Marker({
            map: this.map, 
            animation: google.maps.Animation.DROP, 
            position: latlng
        });
        this.addInfoWindow(marker, content, office);
    }

    addInfoWindow(marker, content, office) {
        let infoWindow = new google.maps.InfoWindow({ content: content });
        google.maps.event.addListener(marker, 'click', () => {
            infoWindow.open(this.map, marker);
            this.rowSelected(office);
        });
    }

    geocoding(address: string): Observable<any> {
    //console.log("geocoding()...")
        return new Observable((observer: Observer<any[]>) => {
            // Invokes geocode method of Google Maps API geocoding.
            this.geocoder.geocode({ 'address': address }, (
                // Results & status.
                (results: any[], status: any) => {
                    if (status === google.maps.GeocoderStatus.OK) {
                        observer.next(results);
                        observer.complete();

                    } else {
                        console.log('Geocoding service: geocode was not successful for the following reason: ' + status);
                        observer.error(status);
                    }
                })
            );
        });
    }

}
