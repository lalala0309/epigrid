import React, { useEffect, useRef, useState, useCallback } from "react";
import "ol/ol.css";
import { Map, View, Feature } from "ol";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { OSM, Vector as VectorSource } from "ol/source";
import { Point, Circle as CircleGeom, Polygon } from "ol/geom";
import { Style, Fill, Stroke, Circle as CircleStyle } from "ol/style";
import { fromLonLat } from "ol/proj";
import {
    AlertTriangle, Activity, Users, Map as MapIcon,
    ShieldAlert, ChevronRight, Search, Bell, GripVertical
} from "lucide-react";
import AlertCard from "../../components/alert/AlertCard";




const ManagerDashboard = () => {
    const mapRef = useRef(null);

    // --- PHẦN THÊM MỚI: Quản lý kích thước hai cột ---
    const [leftWidth, setLeftWidth] = useState(260);
    const [rightWidth, setRightWidth] = useState(300);

    const startResizing = useCallback((direction) => (e) => {
        const startX = e.clientX;
        const startWidth = direction === 'left' ? leftWidth : rightWidth;

        const onMouseMove = (moveEvent) => {
            const delta = moveEvent.clientX - startX;
            if (direction === 'left') {
                const newWidth = startWidth + delta;
                if (newWidth > 200 && newWidth < 500) setLeftWidth(newWidth);
            } else {
                const newWidth = startWidth - delta;
                if (newWidth > 200 && newWidth < 500) setRightWidth(newWidth);
            }
        };

        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    }, [leftWidth, rightWidth]);

    useEffect(() => {
        if (!mapRef.current) return;

        const vectorSource = new VectorSource();
        const vectorLayer = new VectorLayer({ source: vectorSource, zIndex: 1 });

        const map = new Map({
            target: mapRef.current,
            layers: [
                new TileLayer({
                    source: new OSM(),
                    className: 'map-gray-scale opacity-90'
                }),
                vectorLayer
            ],
            view: new View({
                center: fromLonLat([105.85, 21.03]),
                zoom: 14.5
            }),
        });

        navigator.geolocation.getCurrentPosition((pos) => {
            const centerLon = pos.coords.longitude;
            const centerLat = pos.coords.latitude;

            // 1. POLYGON VÙNG DỊCH (Vùng đỏ)
            const wardCoords = [
                [centerLon - 0.01, centerLat - 0.005],
                [centerLon + 0.01, centerLat - 0.005],
                [centerLon + 0.012, centerLat + 0.006],
                [centerLon, centerLat + 0.01],
                [centerLon - 0.012, centerLat + 0.006],
            ];

            const polygon = new Feature(new Polygon([wardCoords.map(c => fromLonLat(c))]));
            polygon.setStyle(new Style({
                fill: new Fill({ color: "rgba(239, 68, 68, 0.1)" }),
                stroke: new Stroke({ color: "#EF4444", width: 2, lineDash: [5, 5] }),
            }));
            vectorSource.addFeature(polygon);

            // 2. CÁC ĐIỂM Ổ DỊCH
            const outbreakPoints = [
                [centerLon + 0.002, centerLat + 0.001],
                [centerLon - 0.003, centerLat + 0.002],
            ];

            outbreakPoints.forEach(point => {
                const feature = new Feature(new CircleGeom(fromLonLat(point), 60));
                feature.setStyle(new Style({
                    fill: new Fill({ color: "rgba(239, 68, 68, 0.4)" }),
                    stroke: new Stroke({ color: "#b91c1c", width: 1 })
                }));
                vectorSource.addFeature(feature);
            });

            map.getView().animate({
                center: fromLonLat([centerLon, centerLat]),
                zoom: 15,
                duration: 1000
            });
        });

        return () => map.setTarget(null);
    }, []);

    return (
        <div className="flex h-screen w-full bg-slate-900 font-sans text-slate-200 overflow-hidden select-none">

            {/* CỘT TRÁI (Resizable) */}
            <aside
                style={{ width: `${leftWidth}px` }}
                className="relative border-r border-slate-200 flex flex-col bg-white shadow-2xl shrink-0"
            >
                <div className="p-4 border-b border-slate-800">
                    <h2 className="text-sm font-black text-blue-800 flex items-center gap-2">
                        <ShieldAlert className="text-blue-800 shrink-0" /> LÀNG LÁ
                    </h2>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6 min-w-0">
                    <div>
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase mb-3">Phân loại bệnh</h3>
                        <div className="space-y-2">
                            <DiseaseStat label="Sốt xuất huyết" cases={142} color="bg-blue-500" />
                            <DiseaseStat label="COVID-19" cases={28} color="bg-blue-500" />
                            <DiseaseStat label="Tay chân miệng" cases={56} color="bg-blue-500" />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-[10px] font-bold text-slate-600 uppercase mb-3">Danh sách ca nhiễm mới</h3>
                        <div className="space-y-1">
                            <PatientRow id="BN-2901" name="Nguyễn Văn A" type="Sốt xuất huyết" time="15:30" />
                            <PatientRow id="BN-2902" name="Trần Thị B" type="COVID-19" time="14:45" />
                        </div>
                    </div>
                </div>

                {/* Thanh kéo bên phải cột trái */}
                <div
                    onMouseDown={startResizing('left')}
                    className="
        absolute top-0 right-0
        w-0.5 hover:w-0.5
        h-full
        cursor-col-resize
        bg-transparent hover:bg-slate-300/50
        transition-all duration-150
        z-30 flex items-center justify-center group
    "
                >
                    <GripVertical
                        size={14}
                        className="opacity-0 group-hover:opacity-70 text-slate-500 transition"
                    />
                </div>

            </aside>

            {/* GIỮA: BẢN ĐỒ & KPI */}
            <main className="flex-1 flex flex-col relative min-w-0">
                {/* <div className="absolute top-4 left-4 right-4 z-10 flex gap-3 pointer-events-none no-scrollbar overflow-x-auto pb-2">
                    <KPICard label="Vùng dịch" value="12" icon={<MapIcon size={16} />} color="text-red-400" />
                    <KPICard label="Ca tiếp xúc (F1)" value="458" icon={<Users size={16} />} color="text-orange-400" />
                    <KPICard label="Đang cách ly" value="1,204" icon={<Activity size={16} />} color="text-blue-400" />
                </div> */}
                <div ref={mapRef} className="flex-1 w-full h-full" />
            </main>

            {/*CỘT PHẢI (Resizable) */}
            <aside
                style={{ width: `${rightWidth}px` }}
                className="relative border-slate-800 bg-white flex flex-col shadow-2xl shrink-0"
            >
                {/* Thanh kéo bên trái cột phải */}
                <div
                    onMouseDown={startResizing('right')}
                    className="
                                absolute top-0 left-0
                                w-0.5 hover:w-0.5
                                h-full
                                cursor-col-resize
                                bg-transparent hover:bg-slate-300/50
                                transition-all duration-150
                                z-30 flex items-center justify-center group 
                            "
                >
                    <GripVertical
                        size={14}
                        className="opacity-0 group-hover:opacity-70 text-slate-500 transition"
                    />
                </div>


                <div className="px-4 py-3 border-b border-slate-300 bg-slate-200 flex items-center justify-between">
                    <h2 className="font-extrabold text-red-500 flex items-center gap-2 uppercase text-sm">
                        <span className="h-2 w-2 rounded-full bg-red-500"></span>
                        Cảnh báo
                    </h2>
                </div>


                <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pt-3 p-2">
                    <AlertCard
                        title="KHU VỰC VƯỢT NGƯỠNG"
                        desc="Khu vực X ghi nhận số ca vượt ngưỡng cho phép"
                        time="15:32"
                        urgent
                    />

                    <AlertCard
                        title="TRUY VẾT F1"
                        desc="Đã xác định 12 ca tiếp xúc gần với BN-2902"
                        time="14:45"
                        urgent
                    />

                    <AlertCard
                        title="Ổ DỊCH MỚI"
                        desc="Phát hiện thêm 3 ca tại tổ 5"
                        time="14:10"
                        urgent
                    />
                </div>

            </aside>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .ol-attribution { display: none; }
            `}</style>
        </div>
    );
};

// --- Sub-components (Giữ nguyên cấu trúc nhưng tối ưu truncate chữ khi thu nhỏ) ---

const DiseaseStat = ({ label, cases, color }) => (
    <div className="bg-blue-100/50 p-3 rounded-xl border flex items-center justify-between gap-1 overflow-hidden">
        <div className="flex items-center gap-3 truncate">
            <div className={`w-1 h-5 rounded-full shrink-0 ${color}`}></div>
            <span className="text-sm font-medium text-blue-900 truncate">{label}</span>
        </div>
        <span className="text-sm font-semibold text-black shrink-0">{cases}</span>
    </div>
);

const PatientRow = ({ id, name, type, time }) => (
    <div className="group p-2 rounded-lg bg-slate-100/50 hover:bg-slate-300 transition-colors flex items-center justify-between cursor-pointer min-w-0">
        <div className="truncate">
            <p className="text-[13px] font-bold text-blue-800 uppercase tracking-tighter truncate">{id}</p>
            {/* <p className="text-sm font-bold text-slate-200 truncate">{name}</p> */}
            <p className="text-[11px] font-semibold text-slate-600 truncate">{type}</p>
        </div>
        <div className="text-right shrink-0 ml-2">
            <p className="text-[10px] text-slate-600 font-bold">{time}</p>
            <ChevronRight size={14} className="ml-auto text-slate-700 group-hover:text-blue-500 transition-colors" />
        </div>
    </div>
);



export default ManagerDashboard;