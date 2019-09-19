import { LayerRenderer, MapEntity, Layer } from '../../mapfx';
import * as L from 'leaflet';
import 'jszip';
import 'leaflet-kml';
import 'leaflet-kmz';
import { Renderer, AMSLayerData } from 'src/app/mapfx/LayerRenderer';
import { BehaviorSubject } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators'


export interface KMZLayer {
  id: string;
  layer: string;
}

export class KMLRendererImpl implements LayerRenderer {

  renderer: Renderer = { mapObjectLayers$: new BehaviorSubject([]), MapObject: null };
  private kmzParser: any = null;
  private leafletLayers: any[] = [];
  constructor (map: L.Map) {
    this.renderer.MapObject = map;
    this.renderer.mapObjectLayers$.subscribe(l => this.leafletLayers = l);
  }

  async add(ly: AMSLayerData) {
    console.log('dingo adding kmzlayer', ly);
    // @ts-ignore
    this.kmzParser = new L.KMZParser({
      onKMZLoaded: (leaflayer, name) => {
        this.leafletLayers.push({ id: ly.id, layer: leaflayer });
        this.renderer.mapObjectLayers$.next(this.leafletLayers);
        leaflayer.addTo(this.renderer.MapObject);
      }
    });
    this.kmzParser.load(ly.layer);
  }

  // TODO: find a remove option for kmz added to map without using widget
  async remove(id) {
    const layer = this.leafletLayers.find(ly => ly.id === id).layer;
    this.renderer.mapObjectLayers$.pipe(switchMap(l => l), filter(l => l.id !== id));
    console.log('dingo removing', layer);
    return this.renderer.MapObject.removeLayer(layer);
  }
  // TODO: find an update option for KMZ added to map. Could just re-run?
  async update() {
    return null;
  }

  destroy() {
    this.renderer.mapObjectLayers$.unsubscribe();
  }

}
