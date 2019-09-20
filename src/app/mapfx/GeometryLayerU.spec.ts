import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// @ts-ignore
const { randomPolygon, randomPoint } = require('@turf/turf');
import { Coordinate, GeometryLayerImpl } from './GeometryLayerImpl';
import { AMSMap } from './AMSMap';
import { MockRenderer, AMSMockMap } from './AMSMockMap';
import { LayerFactory } from '../leaflet/mapfx-bindings/LayerFactory';
import { mock, when } from 'ts-mockito';
import { LayerRenderer } from './LayerRenderer';


describe('MapViewComponent', () => {

  const fakeMap: AMSMap = mock(AMSMockMap);
  const fakeRenderer: LayerRenderer = mock(MockRenderer);


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: []
    })
      .compileComponents();
  }));



  it('Should build Shapes', async () => {

    let sh;

    // @ts-ignore
    const polyArr: Array<Array<Coordinate>> = randomPolygon(25, { bbox: [-180, 180, 90, -90] }).features.map(f => {
      return f.geometry.coordinates.map(cord => {
        return cord.map(c => {
          console.log('dingo what are these c?', c.length, c, c[0]);
          return [c[0], c[1]];
        });
      });
    });
    console.log('dingo polyArr', polyArr);
    // @ts-ignore
    const geoLayer = new GeometryLayerImpl(fakeRenderer, polyArr);
    geoLayer.shape$.subscribe(shape => {
      sh = shape;
    })
    expect(sh).toBeDefined();
  });
});
