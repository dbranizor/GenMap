import { APSMap } from '../../mapfx';
import { BehaviorSubject } from 'rxjs';
import { BBox } from 'geojson';
import { Layer } from 'src/app/mapfx/Layer';
import * as L from 'leaflet';
export class LeafletMap implements APSMap {
  private layers: Layer[] = [];
  public mapObject: L.Map = null;
  public maxZoom: BehaviorSubject<number> = new BehaviorSubject(20);
  public minZoom: BehaviorSubject<number> = new BehaviorSubject(10);

  constructor (map: L.Map) {
    this.mapObject = map;
  }
  async setBounds(cord: BBox) {
    return null;
  }

  async addLayer(layer: Layer) {
    this.layers.push(layer);
    const status = layer.render();
    return status;
  }

  async removeLayer(id: string): Promise<Layer[]> {
    const status = this.layers.find(l => l.id === id);
    status.destroy();
    this.layers = this.layers.filter(l => l.id !== id);
    return this.layers;
  }
}
