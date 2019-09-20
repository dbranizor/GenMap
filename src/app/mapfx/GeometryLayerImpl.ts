import { AbstractLayer } from './AbstractLayer';
import { LayerRenderer } from './LayerRenderer';
import { Layer, SimpleStyle } from './Layer';

export enum Geometries {
  MultiLineString = 'MultiLineString',
  Point = 'Point',
  Polygon = 'Polygon'
}

export interface AMSGeoJSON {
  geometry: unknown;
  properties: SimpleStyle;
}

export class Shape<T> {
  payload: AMSGeoJSON = { geometry: null, properties: {} };
  constructor (payload: T) {
    this.payload.geometry = payload;
  }
}
/**
 * Takes a {@link Coordinate} and creates a polylineshape type
 * @param {Array<Array<Coordinate>> | Array<Coordinate>} payload an array of Positions
 * @example
 * var multiPt = new PolyLine([[0,0],[10,10]]);
 *
 * //=multiPt
 *
 */
export class PolyLineShape extends Shape<Coordinate[] | Coordinate[][] | Coordinate[][][]> {
  public readonly type: Geometries = Geometries.MultiLineString;
  constructor (payload: Array<Coordinate>) {
    super(payload);
  }
}

/**
 * @param  payload -- Takes linear-ring polygon coordinates and creates Polygon type
 * @example
 * var layer = new PolygonShape([[
 *  [-2.275543, 53.464547],
 *  [-2.275543, 53.489271],
 *  [-2.215118, 53.489271],
 *  [-2.215118, 53.464547],
 *  [-2.275543, 53.464547]
 * ]]);
 */
export class PolygonShape extends Shape<Array<Array<Coordinate>>> {
  public readonly type: Geometries = Geometries.Polygon;
  constructor (payload: Array<Array<Coordinate>>) {
    super(payload);
  }
}
/**
 * Takes {@link Coordinate} and creates a point shape
 * @param  payload - Coordinates for a point
 * @example
 * var points = new PointShape([-60, 60])
 * })
 */
export class PointShape extends Shape<Coordinate> {
  public readonly type: Geometries = Geometries.Point
  constructor (payload: Coordinate) {
    super(payload);
  }
}

export type GeometryShapes = PolyLineShape | PolygonShape | PointShape;

export type Coordinate = [number, number, number?];

export class GeometryLayerImpl extends AbstractLayer<GeometryShapes> implements Layer {
  constructor (renderer: LayerRenderer, layer: GeometryShapes) {
    super(renderer, layer);
  }

}
