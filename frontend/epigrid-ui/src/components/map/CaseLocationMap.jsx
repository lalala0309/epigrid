import { useEffect, useRef } from "react";
import OLMap from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import OSM from "ol/source/OSM";
import Feature from "ol/Feature";
import Polygon from "ol/geom/Polygon";
import Point from "ol/geom/Point";
import LineString from "ol/geom/LineString";
import { Fill, Stroke, Style, Circle as CircleStyle } from "ol/style";
import { fromLonLat } from "ol/proj";
import "ol/ol.css";
import GeoJSON from "ol/format/GeoJSON";

const CaseLocationMap = ({ selectedArea, areaColor, lat, lng, contacts }) => {

    const mapRef = useRef(null);
    const mapRefObj = useRef(null);
    const contactSourceRef = useRef(null);
    const contactLayerRef = useRef(null);
    const areaSourceRef = useRef(null);
    const areaLayerRef = useRef(null);

    const maskSourceRef = useRef(null);
    const maskLayerRef = useRef(null);

    // marker
    const markerSourceRef = useRef(null);
    const markerLayerRef = useRef(null);

    /* ================= INIT MAP ================= */
    useEffect(() => {

        areaSourceRef.current = new VectorSource();
        maskSourceRef.current = new VectorSource();
        markerSourceRef.current = new VectorSource();

        contactSourceRef.current = new VectorSource();

        contactLayerRef.current = new VectorLayer({
            source: contactSourceRef.current,
            style: new Style({
                image: new CircleStyle({
                    radius: 5,
                    fill: new Fill({ color: "#f59e0b" }), // vàng cam
                    stroke: new Stroke({ color: "#fff", width: 2 })
                })
            })
        });

        areaLayerRef.current = new VectorLayer({
            source: areaSourceRef.current,
            style: new Style({
                fill: new Fill({
                    color: areaColor || "rgba(0,150,255,0.08)"
                }),
                stroke: new Stroke({
                    color: "#0047b3",
                    width: 3
                })
            })
        });

        maskLayerRef.current = new VectorLayer({
            source: maskSourceRef.current,
            style: new Style({
                fill: new Fill({
                    color: "rgba(0,0,0,0.45)"
                })
            })
        });

        //  marker layer
        markerLayerRef.current = new VectorLayer({
            source: markerSourceRef.current,
            style: new Style({
                image: new CircleStyle({
                    radius: 6,
                    fill: new Fill({ color: "#b91c1c" }),
                    stroke: new Stroke({ color: "#fff", width: 2 })
                })
            })
        });

        mapRefObj.current = new OLMap({
            target: mapRef.current,
            layers: [
                new TileLayer({ source: new OSM() }),
                maskLayerRef.current,
                areaLayerRef.current,
                markerLayerRef.current,
                contactLayerRef.current
            ],
            view: new View({
                center: fromLonLat([106.66, 10.76]),
                zoom: 12
            })
        });

        return () => mapRefObj.current.setTarget(undefined);

    }, []);

    /* ================= LOAD KHU VỰC ================= */
    useEffect(() => {
        if (!selectedArea?.maGADM || !selectedArea?.level) return;

        let file = "";
        let field = "";

        switch (selectedArea.level) {
            case "TINH":
            case 1:
                file = "/geojson/gadm41_VNM_1.json";
                field = "GID_1";
                break;
            case "HUYEN":
            case 2:
                file = "/geojson/gadm41_VNM_2.json";
                field = "GID_2";
                break;
            case "XA":
            case 3:
                file = "/geojson/gadm41_VNM_3.json";
                field = "GID_3";
                break;
            default:
                return;
        }

        fetch(file)
            .then(res => res.json())
            .then(data => {

                areaSourceRef.current.clear();
                maskSourceRef.current.clear();

                const filtered = data.features.filter(
                    f => f.properties[field] === selectedArea.maGADM
                );

                if (filtered.length === 0) return;

                const format = new GeoJSON();

                const features = format.readFeatures(
                    {
                        type: "FeatureCollection",
                        features: filtered
                    },
                    { featureProjection: "EPSG:3857" }
                );

                areaSourceRef.current.addFeatures(features);

                /* ===== MASK ===== */
                const worldExtent = [
                    -20037508, -20037508,
                    20037508, 20037508
                ];

                const outer = [
                    [worldExtent[0], worldExtent[1]],
                    [worldExtent[0], worldExtent[3]],
                    [worldExtent[2], worldExtent[3]],
                    [worldExtent[2], worldExtent[1]],
                    [worldExtent[0], worldExtent[1]]
                ];

                const selectedCoords = features[0].getGeometry().getCoordinates();

                const maskPolygon = new Polygon([
                    outer,
                    ...selectedCoords
                ]);

                maskSourceRef.current.addFeature(new Feature(maskPolygon));

                mapRefObj.current.getView().fit(
                    areaSourceRef.current.getExtent(),
                    { padding: [80, 80, 80, 80], duration: 600 }
                );

            });

    }, [selectedArea]);

    /* ================= MARKER ================= */
    useEffect(() => {
        if (!lat || !lng) return;

        markerSourceRef.current.clear();

        const marker = new Feature({
            geometry: new Point(fromLonLat([lng, lat]))
        });

        markerSourceRef.current.addFeature(marker);

    }, [lat, lng]);


    useEffect(() => {
        if (!contacts || !lat || !lng) return;

        contactSourceRef.current.clear();

        const caseCoord = fromLonLat([lng, lat]);

        contacts.forEach(ct => {
            if (!ct.lat || !ct.lng) return;

            const contactCoord = fromLonLat([ct.lng, ct.lat]);

            // 🔸 Marker contact
            const contactFeature = new Feature({
                geometry: new Point(contactCoord)
            });

            // 🔸 Line nối
            const lineFeature = new Feature({
                geometry: new LineString([caseCoord, contactCoord])
            });

            lineFeature.setStyle(new Style({
                stroke: new Stroke({
                    color: "#fb923c", // cam
                    width: 2,
                    lineDash: [6, 6]
                })
            }));

            contactSourceRef.current.addFeature(contactFeature);
            contactSourceRef.current.addFeature(lineFeature);
        });

    }, [contacts, lat, lng]);

    return <div ref={mapRef} className="w-full h-full" />;
};

export default CaseLocationMap;