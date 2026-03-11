import React, { useState, useEffect } from 'react';
import OpenLayerMap from "../../components/OpenLayerMap";
import ResizablePanel from "../../components/resize/ResizablePanel";
import {
    X, User, ArrowLeft, Search as SearchIcon,
    Plus, Layers, Map as MapIcon,
    ChevronRight, ChevronDown, UserPlus, CheckCircle2, AlertCircle, Info, Settings, Save
} from 'lucide-react';
import areaApi from "../../api/areaApi";

const AreaManagement = () => {
    const [selectedId, setSelectedId] = useState(null);
    const [areas, setAreas] = useState([]);
    const [isAssigning, setIsAssigning] = useState(false);

    const [staffOfArea, setStaffOfArea] = useState([]);
    const [availableStaff, setAvailableStaff] = useState([]);

    const [isEditingLimit, setIsEditingLimit] = useState(false);
    const [tempLimit, setTempLimit] = useState("");

    const flattenAreas = (list) => {
        let result = [];
        list.forEach(a => {
            result.push(a);
            if (a.children) result = result.concat(flattenAreas(a.children));
        });
        return result;
    };

    const selectedArea = flattenAreas(areas).find(a => a.id === selectedId);

    useEffect(() => {
        areaApi.getAll().then(res => {
            const transform = (list) => list.map(a => ({
                ...a,
                children: a.children ? transform(a.children) : []
            }));
            setAreas(transform(res.data));
        }).catch(err => console.error(err));
    }, []);

    useEffect(() => {
        setIsAssigning(false);
        setIsEditingLimit(false);
    }, [selectedId]);

    useEffect(() => {
        if (!selectedArea) return;

        areaApi.getStaff(selectedArea.id)
            .then(res => setStaffOfArea(res.data))
            .catch(err => console.error(err));

        areaApi.getAvailableStaff(selectedArea.id)
            .then(res => setAvailableStaff(res.data))
            .catch(err => console.error(err));
    }, [selectedArea]);

    const handleAssignStaff = (staff) => {
        // Xóa bên sẵn sàng, thêm vào danh sách phân công
        setAvailableStaff(prev => prev.filter(s => s.maNguoiDung !== staff.maNguoiDung));
        setStaffOfArea(prev => [...prev, staff]);
    };

    const handleUnassignStaff = (staff) => {
        // Xóa bên phân công, trả về danh sách sẵn sàng
        setStaffOfArea(prev => prev.filter(s => s.maNguoiDung !== staff.maNguoiDung));
        setAvailableStaff(prev => [...prev, staff]);
    };

    const handleSaveLimit = () => {
        if (selectedArea) {
            selectedArea.warningLimit = Number(tempLimit);
        }
        setIsEditingLimit(false);
    };

    const renderLevelBadge = (level) => {
        const labels = { 'TINH': 'Cấp Tỉnh', 'HUYEN': 'Cấp Huyện', 'XA': 'Cấp Xã' };
        return (
            <span className={`px-2 py-1 text-[12px] font-bold tracking-wider text-blue-800 || 'bg-gray-50'}`}>
                {labels[level] || labels[level]}
            </span>
        );
    };

    const handleSaveAssignment = async () => {

        const staffIds = staffOfArea.map(s => s.maNguoiDung);

        try {
            await areaApi.assignStaff(selectedArea.id, staffIds);
            alert("Phân công thành công");

            // setIsAssigning(false);

        } catch (err) {
            console.error(err);
            alert("Lưu thất bại");
        }
    };

    return (
        <div className="flex h-full flex bg-[#F3F4F6] text-[12px] antialiased text-gray-700">
            {/* 1. SIDEBAR TRÁI */}
            <aside className="w-60 h-full bg-white border-r border-gray-200 flex flex-col flex-none shadow-sm">
                <div className="p-3 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="font-bold text-gray-800 flex items-center gap-2">
                        <Layers size={16} className="text-blue-600" /> Cấu trúc khu vực
                    </h2>
                    <div className="relative mt-2">
                        <SearchIcon className="absolute left-2.5 top-2 text-gray-400" size={12} />
                        <input type="text" placeholder="Tìm kiếm..." className="w-full pl-8 pr-2 py-1.5 text-[11px] border border-gray-200 rounded outline-none focus:border-blue-400 transition-all" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                    {areas.map(area => (
                        <AreaTreeItem key={area.id} item={area} selectedId={selectedId} setSelectedId={setSelectedId} />
                    ))}
                </div>
            </aside>

            {/* 2. NỘI DUNG CHÍNH */}
            <main className="flex-1 relative bg-slate-200 overflow-hidden">
                <OpenLayerMap selectedArea={selectedArea} />
            </main>

            {/* 3. BẢNG NHÂN VIÊN SẴN SÀNG */}
            {isAssigning && selectedArea && (
                <ResizablePanel side="right" defaultWidth={260} className="bg-white border-l border-gray-200 flex-none z-10 shadow-lg">
                    <div className="h-full flex flex-col">
                        <div className="p-3 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                            <button onClick={() => setIsAssigning(false)} className="p-1 hover:bg-gray-100 rounded-full text-gray-500">
                                <ArrowLeft size={14} />
                            </button>
                            <span className="font-bold text-gray-800">Nhân viên sẵn sàng</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 space-y-1">
                            {availableStaff.map(staff => (
                                <div key={staff.maNguoiDung} className="flex items-center justify-between p-2 rounded hover:bg-gray-50 border border-transparent hover:border-blue-100">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                            <User size={14} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">{staff.hoTen}</p>
                                            <p className="text-[10px] text-gray-400 leading-none">{staff.email}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleAssignStaff(staff)}
                                        className="p-1.5 text-blue-600 hover:bg-blue-600 hover:text-white rounded transition-colors"
                                        title="Thêm vào khu vực"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </ResizablePanel>
            )}

            {/* 4. BẢNG CHI TIẾT */}
            {selectedArea && (
                <ResizablePanel side="right" defaultWidth={250} className="bg-white border-l border-gray-200 flex-none z-20 shadow-xl">
                    <div className="h-full flex flex-col">
                        <div className="p-2 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                            <div className="flex items-center gap-2 text-blue-900 font-bold text-[13px]">
                                {isAssigning ? <UserPlus size={14} /> : <Info size={14} />}
                                {isAssigning ? "Phân công" : "Thông tin vùng"}
                            </div>
                            <button onClick={() => setSelectedId(null)} className="text-gray-400 hover:text-red-500"><X size={14} /></button>
                        </div>

                        {!isAssigning ? (
                            <div className="flex-1 overflow-y-auto">
                                <div className="p-4 border-b border-gray-50">
                                    <h3 className="text-[16px] font-black text-gray-800 uppercase tracking-tighter leading-tight">
                                        {selectedArea.name}
                                    </h3>
                                    <div className="mb-1">{renderLevelBadge(selectedArea.level)}</div>
                                </div>
                                <div className="px-4 pb-2 grid grid-cols-2 gap-2 text-center">
                                    <div className="p-2 rounded-lg border border-gray-100 bg-gray-50/30">
                                        <p className="text-[9px] text-gray-400 font-bold uppercase">Ngưỡng</p>
                                        {isEditingLimit ? (
                                            <input type="number" className="w-full text-center text-[16px] font-black border-b border-blue-500 outline-none bg-transparent" value={tempLimit} onChange={(e) => setTempLimit(e.target.value)} autoFocus />
                                        ) : (
                                            <p className="text-[18px] font-black text-gray-700">{selectedArea.warningLimit}</p>
                                        )}
                                    </div>
                                    <div className="p-2 rounded-lg border border-gray-100 bg-gray-50/30">
                                        <p className="text-[9px] text-gray-400 font-bold uppercase">Hiện tại</p>
                                        <p className={`text-[18px] font-black ${selectedArea.currentValue > selectedArea.warningLimit ? 'text-red-600' : 'text-blue-700'}`}>
                                            {selectedArea.currentValue}
                                        </p>
                                    </div>
                                </div>
                                <div className="px-4 mb-2">
                                    {isEditingLimit ? (
                                        <button onClick={handleSaveLimit} className="w-full py-2 bg-green-600 text-white rounded font-bold text-[11px] flex items-center justify-center gap-2 hover:bg-green-700">
                                            <Save size={14} /> Lưu
                                        </button>
                                    ) : (
                                        <button onClick={() => { setIsEditingLimit(true); setTempLimit(selectedArea.warningLimit); }} className="w-full py-2 border border-gray-200 text-gray-600 rounded font-bold text-[14px] flex items-center justify-center gap-2 hover:bg-gray-50">
                                            <Settings size={14} />Cài đặt ngưỡng
                                        </button>
                                    )}
                                </div>
                                <div className="px-4 pb-4">
                                    {selectedArea.level === 'XA' ? (
                                        <button onClick={() => setIsAssigning(true)} className="w-full py-2.5 bg-[#1E3A8A] text-white rounded-lg font-bold text-[14px] shadow hover:bg-blue-800 transition-all flex items-center justify-center gap-2">
                                            <UserPlus size={14} />Phân công
                                        </button>
                                    ) : (
                                        <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex gap-2 text-blue-700">
                                            <AlertCircle size={14} className="shrink-0 mt-0.5" />
                                            <p className="text-[10px] leading-snug">
                                                Đây là đơn vị quản lý <b>{selectedArea.level === 'TINH' ? 'cấp Tỉnh' : 'cấp Huyện'}</b>. Vui lòng chọn cấp <b>Xã/Phường</b> trực thuộc để thực hiện phân công nhân sự.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col min-h-0 bg-white">
                                {/* Header bảng phân công có nút lưu cạnh tên xã */}
                                <div className="p-3 bg-blue-50 border-b border-blue-100 flex justify-between items-center">
                                    <p className="text-[11px] font-bold text-blue-900 uppercase tracking-tight truncate mr-2">{selectedArea.name}</p>
                                    <button
                                        onClick={handleSaveAssignment}
                                        className="flex-none flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded font-bold text-[10px] hover:bg-blue-700 shadow-sm transition-colors"
                                    >
                                        <CheckCircle2 size={12} /> Hoàn tất
                                    </button>
                                </div>

                                <div className="flex-1 p-2 space-y-1.5 overflow-y-auto">
                                    <p className="text-[10px] text-gray-400 font-medium px-1 mb-2">Nhân sự đã chọn ({staffOfArea.length})</p>
                                    {staffOfArea.map(staff => (
                                        <div key={staff.maNguoiDung} className="p-2 border border-gray-100 rounded flex justify-between items-center hover:bg-red-50 group transition-all">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 group-hover:bg-red-100 group-hover:text-red-600">
                                                    <User size={14} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800">{staff.hoTen}</p>
                                                    <p className="text-[10px] text-gray-400 leading-none">{staff.email}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleUnassignStaff(staff)}
                                                className="text-gray-300 group-hover:text-red-500 p-1 hover:bg-white rounded shadow-sm transition-all"
                                                title="Gỡ khỏi khu vực"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    {staffOfArea.length === 0 && (
                                        <div className="flex flex-col items-center justify-center py-10 text-gray-300">
                                            <UserPlus size={32} strokeWidth={1} />
                                            <p className="mt-2 text-center text-[11px] italic">Chưa có nhân sự nào được phân công</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </ResizablePanel>
            )}
        </div>
    );
};

const AreaTreeItem = ({ item, selectedId, setSelectedId }) => {
    const isWarning = item.currentValue > item.warningLimit;
    const [open, setOpen] = useState(false);
    const isSelected = selectedId === item.id;
    const hasChildren = item.children?.length > 0;

    return (
        <div className="mb-0.5">
            <div
                onClick={() => {
                    setSelectedId(item.id);
                    if (hasChildren) setOpen(!open);
                }}
                className={`flex items-center justify-between px-2 py-1.5 rounded cursor-pointer transition-all
                ${isSelected ? 'bg-blue-100 text-blue-700 shadow-sm' : 'hover:bg-gray-100 text-gray-600'}`}
            >
                <div className="flex items-center gap-2 overflow-hidden">
                    {hasChildren ? (open ? <ChevronDown size={13} /> : <ChevronRight size={13} />) : <div className="w-[13px]" />}
                    {item.level === 'TINH' ? <MapIcon size={14} className="text-blue-500" /> : <div className={`w-1.5 h-1.5 rounded-full ml-1 ${isSelected ? 'bg-blue-600' : 'bg-gray-300'}`} />}
                    <span className={`text-[11px] truncate ${isSelected ? 'font-bold' : ''}`}>{item.name}</span>
                </div>
                {isWarning && !isSelected && <div className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0 animate-pulse" />}
            </div>
            {hasChildren && open && (
                <div className="ml-4 border-l border-gray-200 pl-1">
                    {item.children.map(child => <AreaTreeItem key={child.id} item={child} selectedId={selectedId} setSelectedId={setSelectedId} />)}
                </div>
            )}
        </div>
    );
};

export default AreaManagement;