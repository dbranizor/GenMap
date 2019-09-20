import { Observable, BehaviorSubject } from 'rxjs';
import { SimpleStyle } from './Layer';
export interface RendererState {
  MapObject: any;
  mapObjectLayers$: BehaviorSubject<any[]>;
}
export interface AMSLayerData {
  id: string;
  config: SimpleStyle;
  layer: any;
}
export interface LayerRenderer {
  renderer: RendererState;
  add(shape: AMSLayerData): Promise<unknown>;
  remove(id: string): Promise<any>;
  update(shape: any): Promise<any>;
  destroy(): void;
}
