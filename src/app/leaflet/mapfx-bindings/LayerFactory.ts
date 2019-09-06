import { FileLayer } from '../../mapfx';
import { GeoJSONRendererImpl } from './GeoJSONRendererImpl';
import { KMLRendererImpl } from './KMLRendererImpl';
import { GeoJsonGeometryTypes, GeoJsonObject } from 'geojson';
import * as L from 'leaflet';

export enum LayerTypes {
  GeoJSON = 'GEOJSON',
  KMZ = 'KMZ'
}

export class LayerFactory {

  private map: L.Map = null;
  private entity: unknown = null;
  constructor (map: L.Map) {
    this.map = map;
  }

  public createLayer(type: LayerTypes, entity: any): FileLayer<GeoJsonGeometryTypes> | FileLayer<XMLDocument> {
    if (type === LayerTypes.GeoJSON) {
      const renderer = new GeoJSONRendererImpl(this.map);

      const layer: FileLayer<GeoJsonObject> = new FileLayer<GeoJsonObject>(renderer, entity);
      // @ts-ignore
      return layer;
    } else if (type === LayerTypes.KMZ) {
      const renderer = new KMLRendererImpl(this.map);
      const layer: FileLayer<XMLDocument> = new FileLayer<XMLDocument>(renderer, entity);
      return layer;
    } else {
      console.log('No Supported Layers')
    }

  }
}
