
import { LayerRenderer, MapEntity } from '../../mapfx';
import { geoJSON } from 'leaflet';
import { GeoJsonObject } from 'geojson';
import * as uuid from 'uuid/v4';
import * as L from 'leaflet';
import { Renderer } from 'src/app/mapfx/LayerRenderer';
import { BehaviorSubject } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

export interface GeoJSONLayer {
  id: string;
  layer: GeoJsonObject;
}

export class GeoJSONRendererImpl implements LayerRenderer {
  renderer: Renderer = { MapObjectLayers: new BehaviorSubject([]), MapObject: null }
  private geoLeafLayers: any[] = [];
  constructor (map: L.Map) {
    this.renderer.MapObject = map;
  }

  private geometries: MapEntity[] = [];
  async add(shape: GeoJSONLayer): Promise<GeoJsonObject> {
    const geojsonLayer = geoJSON(shape.layer).addTo(this.renderer.MapObject);
    this.geoLeafLayers.push({ id: shape.id, layer: geojsonLayer });
    this.renderer.MapObjectLayers.next(this.geoLeafLayers);
    return geojsonLayer.toGeoJSON();
  }
  async remove(id): Promise<GeoJsonObject[]> {
    if (!id) {
      return null;
    }
    const geom = this.geoLeafLayers.find(l => l.id === id);
    this.renderer.MapObjectLayers.pipe(switchMap(l => l), filter(l => l.id !== id));
    this.renderer.MapObject.removeLayer(geom.layer);
    // @ts-ignore
    return await geom.entity;
  }

  update(shape: GeoJsonObject): Promise<GeoJsonObject[]> {
    const geom = this.geometries.find(l => l.id === shape);
    return null;
  }
}
