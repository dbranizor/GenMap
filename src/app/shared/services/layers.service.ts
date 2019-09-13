import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayersService {

  constructor (private http: HttpClient) {

  }

  public getLayer(name: string): Observable<any> {
    return this.http.get(`assets/${name}`);
  }


}
