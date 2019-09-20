import { RendererState, LayerRenderer, AMSLayerData } from 'src/app/mapfx/LayerRenderer';
import { BehaviorSubject } from 'rxjs';
import * as L from 'leaflet';
import { AMSGeoJSON, Geometries, GeometryShapes, PolygonShape, Coordinate } from 'src/app/mapfx/GeometryLayerImpl';
import { SimpleStyle } from 'src/app/mapfx';
import { StyleProperties } from 'src/app/mapfx/Layer';
import { switchMap, filter } from 'rxjs/operators';
import { point } from '@turf/turf';
import { environment } from '../../../environments/environment';



export class LeafGeometryRendererImpl implements LayerRenderer {
  /** Renderer-specific data structure used to store concrete leaflet map entitity and layers */
  renderer: RendererState = { mapObjectLayers$: new BehaviorSubject([]), MapObject: null }
  private shapeLayers: any[] = [];
  constructor (map: L.Map) {
    this.renderer.MapObject = map as L.Map;
  }

  /**
   * @param amsLayer -- takes an AMS layer that contains shape data and styles and loads a polygon
   */
  async add(amsLayer: AMSLayerData) {
    console.log('dingo update config GEO', amsLayer.layer, amsLayer.config);
    this.shapeController(amsLayer);
  }

  destroy() {
    this.renderer.mapObjectLayers$.unsubscribe();
  }
  /**
   * Removes a layer from the map and unsubscribes observables tied to layer
   * @param id -- AMSMap-specific layer ID to remove
   * @returns Promise
   */
  async remove(id: string): Promise<L.Map> {

    if (!id) {
      return;
    }
    const leaflet = this.renderer.MapObject as L.Map;
    const layer: L.Layer = this.removeFromShapeLayersReturnLayer(id);
    const status = leaflet.removeLayer(layer);
    return status;
  }
  /**
   * Does a lookup for concrete leaflet-layer and does an update.
   * Update will remove + re-add for now.
   * @param shape - Geometry to update.
   * @returns L.layer - returns Layer as status
   */
  async update(shape: AMSLayerData): Promise<L.Layer> {
    const leaflet = this.renderer.MapObject as L.Map;
    const layer = this.shapeLayers.find(l => l.id === shape.id);
    leaflet.removeLayer(layer);
    return this.shapeController(shape);
  }



  private async shapeController(amsLayer: AMSLayerData): Promise<L.Layer> {
    const shape = amsLayer.layer as GeometryShapes;
    shape.payload.properties = amsLayer.config;
    // Update the payload to inlcude the simple-style properties
    const payload = Object.assign({}, shape.payload, shape.payload.properties = amsLayer.config);
    let lShape: L.Layer;
    if (shape.type === Geometries.Point) {
      const lMarker = await this.loadPoint(amsLayer);
      this.updateShapeLayers(amsLayer, lMarker);
      this.renderer.mapObjectLayers$.next(this.shapeLayers);
    } else if (shape.type === Geometries.Polygon) {

      lShape = await this.loadPolygon(payload);
      this.updateShapeLayers(amsLayer, lShape);
      this.renderer.mapObjectLayers$.next(this.shapeLayers);
    } else if (shape.type === Geometries.MultiLineString) {
      lShape = await this.loadMultiLineString(shape.payload);
      this.updateShapeLayers(amsLayer, lShape);
      this.renderer.mapObjectLayers$.next(this.shapeLayers);
    }

    return lShape;
  }


  private removeFromShapeLayersReturnLayer(id: string): L.Layer {
    const geom = this.shapeLayers.find(l => l.id === id);
    this.renderer.mapObjectLayers$.pipe(switchMap(l => l), filter(l => l.id !== id));
    this.shapeLayers = this.shapeLayers.filter(s => s.id !== id);
    return geom.layer;
  }

  private updateShapeLayers(amsLayer: AMSLayerData, leafShape) {
    if (!this.shapeLayers.some(s => s.id === amsLayer.id)) {
      this.shapeLayers.push({ id: amsLayer.id, layer: leafShape });
    } else {
      this.shapeLayers = this.shapeLayers.map(s => {
        let lyr;
        if (s.id !== amsLayer.id) {
          lyr = s;
        } else {
          lyr = {
            id: amsLayer.id,
            layer: leafShape
          };
        }
        return lyr;
      });
    }

  }

  /**
   * Loads a coordinate point on the map. Uses environment property for point icon.
   * @param shape
   * @returns - L.Marker.
   */
  private async loadPoint(amsLayer: AMSLayerData): Promise<L.Marker> {
    const amsPoint = (amsLayer.layer as GeometryShapes).payload.geometry as L.LatLngExpression;
    const icon = new L.Icon({ iconUrl: environment.markerIcons.currentShipStatus });
    const status = L.marker(amsPoint, { icon }).addTo(this.renderer.MapObject);
    return status;
  }


  /**
   * Adds a polygon.
   * @param  {AMSGeoJSON} shape -- Polygon shape
   */
  private async loadPolygon(shape: AMSGeoJSON): Promise<L.Layer> {
    const sh = shape.geometry as any;
    const lShape = L.polygon(sh, this.getStyleObject(shape.properties)).addTo(this.renderer.MapObject);
    return lShape;
  }

  private async loadMultiLineString(shape: AMSGeoJSON): Promise<L.Layer> {
    const sh = shape.geometry as any;
    const lLine = new L.Polyline(sh, this.getStyleObject(shape.properties)).addTo(this.renderer.MapObject);
    return lLine;
  }

  private getStyleObject(style: SimpleStyle): L.PathOptions {
    let leafStyle: L.PathOptions = {};
    console.log('dingo update fill', style);
    if (style && Object.keys(style).length > 0) {
      leafStyle = Object.keys(style).reduce<L.PathOptions>((acc, curr) => {
        console.log('dingo update fill 2', curr, style[curr]);
        if (curr === StyleProperties.StrokeWidth) {
          acc['weight'] = style[curr];
        } else if (curr === StyleProperties.Fill) {
          acc['color'] = style[curr];
        } else if (curr === StyleProperties.FillOpacity) {
          console.log('dingo update fillopacity', style, style[curr])
          acc['fillOpacity'] = style[curr];
        } else {
          console.info(`SimpleStyle ${curr} not yet configured as setStyle prop`)
        }

        return acc;
      }, {})
    }
    return leafStyle
  }
}
