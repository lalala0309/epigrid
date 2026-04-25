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
import { Fill, Stroke, Style, Circle as CircleStyle } from "ol/style";
import { fromLonLat } from "ol/proj";
import GeoJSON from "ol/format/GeoJSON";

const CaseListMap = ({ selectedArea, cases, areaColor }) => {

    const mapRef = useRef(null);
    const mapRefObj = useRef(null);

    const areaSourceRef = useRef(new VectorSource());
    const maskSourceRef = useRef(new VectorSource());
    const markerSourceRef = useRef(new VectorSource());

    /* khởi tạo bản đồ */
    useEffect(() => {

        const areaLayer = new VectorLayer({
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

        const maskLayer = new VectorLayer({
            source: maskSourceRef.current,
            style: new Style({
                fill: new Fill({
                    color: "rgba(0,0,0,0.45)"
                })
            })
        });

        const markerLayer = new VectorLayer({
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
                maskLayer,
                areaLayer,
                markerLayer
            ],
            view: new View({
                center: fromLonLat([106.66, 10.76]),
                zoom: 12
            })
        });

        return () => mapRefObj.current.setTarget(undefined);

    }, []);

    /* load khu vực */
    useEffect(() => {
        if (!selectedArea?.maGADM || !selectedArea?.level) return;

        let file = "";
        let field = "";

        switch (selectedArea.level) {
            case 1:
            case "TINH":
                file = "/geojson/gadm41_VNM_1.json";
                field = "GID_1";
                break;
            case 2:
            case "HUYEN":
                file = "/geojson/gadm41_VNM_2.json";
                field = "GID_2";
                break;
            case 3:
            case "XA":
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

                if (!filtered.length) return;

                const format = new GeoJSON();

                const features = format.readFeatures({
                    type: "FeatureCollection",
                    features: filtered
                }, { featureProjection: "EPSG:3857" });

                areaSourceRef.current.addFeatures(features);

                /* MASK */
                const worldExtent = [-20037508, -20037508, 20037508, 20037508];

                const outer = [
                    [worldExtent[0], worldExtent[1]],
                    [worldExtent[0], worldExtent[3]],
                    [worldExtent[2], worldExtent[3]],
                    [worldExtent[2], worldExtent[1]],
                    [worldExtent[0], worldExtent[1]]
                ];

                const coords = features[0].getGeometry().getCoordinates();

                const mask = new Polygon([outer, ...coords]);

                maskSourceRef.current.addFeature(new Feature(mask));

                mapRefObj.current.getView().fit(
                    areaSourceRef.current.getExtent(),
                    { padding: [80, 80, 80, 80] }
                );
            });

    }, [selectedArea]);

    /* LOAD MARKERS */
    useEffect(() => {
        markerSourceRef.current.clear();

        cases.forEach(c => {
            if (!c.lat || !c.lng) return;

            const f = new Feature({
                geometry: new Point(fromLonLat([c.lng, c.lat]))
            });

            markerSourceRef.current.addFeature(f);
        });

    }, [cases]);

    return <div ref={mapRef} className="w-full h-full" />;
};

export default CaseListMap;