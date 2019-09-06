import { Observable, BehaviorSubject } from 'rxjs';
export interface Renderer {
  MapObject: any;
  MapObjectLayers: BehaviorSubject<any[]>;
}
export interface LayerRenderer {
  renderer: Renderer;
  add(shape: unknown): Promise<unknown>;
  remove(id: string): Promise<any>;
  update(shape: any): Promise<any>;
}
