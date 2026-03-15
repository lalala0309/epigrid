import { useState, useEffect } from "react";
import diseaseApi from "../../../api/diseaseApi";
import { ShieldAlert, ChevronRight, Info, Pencil, Trash2, Plus, X, Save } from "lucide-react";

const DangerGroupPage = () => {
    const [groups, setGroups] = useState([]);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        loadGroups();
    }, []);

    const loadGroups = async () => {
        try {
            const res = await diseaseApi.dangerGroups.getAll();
            setGroups(res.data);

            if (res.data.length > 0) {
                setSelectedId(res.data[0].maNhom);
            }
        } catch (err) {
            console.error("Lỗi tải dữ liệu", err);
        }
    };

    // Quản lý trạng thái Form
    const [isEditing, setIsEditing] = useState(false); // true khi đang thêm hoặc sửa
    const [editData, setEditData] = useState({ maNhom: null, tenNhom: "", moTa: "" });

    const selectedGroup = groups.find(g => g.maNhom === selectedId);

    // Mở form Thêm mới
    const handleAddClick = () => {
        setEditData({ maNhom: null, tenNhom: "", moTa: "" });
        setIsEditing(true);
    };

    // Mở form Chỉnh sửa
    const handleEditClick = () => {
        setEditData({ ...selectedGroup });
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {

            if (editData.maNhom) {

                await diseaseApi.dangerGroups.update(
                    editData.maNhom,
                    editData
                );

            } else {

                const res = await diseaseApi.dangerGroups.create(editData);
                setSelectedId(res.data.maNhom);

            }

            await loadGroups();
            setIsEditing(false);

        } catch (err) {
            console.error("Lỗi lưu dữ liệu", err);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Bạn có chắc muốn xóa nhóm nguy hiểm này không?");

        if (!confirmDelete) return;

        try {

            await diseaseApi.dangerGroups.delete(id);

            const res = await diseaseApi.dangerGroups.getAll();
            setGroups(res.data);

            if (res.data.length > 0) {
                setSelectedId(res.data[0].maNhom);
            } else {
                setSelectedId(null);
            }

        } catch (err) {
            console.error("Lỗi xóa", err);
        }
    };

    return (
        <div className="flex h-full bg-slate-50 min-h-0 text-xs">
            {/* Sidebar */}
            <aside className="w-52 bg-white border-r flex flex-col shrink-0">
                <div className="h-11 flex items-center justify-between px-3 border-b text-[#1E3A8A] font-bold uppercase tracking-tighter">
                    <div className="flex items-center gap-2">
                        <ShieldAlert size={16} />
                        <span>Danh mục nhóm</span>
                    </div>
                    <button onClick={handleAddClick} className="p-1 hover:bg-indigo-50 rounded-full text-[#1E3A8A] transition-colors">
                        <Plus size={18} />
                    </button>
                </div>

                <div className="p-2 space-y-1 overflow-y-auto flex-1">
                    {groups.map(group => {
                        const active = group.maNhom === selectedId && !isEditing;
                        return (
                            <button
                                key={group.maNhom}
                                onClick={() => { setSelectedId(group.maNhom); setIsEditing(false); }}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition text-left
                                    ${active ? "bg-indigo-50 text-[#1E3A8A] font-bold shadow-sm" : "text-slate-600 hover:bg-slate-50 hover:text-black"}`}
                            >
                                <span className="truncate">{group.tenNhom}</span>
                                {active && <ChevronRight size={14} />}
                            </button>
                        );
                    })}
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex p-3 min-w-0">
                {isEditing ? (
                    /* FORM (Dùng chung cho cả Thêm và Sửa) */
                    <div className="w-full h-full bg-white border rounded-2xl shadow-sm flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="bg-[#1E3A8A] text-white p-4 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-2 pl-1">
                                {editData.maNhom ? <Pencil size={18} /> : <Plus size={20} />}
                                <h2 className="text-base font-bold uppercase">
                                    {editData.maNhom ? `Chỉnh sửa ${editData.tenNhom}` : "Thêm nhóm mới"}
                                </h2>
                            </div>
                            <button onClick={() => setIsEditing(false)} className="p-1 hover:bg-white/20 rounded-md">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 space-y-6 flex-1 overflow-y-auto">
                            <div className="space-y-6 w-full">
                                <div className="w-full">
                                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-2 tracking-widest">Tên nhóm</label>
                                    <input
                                        type="text"
                                        value={editData.tenNhom}
                                        onChange={(e) => setEditData({ ...editData, tenNhom: e.target.value })}
                                        placeholder="Nhập tên nhóm..."
                                        className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-indigo-100 transition-all bg-slate-50/50 text-sm"
                                    />
                                </div>

                                <div className="w-full">
                                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-2 tracking-widest">Mô tả chi tiết</label>
                                    <textarea
                                        rows={10}
                                        value={editData.moTa}
                                        onChange={(e) => setEditData({ ...editData, moTa: e.target.value })}
                                        placeholder="Nhập mô tả chi tiết..."
                                        className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-indigo-100 transition-all bg-slate-50/50 text-sm resize-none"
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t bg-slate-50/50 flex justify-end gap-3">
                            <button onClick={() => setIsEditing(false)} className="px-6 py-2.5 rounded-xl font-bold border border-slate-200 bg-white text-slate-600 hover:bg-slate-100">
                                Hủy bỏ
                            </button>
                            <button onClick={handleSave} className="px-6 py-2.5 rounded-xl font-bold bg-[#1E3A8A] text-white flex items-center gap-2 hover:bg-[#162d6b] shadow-md active:scale-95 transition-all">
                                <Save size={16} />
                                Lưu dữ liệu
                            </button>
                        </div>
                    </div>
                ) : (
                    /* CHI TIẾT THÔNG TIN */
                    selectedGroup && (
                        <div className="w-full h-full bg-white border rounded-2xl shadow-sm flex flex-col overflow-hidden animate-in fade-in duration-300">
                            <div className="bg-[#1E3A8A] text-white p-4 flex items-center gap-2 pl-5 shrink-0">
                                <Info size={20} />
                                <h2 className="text-base font-bold">Thông tin {selectedGroup.tenNhom}</h2>

                                <div className="ml-auto flex items-center gap-1">
                                    <button onClick={handleEditClick} className="p-2 hover:bg-white/20 rounded-md" title="Chỉnh sửa">
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(selectedGroup.maNhom)}
                                        className="p-2 hover:bg-red-500 rounded-md"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="px-8 py-6 space-y-4 flex-1 overflow-y-auto">
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-2 tracking-widest">Mô tả chi tiết</p>
                                    <div className="border-t pt-4">
                                        <p className="text-slate-700 leading-relaxed text-sm">{selectedGroup.moTa}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                )}
            </main>
        </div>
    );
};

export default DangerGroupPage;