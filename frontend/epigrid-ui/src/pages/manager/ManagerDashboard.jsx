import React, { useEffect, useState, useCallback } from "react";
import { ShieldAlert, ChevronRight, GripVertical } from "lucide-react";
import OpenLayerMap from "../../components/OpenLayerMap";

const TINH_TRANG_LABEL = {
    DANG_MAC: { label: "Đang mắc", color: "text-yellow-600 bg-yellow-50" },
    DA_KHOI: { label: "Đã khỏi", color: "text-green-600 bg-green-50" },
    TU_VONG: { label: "Tử vong", color: "text-red-600 bg-red-50" },
};

const ManagerDashboard = () => {
    const [selectedArea, setSelectedArea] = useState(null);
    const [leftWidth, setLeftWidth] = useState(260);
    const [rightWidth, setRightWidth] = useState(300);
    const [diseaseStats, setDiseaseStats] = useState([]);
    const [todayCases, setTodayCases] = useState([]);

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

    // useEffect 1: fetch area
    useEffect(() => {
        const userId = localStorage.getItem("userId");
        fetch(`http://localhost:8080/api/areas/manager/${userId}`)
            .then(res => res.json())
            .then(data => {
                setSelectedArea({
                    id: data.id,
                    maGADM: data.maGADM,
                    level: data.level,
                    name: data.name,
                });
            })
            .catch(err => console.error("Lỗi fetch area:", err));
    }, []);

    // useEffect 2: fetch disease stats + today cases khi có area
    useEffect(() => {
        if (!selectedArea?.id) return;

        // Sidebar trái: phân loại bệnh
        fetch(`http://localhost:8080/api/cases/disease-stats?maKhuVuc=${selectedArea.id}`)
            .then(res => res.json())
            .then(data => setDiseaseStats(Array.isArray(data) ? data : []))
            .catch(() => setDiseaseStats([]));

        // Sidebar phải: ca bệnh hôm nay
        fetch(`http://localhost:8080/api/cases/today-cases?maKhuVuc=${selectedArea.id}`)
            .then(res => res.json())
            .then(data => setTodayCases(Array.isArray(data) ? data : []))
            .catch(() => setTodayCases([]));

    }, [selectedArea]);

    return (
        <div className="flex h-screen w-full bg-slate-900 font-sans text-slate-200 overflow-hidden select-none">

            {/* Cột trái */}
            <aside
                style={{ width: `${leftWidth}px` }}
                className="relative border-r border-slate-200 flex flex-col bg-white shadow-2xl shrink-0"
            >
                <div className="p-4 border-b border-slate-800">
                    <h2 className="text-sm font-black text-blue-800 flex items-center gap-2">
                        <ShieldAlert className="text-blue-800 shrink-0" />
                        {selectedArea?.name ?? "LÀNG LÁ"}
                    </h2>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6 min-w-0">
                    <div>
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase mb-3">Phân loại bệnh</h3>
                        <div className="space-y-2">
                            {diseaseStats.length === 0 ? (
                                <p className="text-xs text-slate-400 text-center py-4">Không có dữ liệu</p>
                            ) : (
                                diseaseStats.map((d, index) => (
                                    <DiseaseStat
                                        key={index}
                                        label={d.name}
                                        cases={d.cases}
                                        color="bg-blue-500"
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div
                    onMouseDown={startResizing('left')}
                    className="absolute top-0 right-0 w-0.5 h-full cursor-col-resize bg-transparent hover:bg-slate-300/50 transition-all duration-150 z-30 flex items-center justify-center group"
                >
                    <GripVertical size={14} className="opacity-0 group-hover:opacity-70 text-slate-500 transition" />
                </div>
            </aside>

            {/* bản đồ */}
            <main className="flex-1 flex flex-col relative min-w-0">
                <OpenLayerMap selectedArea={selectedArea} areaColor="rgba(0,150,255,0.10)" />
            </main>

            {/* cột phải */}
            <aside
                style={{ width: `${rightWidth}px` }}
                className="relative border-slate-800 bg-white flex flex-col shadow-2xl shrink-0"
            >
                <div
                    onMouseDown={startResizing('right')}
                    className="absolute top-0 left-0 w-0.5 h-full cursor-col-resize bg-transparent hover:bg-slate-300/50 transition-all duration-150 z-30 flex items-center justify-center group"
                >
                    <GripVertical size={14} className="opacity-0 group-hover:opacity-70 text-slate-500 transition" />
                </div>

                <div className="px-4 py-3 border-b border-slate-200 bg-slate-200 flex items-center justify-between">
                    <h2 className="font-bold text-slate-600 text-sm">Ca bệnh hôm nay</h2>
                    {todayCases.length > 0 && (
                        <span className="text-xs font-bold text-white bg-blue-500 rounded-full px-2 py-0.5">
                            {todayCases.length}
                        </span>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {todayCases.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-6">Không có ca bệnh hôm nay</p>
                    ) : (
                        <div className="space-y-1 px-3 py-3">
                            {todayCases.map((c, index) => (
                                <PatientRow
                                    key={index}
                                    id={c.maBenhNhan}
                                    name={c.hoTen}
                                    type={c.disease}
                                    tinhTrang={c.tinhTrang}
                                    date={c.ngayPhatHien}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </aside>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
                .ol-attribution { display: none; }
            `}</style>
        </div>
    );
};

const DiseaseStat = ({ label, cases, color }) => (
    <div className="bg-blue-100/50 p-3 rounded-xl border flex items-center justify-between gap-1 overflow-hidden">
        <div className="flex items-center gap-3 truncate">
            <div className={`w-1 h-5 rounded-full shrink-0 ${color}`}></div>
            <span className="text-sm font-medium text-blue-900 truncate">{label}</span>
        </div>
        <span className="text-sm font-semibold text-black shrink-0">{cases}</span>
    </div>
);

// const TINH_TRANG_LABEL = {
//     DANG_MAC: { label: "Đang mắc", color: "text-yellow-700 bg-yellow-50" },
//     DA_KHOI: { label: "Đã khỏi", color: "text-green-700 bg-green-50" },
//     TU_VONG: { label: "Tử vong", color: "text-red-700 bg-red-50" },
// };

const PatientRow = ({ id, name, type, tinhTrang, date }) => {
    const status = TINH_TRANG_LABEL[tinhTrang] ?? { label: tinhTrang, color: "text-slate-600 bg-slate-100" };
    return (
        <div className="group p-2 rounded-lg bg-slate-100/50 hover:bg-slate-200 transition-colors cursor-pointer min-w-0">
            <div className="flex items-center justify-between gap-1">
                <p className="text-[12px] font-bold text-blue-800 uppercase tracking-tighter truncate">{id}</p>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${status.color}`}>
                    {status.label}
                </span>
            </div>
            <p className="text-[11px] font-medium text-slate-700 truncate mt-0.5">{name}</p>
            <div className="flex items-center justify-between mt-1">
                <p className="text-[11px] text-slate-500 truncate">{type}</p>
                <span className="text-[10px] text-slate-400 shrink-0 ml-1">{date}</span>
            </div>
        </div>
    );
};

export default ManagerDashboard;