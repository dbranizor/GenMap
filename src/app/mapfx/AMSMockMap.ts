import { AMSMap } from './AMSMap';
import { LayerRenderer } from './LayerRenderer';

export class AMSMockMap implements AMSMap {
  mapImplementation = null;
  maxZoom = null;
  minZoom = null;
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
