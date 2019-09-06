import { Layer, SimpleStyle } from 'src/app/mapfx/Layer';
import { LayerRenderer } from 'src/app/mapfx/LayerRenderer';
import * as uuidv4 from 'uuid/v4';
import { Observable, BehaviorSubject } from 'rxjs';
import { stat } from 'fs';
export class FileLayer<T> implements Layer {
  private _config: BehaviorSubject<SimpleStyle> = new BehaviorSubject(null);
  private leafletLayer: any = null;
  public readonly config: Observable<SimpleStyle> = this._config.asObservable();
  public renderer: LayerRenderer;
  private layer: T;
  public id: string;
  constructor (renderer: LayerRenderer, layer: T) {
    this.renderer = renderer;
    this.getShape();
    this.id = uuidv4();
    this.layer = layer;
  }
  async destroy() {
    const status = await this.renderer.remove(this.leafletLayer.id);
    this.renderer.renderer.MapObjectLayers.unsubscribe();
    return status;
  }

  async render() {
    const status = await this.renderer.add({ id: this.id, layer: this.layer });
    return status;
  }

  async setOptions(option: SimpleStyle) {
    this._config.next(option);
  }

  getOptions() {
    return this.config;
  }

  private getShape() {
    this.renderer.renderer.MapObjectLayers.subscribe(s => {
      if (s && s.length) {
        this.leafletLayer = s.find(lyr => lyr.id === this.id);
      }

    });
  }
}
