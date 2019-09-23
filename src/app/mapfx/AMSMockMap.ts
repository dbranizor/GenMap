import { AMSMap } from './AMSMap';
import { LayerRenderer } from './LayerRenderer';
import { BehaviorSubject } from 'rxjs';
import { Feature, Polygon } from 'geojson';

export class AMSMockMap implements AMSMap {

  mapBounds$: BehaviorSubject<Feature<Polygon>> = new BehaviorSubject(null);
  zoom$: BehaviorSubject<number> = new BehaviorSubject(null);

  mapImplementation = null;
  maxZoom = null;
  minZoom = null;

  flyTo() {
    return null;
  }
  removeLayer() {
    return null;
  }
  setBounds() {
    return null;
  }
  addLayer() {
    return null;
  }


}

export class MockRenderer implements LayerRenderer {
  renderer = null;
  update() {
    return null;
  }
  remove() {
    return null;
  }
  destroy() {
    return null;
  }
  add() {
    return null;
  }
}
