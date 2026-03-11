import { useState, useMemo } from "react";
import ResizablePanel from "../../components/resize/ResizablePanel";
import OpenLayerMap from "../../components/OpenLayerMap";
import { Search } from "lucide-react";


const mockDiseases = [
    { id: 1, name: "Sốt xuất huyết" },
    { id: 2, name: "Cúm" },
    { id: 3, name: "COVID-19" }
];

const mockCases = [
    { id: 1, diseaseId: 1, name: "Ca #001", lat: 10.7603, lng: 106.6604 },
    { id: 2, diseaseId: 1, name: "Ca #002", lat: 10.764, lng: 106.671 },
    { id: 3, diseaseId: 2, name: "Ca #003", lat: 10.755, lng: 106.667 }
];

const mockAreas = [
    {
        id: 1,
        currentValue: 12,
        warningLimit: 10,
        coords: [
            [106.65, 10.75],
            [106.69, 10.75],
            [106.69, 10.78],
            [106.65, 10.78],
            [106.65, 10.75]
        ]
    }
];

export default function CaseManagement() {
    const [selectedDisease, setSelectedDisease] = useState(null);
    const [search, setSearch] = useState("");

    /* ================= FILTER CASES ================= */
    const filteredCases = useMemo(() => {
        return mockCases
            .filter(c => !selectedDisease || c.diseaseId === selectedDisease.id)
            .filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
    }, [selectedDisease, search]);

    /* ================= MAP AREAS + POINTS ================= */
    const mapAreas = useMemo(() => {
        const points = filteredCases.map(c => ({
            coords: [[c.lng, c.lat]],
            currentValue: 999,
            warningLimit: 0
        }));

        return [...mockAreas, ...points];
    }, [filteredCases]);

    return (
        <div className="flex h-screen w-full bg-slate-50 overflow-hidden">

            {/* ================= SIDEBAR 1 - DISEASE TYPES ================= */}
            <ResizablePanel
                side="left"
                defaultWidth={240}
                min={180}
                max={350}
                className="bg-white border-r"
            >
                <div className="p-4 text-lg font-bold text-slate-800">
                    Loại dịch bệnh
                </div>

                <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-2">
                    {mockDiseases.map(d => (
                        <button
                            key={d.id}
                            onClick={() => setSelectedDisease(d)}
                            className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-medium transition
                ${selectedDisease?.id === d.id
                                    ? "bg-blue-100 text-blue-800"
                                    : "hover:bg-slate-100"}`}
                        >
                            {d.name}
                        </button>
                    ))}
                </div>
            </ResizablePanel>

            {/* ================= SIDEBAR 2 - CASE LIST ================= */}
            <ResizablePanel
                side="left"
                defaultWidth={280}
                min={220}
                max={420}
                className="bg-white border-r"
            >
                <div className="p-4 border-b font-bold text-slate-800">
                    Danh sách ca bệnh
                </div>

                <div className="p-3">
                    <div className="flex items-center gap-2 bg-slate-50 rounded-2xl px-3 py-2">
                        <Search size={16} />
                        <input
                            placeholder="Tìm ca bệnh..."
                            className="bg-transparent outline-none text-sm w-full"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-2">
                    {filteredCases.map(c => (
                        <div
                            key={c.id}
                            className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-sm cursor-pointer"
                        >
                            {c.name}
                        </div>
                    ))}

                    {filteredCases.length === 0 && (
                        <div className="text-center text-slate-400 text-sm mt-6">
                            Không có dữ liệu
                        </div>
                    )}
                </div>
            </ResizablePanel>

            {/* ================= MAP (6 phần) ================= */}
            <div className="flex-1 relative">
                <OpenLayerMap areas={mapAreas} />
            </div>

        </div>
    );
}
