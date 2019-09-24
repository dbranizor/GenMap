import { Layer } from './Layer';

export abstract class AMSAbstractMap<T> {


  private layers: Layer[] = [];
  // Mapping Frameworks Implementation
  mapImplementation: T = null;

  constructor (mapImplementation: T) {
    this.mapImplementation = mapImplementation;
  }

  async addLayer(layer: Layer) {
    this.layers.push(layer);
    return layer.render();
  }

  async removeLayer(id: string): Promise<Layer[]> {
    const layer = this.layers.find(l => l.id === id);
    layer.destroy();
    return this.layers;
  }

  async clear(): Promise<any> {
    return this.layers.forEach(l => l.destroy());
  }
}
