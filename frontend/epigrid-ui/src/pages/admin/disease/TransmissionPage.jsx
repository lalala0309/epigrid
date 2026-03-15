import { useState, useEffect } from "react";
import diseaseApi from "../../../api/diseaseApi";
import { Share2, ChevronRight, Info, Pencil, Trash2, Plus, X, Save } from "lucide-react";

const TransmissionPage = () => {

    const [methods, setMethods] = useState([]);

    const [selectedId, setSelectedId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ id: null, name: "", description: "" });

    const selectedMethod = methods.find(m => m.id === selectedId);
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {

            const res = await diseaseApi.transmissions.getAll();

            const data = res.data.map(item => ({
                id: item.maDuongLay,
                name: item.tenDuongLay,
                description: item.moTa
            }));

            setMethods(data);

            if (data.length > 0) {
                setSelectedId(data[0].id);
            }

        } catch (err) {
            console.error(err);
            alert("Lỗi tải dữ liệu");
        }
    };
    const handleAddClick = () => {
        setEditData({ id: null, name: "", description: "" });
        setIsEditing(true);
    };

    const handleEditClick = () => {
        setEditData({ ...selectedMethod });
        setIsEditing(true);
    };

    const handleSave = async () => {

        try {
            if (!editData.name.trim()) {
                alert("Vui lòng nhập tên đường lây");
                return;
            }
            if (editData.id) {

                await diseaseApi.transmissions.update(editData.id, {
                    tenDuongLay: editData.name,
                    moTa: editData.description
                });

            } else {

                await diseaseApi.transmissions.create({
                    tenDuongLay: editData.name,
                    moTa: editData.description
                });

            }

            await loadData();
            setIsEditing(false);

        } catch (err) {
            console.error(err);
            alert("Lỗi lưu dữ liệu");
        }

    };

    const handleDelete = async (id) => {

        if (!window.confirm("Bạn có chắc muốn xóa đường lây này không?")) return;

        try {

            await diseaseApi.transmissions.delete(id);

            await loadData();

        } catch (err) {
            console.error(err);
            alert("Lỗi xóa dữ liệu");
        }

    };

    return (
        <div className="flex h-full bg-slate-50 min-h-0 text-xs">

            {/* Sidebar */}
            <aside className="w-52 bg-white border-r flex flex-col shrink-0">

                <div className="h-11 flex items-center justify-between px-3 border-b text-[#1E3A8A] font-bold uppercase tracking-tighter">

                    <div className="flex items-center gap-2">
                        <Share2 size={16} />
                        <span>Đường lây</span>
                    </div>

                    <button
                        onClick={handleAddClick}
                        className="p-1 hover:bg-indigo-50 rounded-full text-[#1E3A8A]"
                    >
                        <Plus size={18} />
                    </button>

                </div>

                <div className="p-2 space-y-1 overflow-y-auto flex-1">

                    {methods.map(method => {

                        const active = method.id === selectedId && !isEditing;

                        return (
                            <button
                                key={method.id}
                                onClick={() => { setSelectedId(method.id); setIsEditing(false); }}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition text-left
                                ${active
                                        ? "bg-indigo-50 text-[#1E3A8A] font-bold shadow-sm"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-black"
                                    }`}
                            >
                                <span className="truncate">{method.name}</span>
                                {active && <ChevronRight size={14} />}
                            </button>
                        );
                    })}

                </div>

            </aside>

            {/* Main Content */}
            <main className="flex-1 flex p-3 min-w-0">

                {isEditing ? (

                    <div className="w-full h-full bg-white border rounded-2xl shadow-sm flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">

                        <div className="bg-[#1E3A8A] text-white p-4 flex items-center justify-between">

                            <div className="flex items-center gap-2 pl-1">

                                {editData.id ? <Pencil size={18} /> : <Plus size={20} />}

                                <h2 className="text-base font-bold uppercase">
                                    {editData.id ? `Chỉnh sửa ${editData.name}` : "Thêm đường lây"}
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
                                    Tên đường lây
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

                    selectedMethod && (

                        <div className="w-full h-full bg-white border rounded-2xl shadow-sm flex flex-col overflow-hidden">

                            <div className="bg-[#1E3A8A] text-white p-4 flex items-center gap-2 pl-5">

                                <Info size={20} />

                                <h2 className="text-base font-bold">
                                    {selectedMethod.name}
                                </h2>

                                <div className="ml-auto flex items-center gap-1">

                                    <button
                                        onClick={handleEditClick}
                                        className="p-2 hover:bg-white/20 rounded-md"
                                    >
                                        <Pencil size={18} />
                                    </button>

                                    <button
                                        onClick={() => handleDelete(selectedMethod.id)}
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
                                    {selectedMethod.description}
                                </p>

                            </div>

                        </div>

                    )

                )}

            </main>

        </div>
    );
};

export default TransmissionPage;