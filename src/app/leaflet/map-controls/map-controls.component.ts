import { Component, OnInit, ViewChild, ElementRef, Input, OnDestroy } from '@angular/core';
import { APSMapWidget, APSMap } from 'src/app/mapfx';
import { LeafletWidgetImpl } from '../mapfx-bindings/LeafletWidgetImpl';
import { MapService } from 'src/app/shared/services/map.service';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'map-control',
  template: `<div #wrapper><ng-content></ng-content></div>`,
  styleUrls: ['./map-controls.component.scss']
})
export class MapControlsComponent implements OnInit, OnDestroy {

  @ViewChild('wrapper') wrapper: ElementRef;
  @Input() configs: any;
  @Input() name: string;

  public widget: APSMapWidget = null;
  public map: APSMap = null;
  public element: any = null;
  private unsubscribe$ = new Subject<void>();

  constructor(private mapService: MapService) { }

  ngOnInit() {
    this.mapService.apsMap
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(m => this.initMap(m));
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private initMap(map: APSMap) {

    if (!map) {
      return;
    }
    this.map = map;
    this.widget = new LeafletWidgetImpl(this.map.mapObject);
    this.widget.add(this.wrapper.nativeElement, this.configs);
  }



}
