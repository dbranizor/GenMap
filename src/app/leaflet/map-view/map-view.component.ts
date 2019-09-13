import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MapService } from 'src/app/shared/services/map.service';
import * as L from 'leaflet';
import * as esri from 'esri-leaflet';
import { APSMap, Layer } from 'src/app/mapfx';
import { LeafletMap } from '../mapfx-bindings/LeafletMapImpl';
import { LayerFactory, LayerTypes } from '../mapfx-bindings/LayerFactory';
import { TracksService } from 'src/app/shared/services/tracks.service';
import * as env from '../../../environments/environment';
import { LayersService } from 'src/app/shared/services/layers.service';


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
  private leafletMap: L.Map = null;
  configs: any = {
    position: 'topright'
  };
  constructor (private layerSvc: LayersService, private mapSvc: MapService, private shpSvc: TracksService) {
  }

  ngOnInit() {
    this.leafletMap = L.map('map').setView([20, 23], 2.5);
    this.factory = new LayerFactory(this.leafletMap);
    this.map = new LeafletMap(this.leafletMap);
    this.mapSvc.setMap(this.map);

    if (env.environment.embedded) {
      this.getEmbeddedLayer();
    } else {
      this.getNonEmbeddedLayer();
    }

    this.showGeoKML('kmlOld');

  }

  public handleChange(type) {
    type === 'geojson' ? this.showGeoJSON() : this.showGeoKML(type);
  }

  public handleBaseLayerChange(type) {
    console.log('dingo setting base layer');
    type === 'embedded' ? this.getEmbeddedLayer() : this.getNonEmbeddedLayer();
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

  private async getEmbeddedLayer() {


    const baseLayerName = env.environment.baseLayer;
    L.tileLayer(`/assets/${baseLayerName}/{z}/{x}/{y}.png`,
      { maxZoom: 6 }).addTo(this.leafletMap);

  }

  private async getNonEmbeddedLayer() {

    const esriLayer = esri.basemapLayer('DarkGray');
    this.leafletMap.addLayer(esriLayer);
  }

  private async showGeoKML(type) {
    if (this.geoJSONLayer) {
      await this.map.removeLayer(this.geoJSONLayer.id);
      this.geoJSONLayer = null;
    }

    if (this.kmlLayer) {
      await this.map.removeLayer(this.kmlLayer.id);
      this.kmlLayer = null;
    }
    if (type === 'kmlOld') {
      this.kmlLayer = this.factory.createLayer(LayerTypes.KMZ, 'assets/test-ships-old.kmz');
      const status = await this.map.addLayer(this.kmlLayer);
    } else {
      this.kmlLayer = this.factory.createLayer(LayerTypes.KMZ, 'assets/test-ships-configurable.kmz');
      const status = await this.map.addLayer(this.kmlLayer);
    }


  }


}
