import { useEffect, useRef } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import OSM from "ol/source/OSM";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Style, Icon } from "ol/style";
import { fromLonLat, toLonLat } from "ol/proj";

import "ol/ol.css";

/*
props:
lat
lng
onChange(lat,lng)
*/

const MapPicker = ({ lat, lng, onChange }) => {
    const mapRef = useRef();
    const markerRef = useRef();

    useEffect(() => {
        if (!lat || !lng) return;

        /* marker */
        const marker = new Feature({
            geometry: new Point(fromLonLat([lng, lat]))
        });

        marker.setStyle(
            new Style({
                image: new Icon({
                    src: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
                    scale: 0.05
                })
            })
        );

        markerRef.current = marker;

        const vectorLayer = new VectorLayer({
            source: new VectorSource({
                features: [marker]
            })
        });

        const map = new Map({
            target: mapRef.current,
            layers: [
                new TileLayer({ source: new OSM() }),
                vectorLayer
            ],
            view: new View({
                center: fromLonLat([lng, lat]),
                zoom: 16
            })
        });

        /* click đổi vị trí */
        map.on("click", (evt) => {
            const [newLng, newLat] = toLonLat(evt.coordinate);
            marker.getGeometry().setCoordinates(evt.coordinate);
            onChange(newLat, newLng);
        });

        return () => map.setTarget(undefined);
    }, [lat, lng]);

    return <div ref={mapRef} className="w-full h-56 rounded-2xl" />;
};

export default MapPicker;
