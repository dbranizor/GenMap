import { Renderer, LayerRenderer, AMSLayerData } from 'src/app/mapfx/LayerRenderer';
import { BehaviorSubject } from 'rxjs';
import * as L from 'leaflet';
import { AMSGeoJSON, Geometries, GeometryShapes } from 'src/app/mapfx/GeometryLayerImpl';
import { SimpleStyle } from 'src/app/mapfx';
import { StyleProperties } from 'src/app/mapfx/Layer';
import { switchMap, filter } from 'rxjs/operators';
import {point} from '@turf/turf';

export class LeafGeometryRendererImpl implements LayerRenderer {
    renderer: Renderer = { mapObjectLayers$: new BehaviorSubject([]), MapObject: null }
    private shapeLayers: any[] = [];
    constructor(map: L.Map) {
        this.renderer.MapObject = map as L.Map;

    }

    async add(geo: AMSLayerData) {
        this.shapeController(geo);
    }

    destroy() {
        this.renderer.mapObjectLayers$.unsubscribe();
    }

    async remove(id: string): Promise<L.Map> {
        if (!id) {
            return;
        }
        const leaflet = this.renderer.MapObject as L.Map;
        const layer: L.Layer = this.removeFromShapeLayersReturnLayer(id);
        const status = leaflet.removeLayer(layer);
        return status;
    }

    async update(shape: AMSLayerData): Promise<L.Layer> {
        const leaflet = this.renderer.MapObject as L.Map;
        const layer = this.shapeLayers.find(l => l.id === shape.id);
        leaflet.removeLayer(layer);
        return this.shapeController(shape);
    }


    /**
     * Adds or Updates Layer to map. Publishes layers. 
     * @param amsLayer 
    */
    private async shapeController(amsLayer: AMSLayerData): Promise<L.Layer> {
        const shape = amsLayer.layer as GeometryShapes;

        let lShape: L.Layer;
        if (shape.type === Geometries.Point) {
            const lMarker = await this.loadPoint(amsLayer);
            this.updateShapeLayers(amsLayer, lMarker);
            this.renderer.mapObjectLayers$.next(this.shapeLayers);
        } else if (shape.type === Geometries.Polygon) {
            lShape = await this.loadPolygone(shape.payload);
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
        return geom;
    }

    private updateShapeLayers(amsLayer: AMSLayerData, leafShape) {
        console.log('dingo layer id', amsLayer.id, amsLayer.layer);
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
                    }
                }
            })
        }

    }
    /**
     *  Passes in AMS Geojson object that contains geojson + simplestyle
     *  properties. Only three simple style properties are added to leaflet. 
     * 
     *  For now I am simply using the leaflet geoJSON method.
     *  For performance reasons it may be necessary to use the
     *  leaflet primities (i.e: L.Point or L.Polygon).
     * @param geojson Shape
    */
    private loadShape(shape: AMSGeoJSON): L.Layer {
        let lShape: L.Layer = null;
        if (shape.geometry) {
            const lShape = L.geoJSON(shape.geometry, {
                onEachFeature: (feature, layer) => {
                    if (layer instanceof L.Polygon) {
                        layer.setStyle(this.getStyleObject(shape['properties']))
                    }
                }
            }).addTo(this.renderer.MapObject);
        }

        return lShape;
    }

    /**
     * 
     * @param shape 
     * @returns - TODO: Come up with api for standard returns
     */
    private async loadPoint(amsLayer: AMSLayerData): Promise<any> {
        const geoLayer = (amsLayer.layer as GeometryShapes).payload;
   //     let leafMarkerPoint: L.Marker;
  //      console.log('dingo point marker', leafMarkerPoint, geoLayer['geometry']['geometry'][]);
        const leafMarkPoint = point([122,37]);
        const testicon = new L.Icon({iconUrl: 'assets/marker-icon.png'})
   
        const status = L.marker([40.92140054764093, 148.0943618477567], {icon: testicon}).addTo(this.renderer.MapObject);
        console.log('dingo added point', leafMarkPoint, status);
        // leafMarkerPoint = L.marker(geoLayer['geometry']['geometry']['coordinates'], {title: geoLayer.properties.title || null});
        // leafMarkerPoint.addTo(this.renderer.MapObject);
        // if(geoLayer['coordinates'] && geoLayer['coordinates'].length) {

        // } else {
        //     console.log('No Geometry')
        // }
        return status;
    }

    private async loadPolygone(shape: AMSGeoJSON): Promise<L.Layer> {
        return this.loadShape(shape);
    }

    private async loadMultiLineString(shape: AMSGeoJSON): Promise<L.Layer> {
        return this.loadShape(shape);
    }

    private getStyleObject(style: SimpleStyle): L.PathOptions {
        let leafStyle: L.PathOptions = {};
        if (Object.keys(style).length < 1) {
            leafStyle = Object.keys(style).reduce<L.PathOptions>((acc, curr) => {
                if (curr === StyleProperties.StrokeWidth) {
                    acc['weight'] = style[curr];
                } else if (curr === StyleProperties.Fill) {
                    acc['color'] = style[curr];
                } else if (curr === StyleProperties.FillOpacity) {
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