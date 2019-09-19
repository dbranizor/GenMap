import { Layer } from './Layer';

export abstract class AMSAbstractMap<T> {

    private layers: Layer[] = [];
    // Mapping Frameworks Implementation
    mapImplementation: T = null;

    constructor(mapImplementation: T) {
        this.mapImplementation = mapImplementation;
    }

    async addLayer(layer: Layer) {
        this.layers.push(layer);
        return layer;
    }

    async removeLayer(id: string): Promise<Layer[]> {
        const status = this.layers.find(l => l.id === id);
        status.destroy();
        this.layers = this.layers.filter(l => l.id !== id);
        return this.layers;
    }
}