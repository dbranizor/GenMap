import { AMSMap } from '../../mapfx';
import { BehaviorSubject } from 'rxjs';
import { BBox } from 'geojson';
import { Layer } from 'src/app/mapfx/Layer';
import * as L from 'leaflet';
import { AMSAbstractMap } from 'src/app/mapfx/AMSAbstractMap';
export class LeafletMap extends AMSAbstractMap<L.Map> implements AMSMap {

  public maxZoom: BehaviorSubject<number> = new BehaviorSubject(20);
  public minZoom: BehaviorSubject<number> = new BehaviorSubject(10);

  async setBounds(cord: BBox) {
    return null;
  }

}
