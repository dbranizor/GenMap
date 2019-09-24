
import { LayerRenderer, MapEntity } from '../../mapfx';
import { geoJSON } from 'leaflet';
import { GeoJsonObject } from 'geojson';
import * as uuid from 'uuid/v4';
import * as L from 'leaflet';
import { RendererState, AMSLayerData } from 'src/app/mapfx/LayerRenderer';
import { BehaviorSubject } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { render } from 'mustache';
const bball = require('../../shared/templates/bball.html');
const header = require('../../shared/templates/header.html');
const body = require('../../shared/templates/geojson-body.html');


export class GeoJSONRendererImpl implements LayerRenderer {
  renderer: RendererState = { mapObjectLayers$: new BehaviorSubject([]), MapObject: null }
  private geoLeafLayers: any[] = [];
  constructor (map: L.Map) {
    this.renderer.MapObject = map;
  }

  private geometries: MapEntity[] = [];
  async add(shape: AMSLayerData): Promise<GeoJsonObject> {
    const geojsonLayer = geoJSON(shape.layer, {
      onEachFeature: (feature, layer) => {
        layer.bindPopup(render(bball, { ...shape.config }, { header, body }));
      }
    }).addTo(this.renderer.MapObject);
    this.geoLeafLayers.push({ id: shape.id, layer: geojsonLayer });
    this.renderer.mapObjectLayers$.next(this.geoLeafLayers);
    return geojsonLayer.toGeoJSON();
  }
  async remove(id): Promise<GeoJsonObject[]> {
    if (!id) {
      return null;
    }
    const geom = this.geoLeafLayers.find(l => l.id === id);
    this.renderer.mapObjectLayers$.pipe(switchMap(l => l), filter(l => l.id !== id));
    this.renderer.MapObject.removeLayer(geom.layer);
    // @ts-ignore
    return await geom.entity;
  }

  update(shape: GeoJsonObject): Promise<GeoJsonObject[]> {
    const geom = this.geometries.find(l => l.id === shape);
    return;
  }

  destroy() {
    this.renderer.mapObjectLayers$.unsubscribe();
  }
}
