import { AMSMap } from '../../mapfx';
import { BehaviorSubject } from 'rxjs';
import { BBox, Feature, Polygon } from 'geojson';
import { Layer } from 'src/app/mapfx/Layer';
import * as L from 'leaflet';
import { AMSAbstractMap } from 'src/app/mapfx/AMSAbstractMap';
import { Coordinate } from 'src/app/mapfx/GeometryLayerImpl';
export class LeafletMap extends AMSAbstractMap<L.Map> implements AMSMap {

  constructor (mapImplementation: L.Map) {
    super(mapImplementation);
    this.mapBounds$.subscribe(this.handleBBounds.bind(this));
    this.zoom$.subscribe(this.handleZoomLevel.bind(this));
  }


  mapBounds$: BehaviorSubject<Feature<Polygon>> = new BehaviorSubject(null);
  private _mapBounds: Feature<Polygon> = null;
  zoom$: BehaviorSubject<number> = new BehaviorSubject(null);
  private _zoomLevel: number = null;
  async flyTo(cord: Coordinate): Promise<any> {
    /** Flyto uses basic coordinates to fly to destination (long, lat array with the elevation option) */
    return this.mapImplementation.flyTo([cord[0], cord[1]]);
  }


  private async handleBBounds(mapBounds: Feature<Polygon>) {
    if (!mapBounds.geometry.coordinates.length) {
      return;
    }

    this._mapBounds = mapBounds;

    console.log('dingo mapBounds', mapBounds.geometry.coordinates);
    // Converts polygon for bbox into N,S,E,W coordinates
    const coordinates = mapBounds.geometry.coordinates[0].reduce((acc, curr) => {
      // first check if value is not zero
      // if current greater than high value, swap + assign to high value. else assign to low value
      if (curr[0] > acc.east) {
        if (acc.east === 0) {
          acc.east = curr[0];
        } else {
          acc.west = acc.east;
          acc.east = curr[0];
        }
      } else {
        acc.west = curr[0];
      }

      if (curr[1] > acc.north) {
        if (acc.north === 0) {
          acc.north = curr[1];
        } else {
          acc.south = acc.north;
          acc.north = curr[1];
        }
      } else {
        acc.south = curr[1];
      }

      return acc;
    }, {
        north: -90,
        south: -90,
        east: -180,
        west: -180
      });
    const southWest = new L.LatLng(coordinates.south, coordinates.west);
    const northEast = new L.LatLng(coordinates.north, coordinates.east);
    const bounds = new L.LatLngBounds(southWest, northEast);
    this.mapImplementation.fitBounds(bounds);
  }

  private handleZoomLevel(level: number) {
    if (level && level > 0) {
      this._zoomLevel = level;
      this.mapImplementation.setZoom(level);
    }

  }

}
