import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AMSMap } from 'src/app/mapfx';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private _map: BehaviorSubject<AMSMap> = new BehaviorSubject(null);
  private readonly map: Observable<AMSMap> = this._map.asObservable();


  constructor () { }
  setMap(map: AMSMap) {
    this._map.next(map);
  }

  get apsMap() {
    return this.map;
  }
}
