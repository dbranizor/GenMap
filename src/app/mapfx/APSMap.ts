import { Observable } from 'rxjs';
import { BBox } from 'geojson';
import { Layer } from './Layer';
/**
 * APS map class.
 *
 */
export interface APSMap {
  mapObject: any;
  minZoom: Observable<number>;
  maxZoom: Observable<number>;

  /**
   * Flyto specific bounding box coordinates
   * @param  {BBox} coord
   * @returns Promise
   */
  setBounds(coord: BBox): Promise<BBox>;
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
