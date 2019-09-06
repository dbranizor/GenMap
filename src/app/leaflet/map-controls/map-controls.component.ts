import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { APSMapWidget, APSMap } from 'src/app/mapfx';
import { LeafletWidgetImpl } from '../mapfx-bindings/LeafletWidgetImpl';
import { MapService } from 'src/app/shared/services/map.service';

@Component({
  selector: 'map-control',
  template: `<div #wrapper><ng-content></ng-content></div>`,
  styleUrls: ['./map-controls.component.scss']
})
export class MapControlsComponent implements OnInit {

  @ViewChild('wrapper') wrapper: ElementRef;
  @Input() configs: any;
  @Input() name: string;

  public widget: APSMapWidget = null;
  public map: APSMap = null;
  public element: any = null;

  constructor (private mapService: MapService) { }

  ngOnInit() {
    this.mapService.apsMap.subscribe(m => this.initMap(m));
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
