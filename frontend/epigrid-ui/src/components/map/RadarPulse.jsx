import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import CircleGeom from "ol/geom/Circle";
import { Style, Fill, Stroke, Circle as CircleStyle } from "ol/style";
import { getVectorContext } from "ol/render";

const RadarPulse = (map, source, layer, center) => {
    const radius = 1000;

    const areaCircle = new Feature(new CircleGeom(center, radius));
    areaCircle.setStyle(new Style({
        fill: new Fill({ color: "rgba(37,99,235,0.15)" }),
        stroke: new Stroke({ color: "#2563EB", width: 3 }),
    }));

    const marker = new Feature(new Point(center));
    marker.setStyle(new Style({
        image: new CircleStyle({
            radius: 9,
            fill: new Fill({ color: "#2563EB" }),
            stroke: new Stroke({ color: "white", width: 3 }),
        }),
    }));

    source.addFeatures([areaCircle, marker]);
    const duration = 3500;

    layer.on("postrender", (event) => {
        const vectorContext = getVectorContext(event);
        const elapsed = event.frameState.time % duration;
        const ratio = elapsed / duration;
        const currentRadius = radius * ratio;
        const opacity = Math.pow(1 - ratio, 1.5);

        vectorContext.setStyle(new Style({
            stroke: new Stroke({
                color: `rgba(37,99,235,${0.8 * opacity})`,
                width: 10,
            }),
        }));

        vectorContext.drawGeometry(new CircleGeom(center, currentRadius));
        map.render();
    });
};

export default RadarPulse;
