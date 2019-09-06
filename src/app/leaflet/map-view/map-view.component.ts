import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MapService } from 'src/app/shared/services/map.service';
import * as L from 'leaflet';
import * as esri from 'esri-leaflet';
import { APSMap, Layer } from 'src/app/mapfx';
import { LeafletMap } from '../mapfx-bindings/LeafletMapImpl';
import { LayerFactory, LayerTypes } from '../mapfx-bindings/LayerFactory';
import { TracksService } from 'src/app/shared/services/tracks.service';



@Component({
  selector: 'map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements OnInit {
  private map: APSMap;
  private geoJSONLayer: Layer = null;
  private kmlLayer: Layer = null;
  private factory: LayerFactory = null;
  configs: any = {
    position: 'topright'
  };
  constructor (private mapSvc: MapService, private shpSvc: TracksService) {
  }

  ngOnInit() {
    const map = L.map('map').setView([39, -97.5], 4);
    const esriLayer = esri.basemapLayer('DarkGray');
    this.factory = new LayerFactory(map);
    map.addLayer(esriLayer);

    this.map = new LeafletMap(map);
    this.mapSvc.setMap(this.map);

    this.showGeoKML();

  }
  public handleChange(type) {
    type === 'geojson' ? this.showGeoJSON() :
      type === 'kml' ? this.showGeoKML() :
        console.log('No Matching Geometry for selection');
  }

  private async showGeoJSON() {
    if (this.kmlLayer) {
      await this.map.removeLayer(this.kmlLayer.id);
      this.kmlLayer = null;
    }

    const geoJSON = await this.shpSvc.geoJSON.toPromise();
    this.geoJSONLayer = this.factory.createLayer(LayerTypes.GeoJSON, geoJSON);
    const status = await this.map.addLayer(this.geoJSONLayer);

  }

  private async showGeoKML() {
    if (this.geoJSONLayer) {
      await this.map.removeLayer(this.geoJSONLayer.id);
      this.geoJSONLayer = null;
    }
    this.kmlLayer = this.factory.createLayer(LayerTypes.KMZ, 'assets/test-ships.kmz');
    const status = await this.map.addLayer(this.kmlLayer);

  }


}
