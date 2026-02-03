import { useEffect, useRef } from "react";
import Map from "ol/Map";
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

const OpenLayerMap = ({ areas = [] }) => {
    const mapRef = useRef();

    useEffect(() => {
        const vectorSource = new VectorSource();

        // 👉 add polygon từ DB
        areas.forEach(area => {
            if (!area.coords) return;

            const polygon = new Polygon([
                area.coords.map(c => fromLonLat(c))
            ]);

            const feature = new Feature(polygon);

            const isWarning = area.currentValue > area.warningLimit;

            feature.setStyle(
                new Style({
                    fill: new Fill({
                        color: isWarning
                            ? "rgba(239,68,68,0.4)"   // đỏ
                            : "rgba(34,197,94,0.4)"   // xanh
                    }),
                    stroke: new Stroke({
                        color: isWarning ? "#dc2626" : "#16a34a",
                        width: 2
                    })
                })
            );

            vectorSource.addFeature(feature);
        });

        const map = new Map({
            target: mapRef.current,
            layers: [
                new TileLayer({
                    source: new OSM()
                }),
                new VectorLayer({
                    source: vectorSource
                })
            ],
            view: new View({
                center: fromLonLat([106.66, 10.76]),
                zoom: 12
            })
        });

        return () => map.setTarget(undefined);
    }, [areas]);

    return <div ref={mapRef} className="w-full h-full" />;
};

export default OpenLayerMap;
