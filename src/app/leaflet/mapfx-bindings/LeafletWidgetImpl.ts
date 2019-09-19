
import { AMSMapWidget, AMSMap } from '../../mapfx';
import * as L from 'leaflet';
import { ElementRef } from '@angular/core';


export class LeafletWidgetImpl implements AMSMapWidget {
  private _leafletMap: L.Map = null;
  private _mapObject: any = null;
  private name = '';
  constructor (map: AMSMap) {
    //@ts-ignore
    this._leafletMap = map.mapImplementation;
  }
  add(ele: ElementRef, options: any): void {
    const lControl = L.Control.extend({
      element: undefined,
      onAdd() {
        return this.element;
      },
      setElement(el) {
        this.element = el;
      },
      initialize: (initName, initOptions) => {
        this.name = initName;
        L.Util.setOptions(this, initOptions);
      }
    });

    if (name) {
      options['name'] = name;
    }

    this._mapObject = (opt) => {
      const obj = new lControl(opt);
      L.Util.setOptions(obj, opt);
      obj.setElement(ele);
      obj.addTo(this._leafletMap);
    };

    this._mapObject(options);

  }
  remove() {

  }
}
