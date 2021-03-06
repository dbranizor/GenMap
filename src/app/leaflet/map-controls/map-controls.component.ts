import { Component, OnInit, ViewChild, ElementRef, Input, OnDestroy } from '@angular/core';
import { AMSMapWidget, AMSMap } from 'src/app/mapfx';
import { LeafletWidgetImpl } from '../mapfx-bindings/LeafletWidgetImpl';
import { MapService } from 'src/app/shared/services/map.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'map-control',
  template: `<div #wrapper><ng-content></ng-content></div>`,
  styleUrls: ['./map-controls.component.scss']
})
export class MapControlsComponent implements OnInit, OnDestroy {

  @ViewChild('wrapper') wrapper: ElementRef;
  @Input() configs: any;
  @Input() name: string;

  public widget: AMSMapWidget = null;
  public map: AMSMap = null;
  private mapSubscription: Subscription = null;
  public element: any = null;

  constructor (private mapService: MapService) { }

  ngOnInit() {
    this.mapSubscription = this.mapService.apsMap.subscribe(m => this.initMap(m));
  }

  ngOnDestroy() {
    this.mapSubscription.unsubscribe();
  }

  private initMap(map: AMSMap) {

    if (!map) {
      return;
    }
    this.map = map;
    this.widget = new LeafletWidgetImpl(this.map);
    this.widget.add(this.wrapper.nativeElement, this.configs);
  }



}
