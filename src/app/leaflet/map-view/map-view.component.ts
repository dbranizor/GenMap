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
import { bboxPolygon } from '@turf/turf'
const { randomPolygon, randomPoint } = require('@turf/turf');
import { PolyLineShape, PolygonShape, PointShape, Coordinate } from 'src/app/mapfx/GeometryLayerImpl';
import { Feature, Polygon, FeatureCollection, Point } from 'geojson';

@Component({
  selector: 'map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements OnInit {
  private map: AMSMap;
  private geoJSONLayer: Layer = null;
  private kmlLayer: Layer = null;
  private layerFactory: LayerFactory = null;
  private leafletMap: L.Map = null;
  configs: any = {
    position: 'topright'
  };
  constructor (private layerSvc: LayersService, private mapSvc: MapService, private shpSvc: TracksService) {
  }

  ngOnInit() {
    this.leafletMap = L.map('map').setView([20, 23], 2.5);
    this.layerFactory = new LayerFactory(this.leafletMap);
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
      this.geoJSONLayer = await this.layerFactory.createLayer(LayerTypes.GeoJSON, geoJSON);
      this.geoJSONLayer.config$.next({ title: 'Test GEOJSON File with Custom Header', name: 'North America' });
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

  public handleGeometry(type) {
    if (type === 'points') {
      this.map.clear().then(res => this.showPoint());
    } else if (type === 'polygon') {
      this.map.clear().then(res => this.showPolygon());
    } else if (type === 'linestring') {
      this.map.clear().then(res => this.showLineString());
    } else {
      console.error('Dropdown Error', type);
    }
  }

  public handleBoundingBox(event) {
    // passing in bbox -- An Array of bounding box coordinates in the form: [xLow, yLow, xHigh, yHigh]
    const newYorknewYork: Feature<Polygon> = bboxPolygon([-131.4012646154, 23.7448325912, -62.1434521154, 51.6314584737]);
    this.map.mapBounds$.next(newYorknewYork);
  }

  public handleFlyTo(event) {
    const point: FeatureCollection<Point> = randomPoint(1);
    this.map
      .flyTo([point.features[0].geometry.coordinates[0], point.features[0].geometry.coordinates[1]])
      .catch(e => console.error('Got Error Flying To', e));
  }

  private handleZoom(level) {
    this.map.zoom$.next(+level);
  }

  private async showLineString() {

    // @ts-ignore
    const layer1: Layer = await this.layerFactory.createLayer(LayerTypes.Geometry, new PolyLineShape([[-45, 0], [45, 0]]));
    layer1.config$.next({ fill: "yellow", "stroke-width": 1 });

    const layer2: Layer = await this.layerFactory.createLayer(LayerTypes.Geometry, new PolyLineShape([[0, -45], [0, 45]]));
    layer2.config$.next({ fill: "red" });
    this.map.addLayer(layer1).then(s => this.map.addLayer(layer2)).then(response => {
      this.map.removeLayer(layer2.id)
    });
    // layer2.config$.next({ fill: "cyan" });

  }

  private showPolygon() {
    // var mypy: FeatureCollection = randomPolygon(25, { bbox: [-180, 180, 90, -90] });
    // @ts-ignore
    const polyArr: Array<Array<Coordinate>> = randomPolygon(25, { bbox: [-180, 180, 90, -90] }).features.map(f => {
      return f.geometry.coordinates.map(cord => {
        return cord.map(c => {
          return [c[0], c[1]];
        });
      });
    });
    polyArr.forEach(async (p) => {

      const layer: Layer = await this.layerFactory.createLayer(LayerTypes.Geometry, new PolygonShape([p]));
      // Update color to red
      layer.config$.next({ fill: 'red' });
      this.map.addLayer(layer);
    })

  }

  private showPoint() {
    const vesselType = ['', 'Cargo', 'Tanker', 'Fishing', 'Pleasure Vessel'];
    const flags = ['', 'US', 'China', 'Canada', 'Mexico'];
    const points = randomPoint(25, { bbox: [-180, 180, 90, -90] });
    // @ts-ignore
    points.features.forEach(async (g, i) => {
      g['properties'] = {
        title: 'Example Track',
        heading: Math.floor(Math.random() * 360),
        name: `Ship # ${i}`,
        vesselType: vesselType[Math.round(Math.random() * vesselType.length - 1)],
        flag: flags[Math.round(Math.random() * flags.length - 1)]
      };
      const layer: Layer = await this.layerFactory.createLayer(LayerTypes.Geometry, new PointShape(g.geometry.coordinates));
      layer.config$.next(g['properties']);
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
        this.kmlLayer = await this.layerFactory.createLayer(LayerTypes.KMZ, 'assets/test-ships-old.kmz');
      } catch (exception) {
        console.error('Exception Buildign KML Layer', exception);
      }

      const status = await this.map.addLayer(this.kmlLayer);
    } else {
      try {
        this.kmlLayer = await this.layerFactory.createLayer(LayerTypes.KMZ, 'assets/test-ships-configurable.kmz');
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
