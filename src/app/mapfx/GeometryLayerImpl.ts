import { AbstractLayer } from './AbstractLayer';
import { GeoJsonObject, Feature, FeatureCollection } from 'geojson';
import { LayerRenderer } from './LayerRenderer';
import { Layer, SimpleStyle } from './Layer';
import {GeoJSON} from 'geojson'

export enum Geometries {
    MultiLineString = 'MultiLineString',
    Point = 'Point',
    Polygon = 'Polygon'
}

export interface AMSGeoJSON {
    geometry: any;
    properties: SimpleStyle;
}

export class Shape {
    payload: AMSGeoJSON = null;
    constructor(payload: AMSGeoJSON) {
        this.payload = payload;
    }
}

export class PolyLineShape extends Shape {
    public readonly type: Geometries = Geometries.MultiLineString
    constructor(payload: AMSGeoJSON) {
        super(payload);
    }
}

export class PolygonShape extends Shape {
    public readonly type: Geometries = Geometries.Polygon
    constructor(payload: AMSGeoJSON) {
        super(payload);
    }
}

export class PointShape extends Shape {
    public readonly type: Geometries = Geometries.Point
    constructor(payload: AMSGeoJSON) {
        super(payload);
    }
}

export type GeometryShapes = PolyLineShape | PolygonShape | PointShape;

export class GeometryLayerImpl extends AbstractLayer<GeometryShapes> implements Layer {
    constructor(renderer: LayerRenderer, layer: GeometryShapes) {
        super(renderer, layer);
    }
    
}