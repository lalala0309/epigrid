import { useEffect, useRef } from "react";
import OLMap from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import OSM from "ol/source/OSM";
import Feature from "ol/Feature";
import Polygon from "ol/geom/Polygon";
import { Fill, Stroke, Style } from "ol/style";
import { fromLonLat } from "ol/proj";
import "ol/ol.css";
import GeoJSON from "ol/format/GeoJSON";

const OpenLayerMap = ({ selectedArea, areaColor }) => {

    const mapRef = useRef(null);
    const mapRefObj = useRef(null);

    const areaSourceRef = useRef(null);
    const areaLayerRef = useRef(null);

    const maskSourceRef = useRef(null);
    const maskLayerRef = useRef(null);

    const featureMapRef = useRef(new Map());

    /* ================= INIT MAP ================= */
    useEffect(() => {

        areaSourceRef.current = new VectorSource();
        maskSourceRef.current = new VectorSource();

        areaLayerRef.current = new VectorLayer({
            source: areaSourceRef.current,
            style: new Style({
                fill: new Fill({
                    color: areaColor || "rgba(0,150,255,0.08)"   // nếu có param thì dùng
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
                    color: "rgba(0,0,0,0.45)"   // lớp tối
                })
            })
        });

        mapRefObj.current = new OLMap({
            target: mapRef.current,
            layers: [
                new TileLayer({ source: new OSM() }),
                maskLayerRef.current,
                areaLayerRef.current
            ],
            view: new View({
                center: fromLonLat([106.66, 10.76]),
                zoom: 12
            })
        });

        return () => mapRefObj.current.setTarget(undefined);

    }, []);

    useEffect(() => {
        console.log("SelectedArea:", selectedArea);
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
                console.log("Level không hợp lệ:", selectedArea.level);
                return;
        }

        fetch(file)
            .then(res => {
                if (!res.ok) throw new Error("File not found");
                return res.json();
            })
            .then(data => {

                areaSourceRef.current.clear();
                maskSourceRef.current.clear();

                const filtered = data.features.filter(
                    f => f.properties[field] === selectedArea.maGADM
                );

                if (filtered.length === 0) {
                    console.log("Không tìm thấy GID:", selectedArea.maGADM);
                    return;
                }

                const format = new GeoJSON();

                const features = format.readFeatures(
                    {
                        type: "FeatureCollection",
                        features: filtered
                    },
                    { featureProjection: "EPSG:3857" }
                );

                areaSourceRef.current.addFeatures(features);

                /* ====== TẠO MASK ====== */

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

                const selectedGeometry = features[0].getGeometry();
                const selectedCoords = selectedGeometry.getCoordinates();

                const maskPolygon = new Polygon([
                    outer,
                    ...selectedCoords
                ]);

                const maskFeature = new Feature(maskPolygon);
                maskSourceRef.current.addFeature(maskFeature);

                /* ====== ZOOM ====== */

                mapRefObj.current.getView().fit(
                    areaSourceRef.current.getExtent(),
                    { padding: [80, 80, 80, 80], duration: 600 }
                );

            })
            .catch(err => {
                console.error("Lỗi load geojson:", err);
            });

    }, [selectedArea]);

    return <div ref={mapRef} className="w-full h-full" />;
};

export default OpenLayerMap;