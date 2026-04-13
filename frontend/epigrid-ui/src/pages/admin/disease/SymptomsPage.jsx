import { useState, useEffect } from "react";
import diseaseApi from "../../../api/diseaseApi";
import { Thermometer, ChevronRight, Info, Pencil, Trash2, Plus, X, Save, MousePointer2 } from "lucide-react";

const SymptomsPage = () => {
    const [symptoms, setSymptoms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ id: null, name: "", description: "" });

    const selectedSymptom = symptoms.find(s => s.id === selectedId);

    useEffect(() => {
        loadSymptoms();
    }, []);

    const loadSymptoms = async () => {
        try {
            const res = await diseaseApi.symptoms.getAll();
            setSymptoms(res.data);
            // Không tự động chọn id đầu tiên để giữ trạng thái "Vui lòng chọn" ban đầu nếu muốn
            // Hoặc giữ nguyên logic của bạn: if (res.data.length > 0) setSelectedId(res.data[0].id);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddClick = () => {
        setEditData({ id: null, name: "", description: "" });
        setIsEditing(true);
    };

    const handleEditClick = () => {
        setEditData({ ...selectedSymptom });
        setIsEditing(true);
    };
    const handleSave = async () => {
        try {
            const payload = {
                name: editData.name,
                description: editData.description
            };

            if (editData.id) {
                await diseaseApi.symptoms.update(editData.id, payload);
            } else {
                await diseaseApi.symptoms.create(payload);
            }

            try {
                await loadSymptoms();
            } catch (e) {
                console.error("Lỗi loadSymptoms:", e);
            }

            setIsEditing(false);

        } catch (error) {
            console.error("Lỗi SAVE:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa triệu chứng này không?")) return;
        try {
            await diseaseApi.symptoms.delete(id);
            setSelectedId(null);
            await loadSymptoms();
        } catch (error) {
            console.error(error);
            alert("Xóa thất bại");
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 overflow-hidden text-xs">

            <div className="flex flex-1 min-h-0">
                {/* Sidebar */}
                <aside className="w-56 bg-white border-r flex flex-col shrink-0">
                    <div className="p-3 border-b flex justify-between items-center h-10">
                        <span className="font-bold text-slate-500 text-[10px] uppercase">Danh sách triệu chứng</span>
                        <button onClick={handleAddClick} className="p-1 hover:bg-indigo-50 text-indigo-600 rounded-md transition-colors">
                            <Plus size={14} />
                        </button>
                    </div>

                    <div className="p-2 space-y-1 overflow-y-auto flex-1">
                        {symptoms.map(s => (
                            <button
                                key={s.id}
                                onClick={() => { setSelectedId(s.id); setIsEditing(false); }}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 ${selectedId === s.id && !isEditing
                                    ? "bg-indigo-50 text-[#1E3A8A] font-bold shadow-sm"
                                    : "text-slate-600 hover:bg-slate-50"
                                    }`}
                            >
                                <span className="truncate">{s.name}</span>
                                {selectedId === s.id && !isEditing && <ChevronRight size={14} />}
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-2 min-w-0">
                    <div className="h-full bg-white border rounded-2xl shadow-sm flex flex-col overflow-hidden">
                        {isEditing || selectedSymptom ? (
                            <>
                                {/* Sub-Header */}
                                <div className="p-2 flex items-center justify-between shrink-0 text-gray-500 border-b bg-gray-50">
                                    <div className="flex items-center gap-2 pl-2">
                                        {isEditing ? <Pencil size={18} /> : <Info size={18} />}
                                        <h2 className="text-sm font-bold">
                                            {isEditing
                                                ? (editData.id ? `Chỉnh sửa triệu chứng` : "Thêm mới triệu chứng")
                                                : "Thông tin chi tiết"}
                                        </h2>
                                    </div>
                                    {!isEditing && (
                                        <div className="flex gap-1">
                                            <button onClick={handleEditClick} className="p-2 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors"><Pencil size={16} /></button>
                                            <button onClick={() => handleDelete(selectedSymptom.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"><Trash2 size={16} /></button>
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 p-6 overflow-y-auto bg-white">
                                    <div className="max-w-full mx-auto space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-400">
                                        {isEditing ? (
                                            <div className="space-y-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-[12px] font-bold text-slate-600">Tên triệu chứng</label>
                                                    <input
                                                        type="text"
                                                        value={editData.name}
                                                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                                        className="w-full border-2 border-slate-100 rounded-xl p-3 focus:border-indigo-500 outline-none transition-all text-xs"
                                                        placeholder="Ví dụ: Sốt cao, Co giật..."
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[12px] font-bold text-slate-600">Mô tả chi tiết</label>
                                                    <textarea
                                                        rows={16}
                                                        value={editData.description}
                                                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                                        className="w-full border-2 border-slate-100 rounded-xl p-4 focus:border-indigo-500 outline-none transition-all text-xs resize-none"
                                                        placeholder="Nhập mô tả triệu chứng..."
                                                    />
                                                </div>
                                                <div className="flex gap-3 pt-2 justify-end">
                                                    <button onClick={() => setIsEditing(false)} className="px-8 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all">Huỷ</button>
                                                    <button onClick={handleSave} className="px-6 bg-indigo-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-md">
                                                        <Save size={16} /> Lưu
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-6">
                                                <div className="space-y-1.5">
                                                    <span className="text-slate-600 block text-[12px] font-bold">Tên triệu chứng</span>
                                                    <p className="text-sm font-bold text-[#1E3A8A] bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                        {selectedSymptom.name}
                                                    </p>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <span className="text-slate-600 block text-[12px] font-bold">Mô tả chi tiết</span>
                                                    <div className="text-xs leading-relaxed text-slate-600 bg-slate-50 p-5 rounded-xl border border-slate-100 min-h-[300px] whitespace-pre-wrap">
                                                        {selectedSymptom.description || "Chưa có mô tả chi tiết cho triệu chứng này."}
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
                                <p className="text-sm font-medium">Vui lòng chọn một triệu chứng để xem chi tiết</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SymptomsPage;