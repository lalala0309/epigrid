import { useState, useEffect } from "react";
import diseaseApi from "../../../api/diseaseApi";
import { ChevronRight, Info, Pencil, Trash2, ListTree, Microscope, Plus, Save, MousePointer2 } from "lucide-react";

const AgentsPage = () => {
    const [types, setTypes] = useState([]);
    const [agents, setAgents] = useState([]);
    const [viewMode, setViewMode] = useState("type");
    const [selectedTypeId, setSelectedTypeId] = useState(null);
    const [selectedAgentId, setSelectedAgentId] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formAction, setFormAction] = useState("add");
    const [formTarget, setFormTarget] = useState("agent");
    const [formData, setFormData] = useState({ name: "", desc: "", typeId: "" });

    const currentAgents = agents.filter(a => a.typeId === selectedTypeId);
    const selectedAgent = agents.find(a => a.id === selectedAgentId);
    const selectedType = types.find(t => t.id === selectedTypeId);

    useEffect(() => { loadTypes(); }, []);

    const loadTypes = async () => {
        try {
            const res = await diseaseApi.agentTypes.getAll();
            setTypes(res.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        if (selectedTypeId) { loadAgents(selectedTypeId); }
    }, [selectedTypeId]);

    const loadAgents = async (typeId) => {
        try {
            const res = await diseaseApi.agents.getByType(typeId);
            const formatted = res.data.map(a => ({
                id: a.id,
                typeId: a.typeId,
                name: a.name,
                detail: a.description
            }));
            setAgents(formatted);
        } catch (err) { console.error(err); }
    };

    const handleSave = async () => {
        try {
            if (formTarget === "type") {
                const payload = { name: formData.name, description: formData.desc };
                if (formAction === "add") await diseaseApi.agentTypes.create(payload);
                else await diseaseApi.agentTypes.update(selectedTypeId, payload);
                await loadTypes();
            } else {
                const payload = { name: formData.name, description: formData.desc, typeId: Number(formData.typeId) };
                if (formAction === "add") await diseaseApi.agents.create(payload);
                else await diseaseApi.agents.update(selectedAgentId, payload);
                await loadAgents(formData.typeId);
            }
            setIsFormOpen(false);
        } catch (err) { console.error(err); }
    };

    const handleDelete = async () => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa không?")) return;
        try {
            if (viewMode === "type") {
                await diseaseApi.agentTypes.delete(selectedTypeId);
                setSelectedTypeId(null);
                await loadTypes();
            } else {
                await diseaseApi.agents.delete(selectedAgentId);
                setSelectedAgentId(null);
                await loadAgents(selectedTypeId);
            }
        } catch (err) { console.error(err); }
    };

    const openForm = (target, action) => {
        setFormTarget(target);
        setFormAction(action);
        if (action === "edit") {
            if (target === "type") setFormData({ name: selectedType.name, desc: selectedType.description });
            else setFormData({ name: selectedAgent.name, desc: selectedAgent.detail, typeId: selectedAgent.typeId });
        } else {
            setFormData({ name: "", desc: "", typeId: selectedTypeId || "" });
        }
        setIsFormOpen(true);
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 overflow-hidden text-xs">
            {/* Header */}
            <header className="h-12 bg-white border-b flex items-center justify-between px-4 shrink-0 shadow-sm z-10">
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button onClick={() => { setViewMode("type"); setIsFormOpen(false); }}
                        className={`px-4 py-1.5 rounded-md flex items-center gap-2 transition-all duration-300 ${viewMode === "type" ? "bg-white shadow-sm text-[#1E3A8A] font-bold" : "text-slate-500 hover:text-slate-700"}`}>
                        <ListTree size={14} /> Loại tác nhân
                    </button>
                    <button onClick={() => { setViewMode("agent"); setIsFormOpen(false); }}
                        className={`px-4 py-1.5 rounded-md flex items-center gap-2 transition-all duration-300 ${viewMode === "agent" ? "bg-white shadow-sm text-[#1E3A8A] font-bold" : "text-slate-500 hover:text-slate-700"}`}>
                        <Microscope size={14} /> Tác nhân
                    </button>
                </div>
            </header>

            <div className="flex flex-1 min-h-0">
                {/* Sidebar Phân loại */}
                <aside className="w-48 bg-white border-r flex flex-col shrink-0">
                    <div className="p-3 border-b flex justify-between items-center h-10">
                        <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Phân loại</span>
                        {viewMode === "type" && (
                            <button onClick={() => openForm("type", "add")} className="p-1 hover:bg-indigo-50 text-indigo-600 rounded-md transition-colors">
                                <Plus size={14} />
                            </button>
                        )}
                    </div>
                    <div className="p-2 space-y-1 overflow-y-auto">
                        {types.map(t => (
                            <button key={t.id} onClick={() => { setSelectedTypeId(t.id); setSelectedAgentId(null); setIsFormOpen(false); }}
                                className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 ${selectedTypeId === t.id ? "bg-indigo-50 text-[#1E3A8A] font-bold shadow-sm" : "text-slate-600 hover:bg-slate-50"}`}>
                                {t.name}
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Sidebar Tác nhân */}
                {viewMode === "agent" && (
                    <aside className="w-56 bg-white border-r flex flex-col shrink-0">
                        <div className="p-3 border-b flex justify-between items-center h-10">
                            <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Danh sách</span>
                            <button onClick={() => openForm("agent", "add")} className="p-1 hover:bg-indigo-50 text-indigo-600 rounded-md transition-colors">
                                <Plus size={14} />
                            </button>
                        </div>
                        <div className="p-2 space-y-1 overflow-y-auto">
                            {currentAgents.map(a => (
                                <button key={a.id} onClick={() => { setSelectedAgentId(a.id); setIsFormOpen(false); }}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 ${selectedAgentId === a.id ? "bg-indigo-50 text-[#1E3A8A] font-bold shadow-sm" : "text-slate-600 hover:bg-slate-50"}`}>
                                    <span className="truncate">{a.name}</span>
                                    {selectedAgentId === a.id && <ChevronRight size={14} />}
                                </button>
                            ))}
                        </div>
                    </aside>
                )}

                {/* Main Content */}
                <main className="flex-1 p-2 min-w-0">
                    <div className="h-full bg-white border rounded-2xl shadow-sm flex flex-col overflow-hidden">
                        {(isFormOpen || (viewMode === "agent" ? selectedAgent : selectedType)) ? (
                            <>
                                <div className={`p-4 flex items-center justify-between shrink-0 text-white transition-colors duration-500 ${isFormOpen ? 'bg-indigo-600' : 'bg-[#1E3A8A]'}`}>
                                    <div className="flex items-center gap-2 pl-2">
                                        {isFormOpen ? <Pencil size={18} /> : <Info size={18} />}
                                        <h2 className="text-sm font-bold uppercase tracking-tight">
                                            {isFormOpen
                                                ? `${formAction === 'add' ? 'Thêm mới' : 'Chỉnh sửa'} ${formTarget === 'type' ? 'loại' : 'tác nhân'}`
                                                : (viewMode === "agent" ? `Thông tin: ${selectedAgent?.name}` : `Thông tin loại: ${selectedType?.name}`)}
                                        </h2>
                                    </div>
                                    {!isFormOpen && (
                                        <div className="flex gap-1">
                                            <button onClick={() => openForm(viewMode, "edit")} className="p-2 hover:bg-white/20 rounded-lg transition-colors"><Pencil size={16} /></button>
                                            <button onClick={handleDelete} className="p-2 hover:bg-red-500 rounded-lg transition-colors"><Trash2 size={16} /></button>
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 p-6 overflow-y-auto bg-white">
                                    <div className="max-w-full mx-auto space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-400">
                                        {isFormOpen ? (
                                            <div className="space-y-4">
                                                {formTarget === "agent" ? (
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tên gọi</label>
                                                            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full border-2 border-slate-100 rounded-xl p-3 focus:border-indigo-500 outline-none transition-all text-xs" placeholder="Nhập tên..." />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phân loại nhóm</label>
                                                            <select value={formData.typeId} onChange={(e) => setFormData({ ...formData, typeId: e.target.value })} className="w-full border-2 border-slate-100 rounded-xl p-3 focus:border-indigo-500 outline-none transition-all text-xs bg-white">
                                                                {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                                            </select>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tên gọi loại</label>
                                                        <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full border-2 border-slate-100 rounded-xl p-3 focus:border-indigo-500 outline-none transition-all text-xs" placeholder="Nhập tên loại..." />
                                                    </div>
                                                )}
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mô tả / Chi tiết nội dung</label>
                                                    <textarea rows={16} value={formData.desc} onChange={(e) => setFormData({ ...formData, desc: e.target.value })} className="w-full border-2 border-slate-100 rounded-xl p-4 focus:border-indigo-500 outline-none transition-all text-xs resize-none" placeholder="Nhập thông tin chi tiết..." />
                                                </div>
                                                <div className="flex gap-3 pt-2 justify-end">
                                                    <button onClick={() => setIsFormOpen(false)} className="px-8 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all">Đóng</button>
                                                    <button onClick={handleSave} className="px-10 bg-indigo-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all">
                                                        <Save size={16} /> Lưu thay đổi
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-6">
                                                {viewMode === "agent" ? (
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-1.5">
                                                            <span className="text-slate-400 block uppercase text-[10px] font-bold tracking-widest">Tên gọi hệ thống</span>
                                                            <p className="text-sm font-bold text-[#1E3A8A] bg-slate-50 p-3 rounded-xl border border-slate-100">{selectedAgent?.name}</p>
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <span className="text-slate-400 block uppercase text-[10px] font-bold tracking-widest">Thuộc nhóm phân loại</span>
                                                            <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 italic">{selectedType?.name}</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-1.5">
                                                        <span className="text-slate-400 block uppercase text-[10px] font-bold tracking-widest">Tên gọi loại</span>
                                                        <p className="text-sm font-bold text-[#1E3A8A] bg-slate-50 p-3 rounded-xl border border-slate-100">{selectedType?.name}</p>
                                                    </div>
                                                )}
                                                <div className="space-y-1.5">
                                                    <span className="text-slate-400 block uppercase text-[10px] font-bold tracking-widest">Mô tả chi tiết nội dung</span>
                                                    <div className="text-xs leading-relaxed text-slate-600 bg-slate-50 p-5 rounded-xl border border-slate-100 min-h-[300px] whitespace-pre-wrap">
                                                        {viewMode === "agent" ? selectedAgent?.detail : selectedType?.description}
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
                                <p className="text-sm font-medium">Vui lòng chọn một {viewMode === "type" ? "loại tác nhân" : "tác nhân"} để xem chi tiết</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AgentsPage;