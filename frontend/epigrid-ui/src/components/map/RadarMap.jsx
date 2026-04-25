import { useEffect, useRef } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { fromLonLat } from "ol/proj";

import RadarPulse from "./RadarPulse";

const RadarMap = () => {
    const mapRef = useRef(null);

    useEffect(() => {
        if (!mapRef.current) return;

        const vectorSource = new VectorSource();
        const vectorLayer = new VectorLayer({ source: vectorSource });

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const center = fromLonLat([
                    pos.coords.longitude,
                    pos.coords.latitude
                ]);

                const map = new Map({
                    target: mapRef.current,
                    layers: [
                        new TileLayer({ source: new OSM() }),
                        vectorLayer
                    ],
                    view: new View({
                        center: center,
                        zoom: 15,
                    }),
                });

                RadarPulse(map, vectorSource, vectorLayer, center);
            },
            (err) => {
                console.log("Không lấy được GPS", err);

                // fallback nếu user từ chối GPS
                const fallback = fromLonLat([105.85, 21.03]);

                const map = new Map({
                    target: mapRef.current,
                    layers: [
                        new TileLayer({ source: new OSM() }),
                        vectorLayer
                    ],
                    view: new View({
                        center: fallback,
                        zoom: 15,
                    }),
                });

                RadarPulse(map, vectorSource, vectorLayer, fallback);
            }
        );

    }, []);
    return <div ref={mapRef} className="w-full h-full" />;
};

export default RadarMap;
