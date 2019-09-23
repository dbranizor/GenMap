import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TracksService {

  constructor (private http: HttpClient) { }

  public get geoJSON(): Observable<any> {
    return this.http.get('assets/custom.geo.json');
  }
}
