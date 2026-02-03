import React, { useState } from 'react';
import OpenLayerMap from "../../components/OpenLayerMap";
import { X } from 'lucide-react';

import {
    Map as MapIcon, ChevronRight, ChevronDown, Plus,
    Search, AlertTriangle, Layers, Edit2, Trash2,
    Save, MousePointer2, Maximize2, Filter
} from 'lucide-react';

const AreaManagement = () => {
    const [selectedId, setSelectedId] = useState(null);
    const [areas] = useState([
        /* ================= LÀNG LÁ ================= */
        {
            id: 1,
            name: 'Làng Lá',
            level: 'TINH',
            warningLimit: 100,
            currentValue: 120,
            coords: [
                [106.65, 10.75],
                [106.68, 10.75],
                [106.68, 10.78],
                [106.65, 10.78],
                [106.65, 10.75]
            ],
            children: [
                {
                    id: 2,
                    name: 'Tổng bộ làng lá',
                    level: 'XA',
                    warningLimit: 30,
                    currentValue: 10,
                    coords: [
                        [106.66, 10.76],
                        [106.67, 10.76],
                        [106.67, 10.77],
                        [106.66, 10.77],
                        [106.66, 10.76]
                    ]
                },
                {
                    id: 3,
                    name: 'Ám bộ làng lá',
                    level: 'XA',
                    warningLimit: 30,
                    currentValue: 35,
                    coords: [
                        [106.665, 10.755],
                        [106.675, 10.755],
                        [106.675, 10.765],
                        [106.665, 10.765],
                        [106.665, 10.755]
                    ]
                }
            ]
        },
        /* ================= LÀNG MƯA ================= */
        {
            id: 4,
            name: 'Làng Mưa',
            level: 'TINH',
            warningLimit: 80,
            currentValue: 40,
            coords: [
                [106.70, 10.75],
                [106.73, 10.75],
                [106.73, 10.78],
                [106.70, 10.78],
                [106.70, 10.75]
            ],
            children: [
                {
                    id: 5,
                    name: 'Tháp Pain',
                    level: 'XA',
                    warningLimit: 20,
                    currentValue: 15,
                    coords: [
                        [106.705, 10.755],
                        [106.715, 10.755],
                        [106.715, 10.765],
                        [106.705, 10.765],
                        [106.705, 10.755]
                    ]
                },
                {
                    id: 6,
                    name: 'Khu trung tâm',
                    level: 'XA',
                    warningLimit: 20,
                    currentValue: 28,
                    coords: [
                        [106.72, 10.76],
                        [106.73, 10.76],
                        [106.73, 10.77],
                        [106.72, 10.77],
                        [106.72, 10.76]
                    ]
                }
            ]
        },
        {
            id: 7,
            name: 'Làng Cát',
            level: 'TINH',
            warningLimit: 60,
            currentValue: 75,
            coords: [
                [106.74, 10.74],
                [106.77, 10.74],
                [106.77, 10.77],
                [106.74, 10.77],
                [106.74, 10.74]
            ],
            children: [
                {
                    id: 8,
                    name: 'Bệnh viện Suna',
                    level: 'XA',
                    warningLimit: 25,
                    currentValue: 12,
                    coords: [
                        [106.745, 10.745],
                        [106.755, 10.745],
                        [106.755, 10.755],
                        [106.745, 10.755],
                        [106.745, 10.745]
                    ]
                },
                {
                    id: 9,
                    name: 'Văn phòng Kazekage',
                    level: 'XA',
                    warningLimit: 25,
                    currentValue: 35,
                    coords: [
                        [106.76, 10.755],
                        [106.77, 10.755],
                        [106.77, 10.765],
                        [106.76, 10.765],
                        [106.76, 10.755]
                    ]
                }
            ]
        }
    ]);

    const flattenAreas = (list) => {
        let result = [];
        list.forEach(a => {
            result.push(a);
            if (a.children) {
                result = result.concat(flattenAreas(a.children));
            }
        });
        return result;
    };

    const mapAreas = flattenAreas(areas);
    // Tìm dữ liệu khu vực đang được chọn để hiển thị lên bảng chi tiết
    const selectedArea = mapAreas.find(a => a.id === selectedId);

    return (
        <div className="h-full flex bg-gray-100 overflow-hidden text-[13px]">

            {/* SIDEBAR TRÁI: CÂY PHÂN CẤP (HÀNH CHÍNH) - GIỮ NGUYÊN STYLE GỐC */}
            <aside className="w-56 text-[12px] bg-white border-r border-gray-200 flex flex-col flex-none">
                <div className="p-2.5 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="font-bold text-gray-800 flex items-center gap-2">
                        <Layers size={18} className="text-blue-600" />
                        Cấu trúc khu vực
                    </h2>
                    <div className="relative mt-3">
                        <Search className="absolute left-2.5 top-2 text-gray-400" size={14} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm ..."
                            className="w-full pl-7 pr-2 py-1 text-[11px] border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                    {areas.map(area => (
                        <AreaTreeItem
                            key={area.id}
                            item={area}
                            selectedId={selectedId}
                            setSelectedId={setSelectedId}
                        />
                    ))}
                </div>

                <div className="p-3 bg-gray-50 border-t border-gray-200">
                    <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-all">
                        <Plus size={16} /> Thêm khu vực mới
                    </button>
                </div>
            </aside>

            {/* NỘI DUNG CHÍNH: BẢN ĐỒ GIS */}
            <main className="flex-1 relative bg-slate-200">
                {/* THANH CÔNG CỤ BẢN ĐỒ (FLOATING) */}
                {/* <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                    <div className="bg-white p-1 rounded-lg shadow-md border border-gray-200 flex flex-col">
                        <MapToolButton icon={<MousePointer2 size={18} />} title="Chọn vùng" active />
                        <MapToolButton icon={<Edit2 size={18} />} title="Vẽ Polygon (Vùng dịch)" />
                        <MapToolButton icon={<Maximize2 size={18} />} title="Đo diện tích" />
                    </div>

                    <div className="bg-white p-1 rounded-lg shadow-md border border-gray-200 flex flex-col">
                        <MapToolButton icon={<Layers size={18} />} title="Lớp bản đồ" />
                        <MapToolButton icon={<Filter size={18} />} title="Lọc hiển thị" />
                    </div>
                </div> */}

                {/* MÔ PHỎNG BẢN ĐỒ */}
                <OpenLayerMap areas={mapAreas} />

                {/* FOOTER BẢN ĐỒ */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-sm border border-gray-200 text-[11px] flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 bg-green-500 rounded-full border border-white shadow-sm"></span>
                        <span>An toàn</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 bg-yellow-400 rounded-full border border-white shadow-sm"></span>
                        <span>Tiệm cận</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 bg-red-500 rounded-full border border-white shadow-sm"></span>
                        <span>Vượt ngưỡng</span>
                    </div>
                </div>
            </main>

            {/* SIDEBAR PHẢI: CHI TIẾT KHÔNG GIAN (CHỈ HIỆN KHI CHỌN KHU VỰC) */}
            {selectedArea && (
                <aside
                    className={`
                    w-56 bg-white border-l border-gray-200 flex flex-col flex-none
                    transition-all duration-300 ease-in-out
                    ${selectedArea ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}
                `}
                >

                    <div className="bg-[#1E3A8A] p-3 text-white flex justify-between items-center">
                        <span className="font-bold">Chi tiết</span>

                        <div className="flex items-center gap-2">
                            {/* <span className="text-[10px] bg-blue-500 px-2 py-0.5 rounded uppercase">
                                SRID: 4326
                            </span> */}

                            <button
                                onClick={() => setSelectedId(null)}
                                className="p-1 rounded hover:bg-white/20 transition"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>


                    <div className="p-4 space-y-4 flex-1 overflow-y-auto">
                        <div>
                            {/* <label className="text-gray-400 text-[11px] font-bold uppercase">Tên khu vực</label> */}
                            <p className="text-lg font-black text-gray-800 leading-tight">{selectedArea.name}</p>
                            <p className="text-gray-600">Cấp độ: {selectedArea.level}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                                <p className="text-red-500 text-[9px] font-bold uppercase">Ngưỡng cảnh báo</p>
                                <p className="text-[15px] font-black text-red-700">{selectedArea.warningLimit}</p>
                            </div>
                            <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                                <p className="text-blue-500 text-[9px] font-bold uppercase">Hiện tại (Cases)</p>
                                <p className="text-[15px] font-black text-blue-700">{selectedArea.currentValue}</p>
                            </div>
                        </div>


                        <div className="pt-2 border-t border-gray-100">
                            <label className="text-gray-800 text-[11px] font-bold mb-2 block">Dữ liệu Polygon (WKT)</label>
                            <div className="bg-gray-900 text-green-400 p-2 rounded font-mono text-[10px] h-40 overflow-y-auto break-all whitespace-pre-wrap">
                                POLYGON(({selectedArea.coords.map(c => c.join(' ')).join(',\n')}))
                            </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
                                Chỉnh sửa
                            </button>
                            <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 shadow-md flex items-center justify-center gap-2">
                                Lưu GIS
                            </button>
                        </div>
                    </div>
                </aside>
            )}
        </div>
    );
};

