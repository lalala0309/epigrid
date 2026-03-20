import React, { useState, useMemo, useEffect } from 'react';
import {
    Plus, Activity, Search, ChevronRight, Edit, Trash2, X, Save,
    Stethoscope, Bug, Radio, AlertTriangle, Check, Filter, MousePointer2, Info, ListTree, Microscope
} from 'lucide-react';
import diseaseApi from "../../api/diseaseApi";

// --- COMPONENT POP-UP CHỌN NHIỀU NÂNG CAO (Style Bo góc 2xl) ---
const MultiSelectPopup = ({
    label,
    icon,
    selectedItems,
    options,
    field,
    onToggle, onClose, agentTypes }) => {
    const [search, setSearch] = useState('');
    const [activeGroup, setActiveGroup] = useState('Tất cả');
    const groups =
        field === "agents"
            ? ["Tất cả", ...agentTypes.map(t => t.name)]
            : ["Tất cả"];

    const filteredOptions = options.filter(opt => {
        const matchesSearch = opt.name.toLowerCase().includes(search.toLowerCase());

        const matchesGroup =
            activeGroup === 'Tất cả' ||
            opt.type === activeGroup ||
            opt.typeName === activeGroup;

        return matchesSearch && matchesGroup;
    });



    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-4 border-b bg-white flex justify-between items-center">
                    <div className="flex items-center gap-2 font-bold text-[#1E3A8A] uppercase text-[11px]">
                        <span>Chọn {label}</span>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full transition-colors"><X size={16} /></button>
                </div>

                <div className="p-3 space-y-3 bg-white border-b">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={12} />
                        <input
                            autoFocus
                            placeholder={`Tìm kiếm nội dung...`}
                            className="w-full pl-9 pr-4 py-2 bg-slate-100 border-none rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-[11px]"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    {groups.length > 1 && (
                        <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
                            {groups.map(g => (
                                <button
                                    key={g}
                                    onClick={() => setActiveGroup(g)}
                                    className={`px-3 py-1 rounded-lg text-[9px] font-bold whitespace-nowrap transition-all ${activeGroup === g ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                >
                                    {g}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="h-[300px] overflow-y-auto p-2 bg-slate-50/50">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map(opt => (
                            <button
                                key={opt.name}
                                onClick={() => onToggle(opt.name)}
                                className={`w-full flex items-center justify-between p-3 rounded-xl mb-1 transition-all ${selectedItems.includes(opt.name)
                                    ? 'bg-indigo-50 text-[#1E3A8A] font-bold shadow-sm'
                                    : 'hover:bg-white hover:shadow-sm text-slate-600'
                                    }`}
                            >
                                <div className="flex flex-col items-start">
                                    <span className="text-xs">{opt.name}</span>
                                    {opt.type && <span className="text-[8px] text-indigo-400 font-bold uppercase tracking-tighter">{opt.type}</span>}
                                </div>
                                {selectedItems.includes(opt.name) && <Check size={14} className="text-indigo-600" strokeWidth={3} />}
                            </button>
                        ))
                    ) : (
                        <div className="p-10 text-center text-slate-400 italic text-[10px]">Không có dữ liệu phù hợp</div>
                    )}
                </div>

                <div className="p-3 bg-white border-t flex justify-between items-center">
                    <span className="text-[9px] text-slate-500 font-bold uppercase">Đã chọn: {selectedItems.length}</span>
                    <button onClick={onClose} className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl text-[13px] font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">Hoàn tất</button>
                </div>
            </div>
        </div>
    );
};

const DiseaseManagement = () => {
    const [agents, setAgents] = useState([]);


    const [diseases, setDiseases] = useState([
        { id: 101, name: 'Sốt xuất huyết Dengue', categoryId: 1, desc: 'Bệnh truyền nhiễm cấp tính do virus Dengue gây ra, trung gian truyền bệnh là muỗi Aedes.', symptoms: ['Sốt cao', 'Phát ban'], agents: ['Virus Dengue'], transmission: ['Côn trùng đốt'], dangerLevel: 'Nhóm A' }
    ]);



    // --- STATES ---
    const [agentTypes, setAgentTypes] = useState([]);
    const [selectedCatId, setSelectedCatId] = useState(null);
    const [selectedDisId, setSelectedDisId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(null);
    const [activePopup, setActivePopup] = useState(null);
    const [categories, setCategories] = useState([]);
    const [symptoms, setSymptoms] = useState([]);
    const [transmissions, setTransmissions] = useState([]);
    const [dangerGroups, setDangerGroups] = useState([]);

    const selectedDisease = diseases.find(d => d.id === selectedDisId);
    const selectedCategory = categories.find(c => c.id === (isEditing ? editData?.categoryId : selectedCatId));
    const danger = dangerGroups.find(
        g => g.id === selectedDisease?.dangerGroupId
    );

    const filteredDiseases = useMemo(() => {
        let res = diseases;
        if (selectedCatId) res = res.filter(d => d.dangerGroupId === selectedCatId);
        if (searchTerm) res = res.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()));
        return res;
    }, [diseases, selectedCatId, searchTerm]);




    useEffect(() => {
        const fetchAgentTypes = async () => {
            try {
                const res = await diseaseApi.agentTypes.getAll();

                // map về format UI
                const mapped = res.data.map(item => ({
                    id: item.id,
                    name: item.name,
                    description: item.description || ""
                }));

                setCategories(mapped);
                setAgentTypes(mapped);
            } catch (err) {
                console.error("Lỗi load agent types:", err);
            }
        };

        fetchAgentTypes();
    }, []);

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                let allAgents = [];

                for (let type of agentTypes) {
                    const res = await diseaseApi.agents.getByType(type.id);

                    const mapped = res.data.map(a => ({
                        id: a.id,
                        name: a.name,
                        typeId: a.typeId,
                        typeName: type.name // gắn tên loại để filter UI
                    }));

                    allAgents = [...allAgents, ...mapped];
                }

                setAgents(allAgents);
            } catch (err) {
                console.error("Lỗi load agents:", err);
            }
        };

        if (agentTypes.length > 0) {
            fetchAgents();
        }
    }, [agentTypes]);


    useEffect(() => {
        const fetchSymptoms = async () => {
            try {
                const res = await diseaseApi.symptoms.getAll();

                const mapped = res.data.map(s => ({
                    id: s.id,
                    name: s.name,
                    description: s.description || ""
                }));

                setSymptoms(mapped);
            } catch (err) {
                console.error("Lỗi load symptoms:", err);
            }
        };

        fetchSymptoms();
    }, []);


    useEffect(() => {
        const fetchTransmissions = async () => {
            try {
                const res = await diseaseApi.transmissions.getAll();

                const mapped = res.data.map(t => ({
                    id: t.maDuongLay,
                    name: t.tenDuongLay,
                    description: t.moTa || ""
                }));

                setTransmissions(mapped);
            } catch (err) {
                console.error("Lỗi load transmissions:", err);
            }
        };

        fetchTransmissions();
    }, []);


    useEffect(() => {
        const fetchDangerGroups = async () => {
            try {
                const res = await diseaseApi.dangerGroups.getAll();

                const mapped = res.data.map(d => ({
                    id: d.maNhom,
                    name: d.tenNhom,
                    description: d.moTa || ""
                }));

                setDangerGroups(mapped);
            } catch (err) {
                console.error("Lỗi load danger groups:", err);
            }
        };

        fetchDangerGroups();
    }, []);

    const loadDiseases = async () => {
        try {
            const res = await diseaseApi.diseases.getAll();
            console.log("raw res.data:", res.data);        // xem toàn bộ
            console.log("raw res.data[0]:", res.data[0]);
            const mapped = res.data.map(d => ({
                id: d.id,
                name: d.name,
                desc: d.desc,
                dangerGroupId: d.dangerGroupId,
                dangerLevel: d.dangerLevel,
                symptoms: d.symptoms || [],
                agents: d.agents || [],
                transmission: d.transmission || []
            }));

            setDiseases(mapped);
        } catch (err) {
            console.error("Lỗi load diseases:", err);
        }
    };

    useEffect(() => {
        loadDiseases();
    }, []);


    // --- HANDLERS ---
    const handleOpenForm = (action, data = null) => {
        if (action === 'add') {
            setEditData({ name: '', categoryId: selectedCatId || 1, symptoms: [], agents: [], transmission: [], dangerLevel: null, desc: '' });
        } else {
            setEditData({ ...data });
        }
        setIsEditing(true);
    };


    const toggleArrayItem = (field, itemName) => {
        const current = [...editData[field]];
        const idx = current.indexOf(itemName);
        if (idx > -1) current.splice(idx, 1);
        else current.push(itemName);
        setEditData({ ...editData, [field]: current });
    };

    const handleSave = async () => {
        if (!editData.name) return;

        try {
            const payload = {
                name: editData.name,
                desc: editData.desc,
                dangerGroupId: editData.dangerGroupId,

                // map từ name -> id
                symptomIds: symptoms
                    .filter(s => editData.symptoms.includes(s.name))
                    .map(s => s.id),

                agentIds: agents
                    .filter(a => editData.agents.includes(a.name))
                    .map(a => a.id),

                transmissionIds: transmissions
                    .filter(t => editData.transmission.includes(t.name))
                    .map(t => t.id)
            };

            if (editData.id) {
                await diseaseApi.diseases.update(editData.id, payload);
            } else {
                await diseaseApi.diseases.create(payload);
            }

            await loadDiseases();

            alert("Lưu thành công!");
            setIsEditing(false);

            // reload lại danh sách
            loadDiseases();

        } catch (err) {
            console.error(err);
            alert("Lỗi khi lưu!");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Bạn chắc chắn muốn xoá dịch bệnh này?")) return;
        try {
            await diseaseApi.diseases.delete(id);
            setSelectedDisId(null);
            setIsEditing(false);
            await loadDiseases();
            alert("Xoá thành công!");
        } catch (err) {
            console.error(err);
            alert("Lỗi khi xoá!");
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 overflow-hidden text-xs">
            {activePopup && (
                <MultiSelectPopup
                    {...activePopup}
                    options={
                        activePopup.field === "agents"
                            ? agents
                            : activePopup.field === "symptoms"
                                ? symptoms
                                : activePopup.field === "transmission"
                                    ? transmissions
                                    : []
                    }
                    agentTypes={agentTypes} // thêm dòng này
                    selectedItems={editData[activePopup.field]}
                    onToggle={(name) => toggleArrayItem(activePopup.field, name)}
                    onClose={() => setActivePopup(null)}
                />
            )}





            <div className="flex flex-1 min-h-0">
                {/* Sidebar Phân loại (48px) */}
                <aside className="w-48 bg-white border-r flex flex-col shrink-0">
                    <div className="p-3 border-b flex justify-between items-center h-10">
                        <span className="font-bold text-slate-500 uppercase text-[10px]">Phân loại tác nhân</span>
                    </div>
                    <div className="p-2 space-y-1 overflow-y-auto">
                        <button onClick={() => { setSelectedCatId(null); setSelectedDisId(null); setIsEditing(false); }}
                            className={`w-full text-left px-3 py-2.5 rounded-lg transition-all ${!selectedCatId ? "bg-indigo-50 text-[#1E3A8A] font-bold shadow-sm" : "text-slate-600 hover:bg-slate-50"}`}>
                            Tất cả dịch bệnh
                        </button>
                        {categories.map(c => (
                            <button key={c.id} onClick={() => { setSelectedCatId(c.id); setSelectedDisId(null); setIsEditing(false); }}
                                className={`w-full text-left px-3 py-2.5 rounded-lg transition-all ${selectedCatId === c.id ? "bg-indigo-50 text-[#1E3A8A] font-bold shadow-sm" : "text-slate-600 hover:bg-slate-50"}`}>
                                {c.name}
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Sidebar Danh sách (56px) */}
                <aside className="w-56 bg-white border-r flex flex-col shrink-0">
                    <div className="p-3 border-b flex justify-between items-center h-10">
                        <span className="font-bold text-slate-500 uppercase text-[10px]">Danh sách tác nhân</span>
                        <button onClick={() => handleOpenForm('add')} className="p-1 hover:bg-indigo-50 text-indigo-600 rounded-md transition-colors">
                            <Plus size={14} />
                        </button>
                    </div>
                    <div className="p-2 space-y-1 overflow-y-auto">
                        {filteredDiseases.map(d => (
                            <button key={d.id} onClick={() => { setSelectedDisId(d.id); setIsEditing(false); }}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${selectedDisId === d.id ? "bg-indigo-50 text-[#1E3A8A] font-bold shadow-sm" : "text-slate-600 hover:bg-slate-50"}`}>
                                <span className="truncate">{d.name}</span>
                                {selectedDisId === d.id && <ChevronRight size={14} />}
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Content Chính */}
                <main className="flex-1 p-2 min-w-0">
                    <div className="h-full bg-white border rounded-2xl shadow-sm flex flex-col overflow-hidden">
                        {(isEditing || selectedDisease) ? (
                            <>
                                <div className={`p-2 flex items-center justify-between shrink-0 text-gray-500  border-b transition-colors duration-500 ${isEditing ? 'bg-gray-50' : 'bg-gray-50'}`}>
                                    <div className="flex items-center gap-2 pl-2">
                                        {isEditing ? <Edit size={16} /> : <Info size={16} />}
                                        <h2 className="text-sm font-bold tracking-tight">
                                            {isEditing ? (editData.id ? 'Chỉnh sửa hồ sơ' : 'Thêm dịch bệnh mới') : `Thông tin dịch bệnh`}
                                        </h2>
                                    </div>
                                    {!isEditing && (
                                        <div className="flex gap-1">
                                            <button onClick={() => handleOpenForm('edit', selectedDisease)} className="p-2 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors"><Edit size={16} /></button>
                                            <button onClick={() => handleDelete(selectedDisease.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"><Trash2 size={16} /></button>
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 p-6 overflow-y-auto bg-white">
                                    <div className="max-w-full mx-auto space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-400">
                                        {isEditing ? (
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1.5">
                                                        <label className="text-[13px] font-bold text-slate-600 ">Tên dịch bệnh</label>
                                                        <input type="text" value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} className="w-full border-2 border-slate-100 rounded-xl p-3 focus:border-indigo-500 outline-none transition-all text-xs" placeholder="Nhập tên bệnh..." />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[13px] font-bold text-slate-600">Nhóm nguy hiểm</label>
                                                        <select
                                                            value={editData.dangerGroupId || ""}
                                                            onChange={e =>
                                                                setEditData({
                                                                    ...editData,
                                                                    dangerGroupId: Number(e.target.value)
                                                                })
                                                            }
                                                            className="w-full border-2 border-slate-100 rounded-xl p-3 outline-none text-xs bg-white"
                                                        >
                                                            <option value="">-- Chọn nhóm nguy hiểm --</option>
                                                            {dangerGroups.map(g => (
                                                                <option key={g.id} value={g.id}>
                                                                    {g.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-3 gap-4">
                                                    {[
                                                        { label: 'Tác nhân gây bệnh', field: 'agents', icon: <Bug size={14} /> },
                                                        { label: 'Triệu chứng lâm sàng', field: 'symptoms', icon: <Stethoscope size={14} /> },
                                                        { label: 'Đường lây truyền', field: 'transmission', icon: <Radio size={14} /> }
                                                    ].map(sec => (
                                                        <div key={sec.field} className="space-y-1.5">
                                                            <label className="text-[13px] font-semibold text-slate-600 flex items-center gap-1"> {sec.label}</label>
                                                            <div onClick={() => setActivePopup(sec)} className="min-h-[80px] p-2 bg-slate-50 border-2 border-dashed border-slate-100 rounded-xl cursor-pointer hover:bg-white hover:border-indigo-200 transition-all flex flex-wrap gap-1 content-start">
                                                                {(editData[sec.field] || []).map((item, idx) => {
                                                                    const label = typeof item === 'string' ? item : (item.name || idx);
                                                                    const key = typeof item === 'string' ? item : (item.id || idx);
                                                                    return (
                                                                        <span key={key} className="px-2 py-1 bg-indigo-600 text-white rounded-md text-[9px] flex items-center gap-1 font-bold shadow-sm shadow-indigo-100">
                                                                            {label}
                                                                            <X size={10} onClick={(e) => { e.stopPropagation(); toggleArrayItem(sec.field, label); }} />
                                                                        </span>
                                                                    );
                                                                })}

                                                                {editData[sec.field].length === 0 && <span className="text-slate-400 italic text-[10px] p-1">Nhấn để chọn...</span>}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="space-y-1.5">
                                                    <label className="text-[13px] font-semibold text-slate-500">Mô tả</label>
                                                    <textarea rows={8} value={editData.desc} onChange={e => setEditData({ ...editData, desc: e.target.value })} className="w-full border-2 border-slate-100 rounded-xl p-4 focus:border-indigo-500 outline-none transition-all text-xs resize-none leading-relaxed italic" placeholder="Nhập mô tả chi tiết..." />
                                                </div>

                                                <div className="flex gap-3 pt-2 justify-end">
                                                    <button onClick={() => setIsEditing(false)} className="px-8 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all uppercase text-[10px]">Huỷ</button>
                                                    <button onClick={handleSave} className="px-8 bg-indigo-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all uppercase text-[10px] tracking-widest">
                                                        <Save size={16} /> Lưu
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-6">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1.5">
                                                        <span className="text-slate-600 block text-[12px] font-bold">Tên gọi hệ thống</span>
                                                        <p className="text-[13px] font-bold text-[#1E3A8A] bg-slate-50 p-3 rounded-xl border border-slate-100">{selectedDisease.name}</p>
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <span className="text-slate-600 block text-[12px] font-bold">Nhóm nguy hiểm</span>
                                                        <p className="text-[13px] font-bold text-[#1E3A8A] bg-slate-50 p-3 rounded-xl border border-slate-100"> {danger?.name || "Không xác định"}</p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-3 gap-4">
                                                    {[
                                                        { label: 'Tác nhân', data: selectedDisease.agents, color: 'bg-slate-50 text-slate-600 border-slate-100' },
                                                        { label: 'Triệu chứng', data: selectedDisease.symptoms, color: 'bg-slate-50 text-slate-600 border-slate-100' },
                                                        { label: 'Đường truyền', data: selectedDisease.transmission, color: 'bg-slate-50 text-slate-600 border-slate-100' }
                                                    ].map(group => (
                                                        <div key={group.label} className="space-y-1.5">
                                                            <span className="text-slate-600 block text-[12px] font-bold">{group.label}</span>
                                                            <div className="flex flex-wrap gap-1 p-1">
                                                                {(group.data || []).map((item, idx) => {
                                                                    const label = typeof item === 'string' ? item : (item.name || item.tenTrieuChung || item.tenTacNhan || item.tenDuongLay || JSON.stringify(item));
                                                                    const key = typeof item === 'string' ? item : (item.id || idx);
                                                                    return (
                                                                        <span key={key} className={`px-2 py-1 rounded-md font-bold text-[9px] border ${group.color}`}>
                                                                            {label}
                                                                        </span>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="space-y-1.5">
                                                    <span className="text-slate-600 block text-[12px] font-bold">Diễn giải bệnh lý</span>
                                                    <div className="text-xs leading-relaxed text-slate-600 bg-slate-50 p-5 rounded-xl border border-slate-100 min-h-[250px] whitespace-pre-wrap italic">
                                                        {selectedDisease.desc}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-4 animate-pulse">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                                    <MousePointer2 size={32} />
                                </div>
                                <p className="text-sm font-medium">Vui lòng chọn một dịch bệnh để xem chi tiết</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DiseaseManagement;