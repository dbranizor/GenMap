import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { APSMap } from 'src/app/mapfx';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private _map: BehaviorSubject<APSMap> = new BehaviorSubject(null);
  private readonly map: Observable<APSMap> = this._map.asObservable();

  constructor () { }
  setMap(map: APSMap) {
    this._map.next(map);
  }

  get apsMap() {
    return this.map;
  }
}
