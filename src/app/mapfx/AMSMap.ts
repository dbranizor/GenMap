import { Layer } from './Layer';
import { BehaviorSubject } from 'rxjs';
import { Feature, GeoJsonObject, BBox, Polygon } from 'geojson';
import { Coordinate } from './GeometryLayerImpl';


/**
 * APS map class.
 *
 */
export interface AMSMap {

  /** Whatever map entity object is created by the frameworks (cesium Viewer, leaflet L.Map) */
  mapImplementation: unknown;
  mapBounds$: BehaviorSubject<Feature<Polygon>>;
  zoom$: BehaviorSubject<number>;

  flyTo(cord: Coordinate): Promise<any>;

  /**
   * Adds layer and stores reference in memory
   * @param  {Layer} layer
   * @returns Promise
   */
  addLayer(layer: Layer): Promise<Layer>;
  /**
   * Destroys layer on map
   * @param  {string} id
   * @returns Promise
   */
  removeLayer(id: string): Promise<Layer[]>;
}
