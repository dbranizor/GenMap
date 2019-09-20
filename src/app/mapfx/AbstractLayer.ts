import { BehaviorSubject } from 'rxjs';
import { SimpleStyle } from './Layer';
import { LayerRenderer } from './LayerRenderer';
import * as uuidv4 from 'uuid/v4';
export abstract class AbstractLayer<T> {

  /** map-specific layer */
  //TODO: Not a fan of this approach. May need to store this in the renderer
  private mapToolLayer: any = null;


  /** Observable representing the shape file */
  public shape$: BehaviorSubject<T> = new BehaviorSubject(null);
  private _shape: T = null;

  /** Configuration such as style properties */
  public config$: BehaviorSubject<SimpleStyle> = new BehaviorSubject(null);
  private _config: SimpleStyle = null;

  /** Layer Renderer specific to the FIleLayer type */
  public renderer: LayerRenderer;

  /** GUID ID that represents the layer for the internal AMS Map */
  public id: string;

  constructor (renderer: LayerRenderer, layer: T) {
    this.renderer = renderer;
    this.id = uuidv4();
    this.shape$.next(layer);
    this.shape$.subscribe(this.handleShape.bind(this));
    this.config$.subscribe(this.handleConfig.bind(this));

    this.getShape();
  }

  /**
   * Tells renderer to add a shape file.
   * @param shape - raw shape file that will be handed to the renderer
  */
  public async render() {
    console.log('dingo config running the render');
    const status = await this.renderer.add({ id: this.id, layer: this._shape, config: this._config });
    return status;
  }

  /**
   * Tells renderer to update the shape file.
   * @param shape - raw shape file that will be handed to the renderer
   */
  private async update() {
    console.log('dingo update config', this._config);
    if (this.mapToolLayer) {
      const status = await this.renderer.update({ id: this.id, layer: this._shape, config: this._config })

    }
  }

  /** Maintains Create + Update logic */
  private handleShape(shape: T) {
    if (!shape) {
      return;
    }
    this._shape = shape;

    if (this.mapToolLayer) {
      this.update();
    }
  }

  /** Handle Create and Update Properties for Shape Styles + Configs */
  private handleConfig(config: SimpleStyle) {
    if (!config) {
      return;
    }
    this._config = config;
    // Force update if layer has already been rendered
    if (this.mapToolLayer) {
      this.update();
    }

  }

  /**
   * Tells renderer to unload a layer from the file.
   * Important: Must unsubscripbe from the mapobject layers
   * @param shape - raw shape file that will be handed to the renderer
]   */
  async destroy() {
    console.log('dingo remove in abstract layer', this.mapToolLayer.id);
    if (this.mapToolLayer) {
      const status = await this.renderer.remove(this.mapToolLayer.id);
    }
    if (this.renderer.renderer.mapObjectLayers$) {
      this.renderer.renderer.mapObjectLayers$.unsubscribe();
    }

    return status;
  }

  private getShape() {
    this.renderer.renderer.mapObjectLayers$.subscribe(s => {
      if (s && s.length) {
        this.mapToolLayer = s.find(lyr => lyr.id === this.id);
      }

    });
  }


}