const AreaTreeItem = ({ item, selectedId, setSelectedId }) => {
    const isWarning = item.currentValue > item.warningLimit;
    const [open, setOpen] = useState(item.isOpen ?? false);
    const isSelected = selectedId === item.id;
    const hasChildren = item.children?.length > 0;

    return (
        <div className="mb-1">
            <div
                onClick={() => {
                    setSelectedId(item.id);
                    if (hasChildren) setOpen(!open);
                }}
                className={`flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer transition-colors
                ${isSelected ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
            >
                <div className="flex items-center gap-2">
                    {hasChildren ? (
                        open ? <ChevronDown size={13} className="text-gray-800" /> : <ChevronRight size={13} className="text-gray-800" />
                    ) : <div className="w-[13px]" />}

                    {item.level === 'TINH'
                        ? <MapIcon size={14} className="text-blue-600" />
                        : <div className="w-1.5 h-1.5 bg-gray-400 rounded-full ml-1"></div>
                    }

                    <span className={`text-[11px] font-medium ${isWarning ? '' : 'text-gray-700'}`}>
                        {item.name}
                    </span>
                </div>
            </div>

            {hasChildren && open && (
                <div className="ml-4 border-l border-gray-400 mt-1">
                    {item.children.map(child => (
                        <AreaTreeItem
                            key={child.id}
                            item={child}
                            selectedId={selectedId}
                            setSelectedId={setSelectedId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const MapToolButton = ({ icon, title, active = false }) => (
    <button
        title={title}
        className={`p-2 rounded-lg transition-all ${active ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
    >
        {icon}
    </button>
);

export default AreaManagement;