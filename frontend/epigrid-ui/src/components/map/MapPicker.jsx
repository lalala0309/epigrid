import { useEffect, useRef } from "react";
import OLMap from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import OSM from "ol/source/OSM";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import Polygon from "ol/geom/Polygon";
import { Fill, Stroke, Style, Circle as CircleStyle } from "ol/style";
import { fromLonLat, toLonLat } from "ol/proj";
import GeoJSON from "ol/format/GeoJSON";
import { containsCoordinate } from "ol/extent";
import "ol/ol.css";

const MapPicker = ({ lat, lng, onChange, selectedArea }) => {

    const mapRef = useRef(null);
    const mapObj = useRef(null);

    const markerSource = useRef(new VectorSource());
    const areaSource = useRef(new VectorSource());
    const maskSource = useRef(new VectorSource());

    /* ================= INIT MAP ================= */
    useEffect(() => {

        const markerLayer = new VectorLayer({
            source: markerSource.current,
            style: new Style({
                image: new CircleStyle({
                    radius: 8,
                    fill: new Fill({ color: "#4F46E5" }),
                    stroke: new Stroke({ color: "#fff", width: 2 })
                })
            })
        });

        const areaLayer = new VectorLayer({
            source: areaSource.current,
            style: new Style({
                fill: new Fill({ color: "rgba(0,150,255,0.1)" }),
                stroke: new Stroke({ color: "#0047b3", width: 3 })
            })
        });

        const maskLayer = new VectorLayer({
            source: maskSource.current,
            style: new Style({
                fill: new Fill({ color: "rgba(0,0,0,0.4)" })
            })
        });

        mapObj.current = new OLMap({
            target: mapRef.current,
            layers: [
                new TileLayer({ source: new OSM() }),
                maskLayer,
                areaLayer,
                markerLayer
            ],
            view: new View({
                center: fromLonLat([
                    lng ? parseFloat(lng) : 106.66,
                    lat ? parseFloat(lat) : 10.76
                ]),
                zoom: 12
            }),
            controls: []
        });

        /* CLICK */
        const handleClick = (e) => {
            const coord = e.coordinate;

            const features = areaSource.current.getFeatures();

            if (features.length > 0) {
                const inside = features.some(f =>
                    f.getGeometry().intersectsCoordinate(coord)
                );

                if (!inside) {
                    alert("Chỉ được chọn trong khu vực quản lý");
                    return;
                }
            }

            const [newLng, newLat] = toLonLat(coord);

            markerSource.current.clear();
            markerSource.current.addFeature(
                new Feature(new Point(fromLonLat([newLng, newLat])))
            );

            onChange(
                parseFloat(newLat.toFixed(6)),
                parseFloat(newLng.toFixed(6))
            );
        };

        mapObj.current.on("click", handleClick);

        return () => {
            mapObj.current?.un("click", handleClick);
            mapObj.current?.setTarget(undefined);
        };

    }, []);

    /* ================= UPDATE MARKER ================= */
    useEffect(() => {

        if (!mapObj.current) return;

        const pLat = parseFloat(lat);
        const pLng = parseFloat(lng);

        if (isNaN(pLat) || isNaN(pLng)) return;

        markerSource.current.clear();
        markerSource.current.addFeature(
            new Feature(new Point(fromLonLat([pLng, pLat])))
        );

        mapObj.current.getView().animate({
            center: fromLonLat([pLng, pLat]),
            duration: 300
        });

    }, [lat, lng]);

    /* ================= LOAD AREA ================= */
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

                areaSource.current.clear();
                maskSource.current.clear();

                const filtered = data.features.filter(
                    f => f.properties[field] === selectedArea.maGADM
                );

                if (!filtered.length) return;

                const format = new GeoJSON();

                const features = format.readFeatures(
                    { type: "FeatureCollection", features: filtered },
                    { featureProjection: "EPSG:3857" }
                );

                areaSource.current.addFeatures(features);

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

                const selectedCoords = features[0]
                    .getGeometry()
                    .getCoordinates();

                const maskPolygon = new Polygon([
                    outer,
                    ...selectedCoords
                ]);

                maskSource.current.addFeature(new Feature(maskPolygon));

                mapObj.current.getView().fit(
                    areaSource.current.getExtent(),
                    { padding: [60, 60, 60, 60], duration: 500 }
                );

            })
            .catch(err => console.error("GeoJSON error:", err));

    }, [selectedArea]);

    return (
        <div className="relative w-full h-full rounded-xl overflow-hidden border">
            <div ref={mapRef} className="w-full h-full" />

            <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 text-[10px] rounded-lg shadow">
                Click để chọn vị trí trong khu vực
            </div>
        </div>
    );
};

export default MapPicker;