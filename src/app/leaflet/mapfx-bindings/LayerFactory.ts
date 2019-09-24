import { FileLayer } from '../../mapfx';
import { GeoJSONRendererImpl } from './GeoJSONRendererImpl';
import { KMLRendererImpl } from './KMLRendererImpl';
import { GeoJsonGeometryTypes, GeoJsonObject } from 'geojson';
import * as L from 'leaflet';
import { LayerTypes, Layer } from 'src/app/mapfx/Layer';
import { LeafGeometryRendererImpl } from './LeafGeometryRendererImpl';
import { LayerRenderer } from 'src/app/mapfx/LayerRenderer';
import { GeometryLayerImpl } from 'src/app/mapfx/GeometryLayerImpl';


export class LayerFactory {

  public static map: L.Map = null;

  public static async createLayer(type: LayerTypes, entity: any): Promise<Layer> {
    let layer: Layer;
    if (type === LayerTypes.GeoJSON) {
      const renderer = new GeoJSONRendererImpl(this.map);
      layer = new FileLayer<GeoJsonObject>(renderer, entity);
    } else if (type === LayerTypes.KMZ) {
      const renderer = new KMLRendererImpl(this.map);
      layer = new FileLayer<XMLDocument>(renderer, entity);
    } else if (type === LayerTypes.Geometry) {
      const renderer: LayerRenderer = new LeafGeometryRendererImpl(this.map);
      layer = new GeometryLayerImpl(renderer, entity);

    } else {
      console.log('No Supported Layers')
    }

    return layer;

  }
}
