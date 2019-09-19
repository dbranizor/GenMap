import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MapService } from 'src/app/shared/services/map.service';
import * as L from 'leaflet';
import * as esri from 'esri-leaflet';
import { AMSMap, Layer } from 'src/app/mapfx';
import { LeafletMap } from '../mapfx-bindings/LeafletMapImpl';
import { LayerFactory } from '../mapfx-bindings/LayerFactory';
import { TracksService } from 'src/app/shared/services/tracks.service';
import * as env from '../../../environments/environment';
import { LayersService } from 'src/app/shared/services/layers.service';
import { LayerTypes } from 'src/app/mapfx/Layer';
// @ts-ignore
import {randomPolygon, randomPoint} from '@turf/turf' 
import { PolyLineShape, PolygonShape, PointShape } from 'src/app/mapfx/GeometryLayerImpl';
import { FeatureCollection } from 'geojson';


@Component({
  selector: 'map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements OnInit {
  private map: AMSMap;
  private geoJSONLayer: Layer = null;
  private kmlLayer: Layer = null;
  private factory: LayerFactory = null;
  private leafletMap: L.Map = null;
  configs: any = {
    position: 'topright'
  };
  constructor(private layerSvc: LayersService, private mapSvc: MapService, private shpSvc: TracksService) {
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
      try {
        await this.map.removeLayer(this.kmlLayer.id);
      } catch (exception) {
        console.error(' Error removing KML ', this.kmlLayer, exception);
      }

      this.kmlLayer = null;
    }

    try {
      const geoJSON = await this.shpSvc.geoJSON.toPromise();
      this.geoJSONLayer = this.factory.createLayer(LayerTypes.GeoJSON, geoJSON);
      const status = await this.map.addLayer(this.geoJSONLayer);
    } catch (exception) {
      console.error('Exception Creating GEOJSON', exception);
    }


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

  public handleGeometry(type){
    if(type === 'points'){
      this.showPoint()
    } else if (type === 'polygon') {
      this.showPolygon()
    } else if( type === 'linestring'){
      this.showLineString()
    } else {
      console.error('Dropdown Error', type);
    }
  }

  private showLineString(){
    const testLineString = {
      "type" : "FeatureCollection",
      "features" : [{
        "type" : "Feature",
        "geometry" : {
          "type" : "LineString",
          "coordinates" : [[-45, 0], [45, 0]]
        },
      }, {
        "type" : "Feature",
        "geometry" : {
          "type" : "LineString",
          "coordinates" : [[0, -45], [0, 45]]
        },
      }],

    }

    // @ts-ignore
    const layer: Layer = this.factory.createLayer(LayerTypes.Geometry, new PolyLineShape({geometry: testLineString, properties: {}}));
    this.map.addLayer(layer);
  }

  private showPolygon(){
    const polygon = randomPolygon(25, {bbox: [-180, 180, 90, -90]});

    const layer: Layer = this.factory.createLayer(LayerTypes.Geometry, new PolygonShape({geometry: polygon, properties: {}}))
    this.map.addLayer(layer);
  }

  private showPoint(){
    console.log('dingo randompoint', randomPoint);
    const points = randomPoint(25, {bbox: [-180, 180, 90, -90]});
      // @ts-ignore
    console.log('dingo ALL points', points);
    points.features.forEach(g => {
      const layer: Layer = this.factory.createLayer(LayerTypes.Geometry, new PointShape({geometry: g, properties: {}}));
      this.map.addLayer(layer);
    });
    
  }

  private async showGeoKML(type) {
    if (this.geoJSONLayer) {
      try {
        await this.map.removeLayer(this.geoJSONLayer.id);
      } catch (exception) {
        console.error('uncaught exception adding geojson', exception)
      }

      this.geoJSONLayer = null;
    }

    if (this.kmlLayer) {
      try {
        await this.map.removeLayer(this.kmlLayer.id);
      } catch (exception) {
        console.error('Exception  Happened', exception);
      }

      this.kmlLayer = null;
    }
    if (type === 'kmlOld') {
      try {
        this.kmlLayer = this.factory.createLayer(LayerTypes.KMZ, 'assets/test-ships-old.kmz');
      } catch (exception) {
        console.error('Exception Buildign KML Layer', exception);
      }

      const status = await this.map.addLayer(this.kmlLayer);
    } else {
      try {
        this.kmlLayer = this.factory.createLayer(LayerTypes.KMZ, 'assets/test-ships-configurable.kmz');
      } catch (exception) {
        console.error('Exception Building New KML', exception);
      }
      try {
        const status = await this.map.addLayer(this.kmlLayer);
      } catch (exception) {
        console.error('Error With Exception', exception)
      }

    }


  }


}
