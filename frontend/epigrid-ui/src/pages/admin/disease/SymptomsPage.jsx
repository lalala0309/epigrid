import { useState, useEffect } from "react";
import diseaseApi from "../../../api/diseaseApi";
import { Thermometer, ChevronRight, Info, Pencil, Trash2, Plus, X, Save } from "lucide-react";

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

            if (res.data.length > 0) {
                setSelectedId(res.data[0].id);
            }

        } catch (error) {
            console.error(error);
            alert("Không tải được dữ liệu");
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

            if (editData.id) {

                await diseaseApi.symptoms.update(editData.id, editData);

            } else {

                await diseaseApi.symptoms.create(editData);

            }

            await loadSymptoms();

            setIsEditing(false);

        } catch (error) {

            console.error(error);
            alert("Lưu dữ liệu thất bại");

        }

    };

    const handleDelete = async (id) => {

        if (!window.confirm("Bạn có chắc muốn xóa triệu chứng này không?")) return;

        try {

            await diseaseApi.symptoms.delete(id);

            await loadSymptoms();

        } catch (error) {

            console.error(error);
            alert("Xóa thất bại");

        }

    };

    return (
        <div className="flex h-full bg-slate-50 min-h-0 text-xs">

            {/* Sidebar */}
            <aside className="w-52 bg-white border-r flex flex-col shrink-0">

                <div className="h-11 flex items-center justify-between px-3 border-b text-[#1E3A8A] font-bold uppercase tracking-tighter">
                    <div className="flex items-center gap-2">
                        <Thermometer size={16} />
                        <span>Triệu chứng</span>
                    </div>

                    <button
                        onClick={handleAddClick}
                        className="p-1 hover:bg-indigo-50 rounded-full text-[#1E3A8A]"
                    >
                        <Plus size={18} />
                    </button>
                </div>

                <div className="p-2 space-y-1 overflow-y-auto flex-1">

                    {symptoms.map(symptom => {

                        const active = symptom.id === selectedId && !isEditing;

                        return (
                            <button
                                key={symptom.id}
                                onClick={() => { setSelectedId(symptom.id); setIsEditing(false); }}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition text-left
                                ${active
                                        ? "bg-indigo-50 text-[#1E3A8A] font-bold shadow-sm"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-black"
                                    }`}
                            >
                                <span className="truncate">{symptom.name}</span>
                                {active && <ChevronRight size={14} />}
                            </button>
                        );
                    })}

                </div>

            </aside>

            {/* Content */}
            <main className="flex-1 flex p-3 min-w-0">

                {isEditing ? (

                    /* FORM */
                    <div className="w-full h-full bg-white border rounded-2xl shadow-sm flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">

                        <div className="bg-[#1E3A8A] text-white p-4 flex items-center justify-between">

                            <div className="flex items-center gap-2 pl-1">

                                {editData.id ? <Pencil size={18} /> : <Plus size={20} />}

                                <h2 className="text-base font-bold uppercase">
                                    {editData.id ? `Chỉnh sửa ${editData.name}` : "Thêm triệu chứng"}
                                </h2>

                            </div>

                            <button
                                onClick={() => setIsEditing(false)}
                                className="p-1 hover:bg-white/20 rounded-md"
                            >
                                <X size={20} />
                            </button>

                        </div>

                        <div className="p-8 space-y-6 flex-1 overflow-y-auto">

                            <div>

                                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-2 tracking-widest">
                                    Tên triệu chứng
                                </label>

                                <input
                                    type="text"
                                    value={editData.name}
                                    onChange={(e) =>
                                        setEditData({ ...editData, name: e.target.value })
                                    }
                                    className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-indigo-100 bg-slate-50/50 text-sm"
                                />

                            </div>

                            <div>

                                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-2 tracking-widest">
                                    Mô tả
                                </label>

                                <textarea
                                    rows={10}
                                    value={editData.description}
                                    onChange={(e) =>
                                        setEditData({ ...editData, description: e.target.value })
                                    }
                                    className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-indigo-100 bg-slate-50/50 text-sm resize-none"
                                />

                            </div>

                        </div>

                        <div className="p-4 border-t bg-slate-50/50 flex justify-end gap-3">

                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-6 py-2.5 rounded-xl font-bold border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                            >
                                Hủy bỏ
                            </button>

                            <button
                                onClick={handleSave}
                                className="px-6 py-2.5 rounded-xl font-bold bg-[#1E3A8A] text-white flex items-center gap-2 hover:bg-[#162d6b] shadow-md active:scale-95"
                            >
                                <Save size={16} />
                                Lưu dữ liệu
                            </button>

                        </div>

                    </div>

                ) : (

                    selectedSymptom && (

                        <div className="w-full h-full bg-white border rounded-2xl shadow-sm flex flex-col overflow-hidden">

                            <div className="bg-[#1E3A8A] text-white p-4 flex items-center gap-2 pl-5">

                                <Info size={20} />

                                <h2 className="text-base font-bold">
                                    {selectedSymptom.name}
                                </h2>

                                <div className="ml-auto flex items-center gap-1">

                                    <button
                                        onClick={handleEditClick}
                                        className="p-2 hover:bg-white/20 rounded-md"
                                    >
                                        <Pencil size={18} />
                                    </button>

                                    <button
                                        onClick={() => handleDelete(selectedSymptom.id)}
                                        className="p-2 hover:bg-red-500 rounded-md"
                                    >
                                        <Trash2 size={18} />
                                    </button>

                                </div>

                            </div>

                            <div className="px-8 py-6 flex-1 overflow-y-auto">

                                <p className="text-[10px] uppercase font-bold text-slate-400 mb-2 tracking-widest">
                                    Mô tả chi tiết
                                </p>

                                <p className="text-slate-700 leading-relaxed text-sm">
                                    {selectedSymptom.description}
                                </p>

                            </div>

                        </div>

                    )

                )}

            </main>

        </div>
    );
};

export default SymptomsPage;