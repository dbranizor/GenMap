import { Layer, SimpleStyle } from 'src/app/mapfx/Layer';
import { LayerRenderer } from 'src/app/mapfx/LayerRenderer';
import { Observable, BehaviorSubject } from 'rxjs';
import { AbstractLayer } from './AbstractLayer';


/**
 * FileLayer: Any sort of file that is passed to the map as a layer. 
 * THis can be GeoJSON, KML or KMZ
 *
 * FileLayerImpl will initialize a layer, assign an ID and coordinate with the renderer
 * FileLayerImpl is repsonsible for terminating the renderer's maplayer subscription 
 */
export class FileLayer<T> extends AbstractLayer<T> implements Layer {

  constructor(renderer: LayerRenderer, layer: T) {
    super(renderer, layer);
  }

}
