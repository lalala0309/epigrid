import React, { useState, useMemo } from 'react';
import {
    Plus, FolderTree, Activity, Search, Info,
    ChevronRight, AlertCircle, Edit, Trash2,
    BarChart3, ShieldAlert, Thermometer, X
} from 'lucide-react';

const DiseaseManagement = () => {
    // 1. DATABASE STATE (Chuyển sang useState để có thể thay đổi)
    const [categories, setCategories] = useState([
        { id: 1, name: 'Virus', desc: 'Các tác nhân gây bệnh siêu hiển vi, chưa có cấu tạo tế bào, chỉ nhân lên được trong tế bào sống.' },
        { id: 2, name: 'Vi khuẩn', desc: 'Các sinh vật đơn bào nhân sơ, có thể sống độc lập và thường nhạy cảm với kháng sinh.' },
        { id: 3, name: 'Ký sinh trùng', desc: 'Các sinh vật sống bám trên vật chủ, gây hại cho cơ thể người thông qua thức ăn, nước uống.' }
    ]);

    const [diseases, setDiseases] = useState([
        { id: 101, name: 'COVID-19', categoryId: 1, desc: 'Hội chứng hô hấp cấp tính nặng, lây lan cực nhanh.', symptom: 'Sốt, ho khô, khó thở', dangerLevel: 'Rất cao' },
        { id: 102, name: 'Tả (Cholera)', categoryId: 2, desc: 'Nhiễm trùng đường ruột cấp tính, gây mất nước nghiêm trọng.', symptom: 'Tiêu chảy, nôn mửa', dangerLevel: 'Cao' },
        { id: 103, name: 'Sốt xuất huyết', categoryId: 1, desc: 'Bệnh do virus Dengue lây truyền qua muỗi vằn.', symptom: 'Sốt cao, phát ban, đau hốc mắt', dangerLevel: 'Trung bình' },
        { id: 104, name: 'Sốt rét', categoryId: 3, desc: 'Bệnh lây truyền qua muỗi Anopheles mang ký sinh trùng Plasmodium.', symptom: 'Sốt chu kỳ, rét run', dangerLevel: 'Cao' }
    ]);

    // 2. STATES
    const [selectedCat, setSelectedCat] = useState(null);
    const [selectedDisease, setSelectedDisease] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // State cho Modal
    const [modal, setModal] = useState({ isOpen: false, type: '', target: '', data: null });

    // 3. LOGIC
    const filteredDiseases = useMemo(() => {
        let result = diseases;
        if (selectedCat) {
            result = result.filter(d => d.categoryId === selectedCat.id);
        }
        if (searchTerm) {
            result = result.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        return result;
    }, [searchTerm, diseases, selectedCat]);

    const getCategoryName = (id) => categories.find(c => c.id === id)?.name || 'Không xác định';

    // 4. CRUD HANDLERS
    const openModal = (type, target, data = null) => {
        setModal({ isOpen: true, type, target, data });
    };

    const handleSave = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const entry = Object.fromEntries(formData.entries());

        if (modal.target === 'CAT') {
            if (modal.type === 'ADD') {
                setCategories([...categories, { ...entry, id: Date.now() }]);
            } else {
                setCategories(categories.map(c => c.id === modal.data.id ? { ...c, ...entry } : c));
            }
        } else {
            const diseaseData = { ...entry, id: modal.type === 'ADD' ? Date.now() : modal.data.id, categoryId: parseInt(entry.categoryId) };
            if (modal.type === 'ADD') {
                setDiseases([...diseases, diseaseData]);
            } else {
                setDiseases(diseases.map(d => d.id === modal.data.id ? diseaseData : d));
                setSelectedDisease(diseaseData);
            }
        }
        setModal({ isOpen: false, type: '', target: '', data: null });
    };

    const handleDelete = (id, target) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa?")) return;
        if (target === 'CAT') {
            setCategories(categories.filter(c => c.id !== id));
            setDiseases(diseases.filter(d => d.categoryId !== id));
            if (selectedCat?.id === id) setSelectedCat(null);
        } else {
            setDiseases(diseases.filter(d => d.id !== id));
            setSelectedDisease(null);
        }
    };

    return (
        <div className="grid grid-cols-10 grid-rows-[44px_1fr] h-screen overflow-hidden bg-white font-sans">

            {/* ===== HEADER CHUNG ===== */}
            <div className="col-span-4 flex divide-x border-b bg-white h-11">
                <div className="w-1/2 px-4 flex items-center justify-between bg-indigo-50 text-indigo-900">
                    <h1 className="text-sm font-bold flex items-center gap-2">
                        <Activity size={18} /> Phân loại
                    </h1>
                    <button onClick={() => openModal('ADD', 'CAT')}>
                        <Plus size={18} />
                    </button>
                </div>

                <div className="w-1/2 px-4 flex items-center justify-between">
                    <h2 className="text-xs font-black text-gray-800">
                        {selectedCat ? `Thuộc ${selectedCat.name}` : 'Tất cả dịch bệnh'}
                    </h2>
                    <button onClick={() => openModal('ADD', 'DIS')} className="text-back-600">
                        <Plus size={18} />
                    </button>
                </div>
            </div>


            {/* --- CỘT 1: LOẠI DỊCH BỆNH --- */}
            <aside className="col-span-2 row-start-2 border-r bg-slate-50/50 p-4 space-y-2 overflow-y-auto">

                {/* <div className="p-6 border-b bg-indigo-700 text-white flex justify-between items-center">
                    <h1 className="text-lg font-bold flex items-center gap-2">
                        <Activity size={20} /> Phân loại
                    </h1>
                    <button onClick={() => openModal('ADD', 'CAT')} className="p-1 hover:bg-white/20 rounded-md transition">
                        <Plus size={20} />
                    </button>
                </div> */}
                {/* <div className="flex-1 overflow-y-auto p-4 space-y-2"> */}
                <button
                    onClick={() => { setSelectedCat(null); setSelectedDisease(null); }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-xs font-semibold ${!selectedCat ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-gray-100 text-gray-600'}`}
                >
                    Tất cả loại bệnh
                </button>
                {categories.map(cat => (
                    <div key={cat.id} className="group relative">
                        <button
                            onClick={() => { setSelectedCat(cat); setSelectedDisease(null); }}
                            className={`w-full flex items-center justify-between p-3 rounded-xl text-xs ${selectedCat?.id === cat.id ? 'bg-blue-100 text-black' : 'hover:bg-gray-100 text-gray-600'}`}
                        >
                            <div className="flex items-center gap-3">
                                {/* <FolderTree size={16} className={selectedCat?.id === cat.id ? 'text-indigo-200' : 'text-indigo-500'} /> */}
                                <span className="font-semibold">{cat.name}</span>
                            </div>
                            <ChevronRight size={14} className="opacity-50" />
                        </button>
                        {/* Nút sửa/xóa nhỏ hiện khi hover */}
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                            <button onClick={() => openModal('EDIT', 'CAT', cat)} className="rounded text-blue-800"><Edit size={12} /></button>
                            <button onClick={() => handleDelete(cat.id, 'CAT')} className="p-1 rounded text-red-600"><Trash2 size={12} /></button>
                        </div>
                    </div>
                ))}
                {/* </div> */}
            </aside>

            {/* --- CỘT 2: DANH SÁCH DỊCH BỆNH --- */}
            <aside className="col-span-2 row-start-2 border-r flex flex-col">

                <div className="p-4 border-b">
                    {/* <div className="flex justify-between items-center mb-4 px-2">
                        <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                            {selectedCat ? `Thuộc ${selectedCat.name}` : 'Tất cả dịch bệnh'}
                        </h2>
                        <button onClick={() => openModal('ADD', 'DIS')} className="text-red-600 hover:bg-red-50 p-1 rounded transition">
                            <Plus size={18} />
                        </button>
                    </div> */}
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm ..."
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-red-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-1">
                    {filteredDiseases.map(dis => (
                        <button
                            key={dis.id}
                            onClick={() => setSelectedDisease(dis)}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-xs border-l-4
                      ${selectedDisease?.id === dis.id
                                    ? 'bg-blue-50 border-blue-800 text-blue-700 shadow-sm font-bold'
                                    : 'hover:bg-gray-50 border-transparent text-gray-600 font-medium'
                                }`}
                        >
                            <Activity
                                size={16}
                                className={selectedDisease?.id === dis.id ? 'text-blue-600' : 'text-gray-400'}
                            />
                            <span>{dis.name}</span>
                        </button>

                    ))}
                </div>
            </aside>

            {/* Chi tiết loại bênh */}
            <main className="col-span-6 row-span-2 bg-slate-50 p-3">

                {!selectedDisease ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <Activity size={56} className="mb-4 text-gray-300" />
                        <p className="text-base font-medium">
                            Chọn một dịch bệnh để xem chi tiết
                        </p>
                    </div>
                ) : (

                    <div className="w-full bg-white rounded-xl shadow border border-gray-100 p-8 space-y-5">

                        <div className="flex justify-between items-start border-b pb-6">
                            <div>
                                <h2 className="text-xl font-extrabold tracking-tight text-gray-900">
                                    {selectedDisease.name}
                                </h2>
                                <p className="text-sm text-gray-400 mt-1">
                                    Mã bệnh #{selectedDisease.id}
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => openModal('EDIT', 'DIS', selectedDisease)}
                                    className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-xl font-semibold hover:bg-blue-100"
                                >
                                    Sửa
                                </button>

                                <button
                                    onClick={() => handleDelete(selectedDisease.id, 'DIS')}
                                    className="px-4 py-2 text-sm bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100"
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 text-base">
                            <div>
                                <label className="text-xs font-bold text-gray-600 uppercase">
                                    Phân loại
                                </label>
                                <div className="mt-2 bg-gray-50 border rounded-xl px-3 py-2 text-sm font-semibold">
                                    {getCategoryName(selectedDisease.categoryId)}
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-600 uppercase">
                                    Mức độ nguy hiểm
                                </label>
                                <div className="mt-2 bg-gray-50 border rounded-xl px-3 py-2 text-sm font-semibold">
                                    {selectedDisease.dangerLevel}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-600 uppercase">
                                Triệu chứng
                            </label>

                            <div className="mt-3 flex flex-wrap gap-3">
                                {selectedDisease.symptom.split(',').map((s, i) => (
                                    <span
                                        key={i}
                                        className="bg-slate-100 px-5 py-2 rounded-2xl text-xs font-semibold border"
                                    >
                                        {s.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-600 uppercase">
                                Mô tả chi tiết
                            </label>

                            <div className="mt-3 bg-gray-50 border rounded-xl px-3 py-3 text-sm leading-7 min-h-[250px] whitespace-pre-line">

                                {selectedDisease.desc}
                            </div>
                        </div>

                    </div>
                )}
            </main>


            {/* --- MODAL FORM (THÊM / SỬA) --- */}
            {modal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-6 overflow-hidden">

                    <div className="bg-white rounded-2xl w-full max-w-sm border border-gray-200 overflow-hidden max-h-[90vh]">

                        <div className="p-6 border-b flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-gray-800">
                                {modal.type === 'ADD' ? 'Thêm mới' : 'Chỉnh sửa'} {modal.target === 'CAT' ? 'Loại dịch' : 'Dịch bệnh'}
                            </h3>
                            <button onClick={() => setModal({ isOpen: false })} className="p-1 hover:bg-gray-200 rounded-full"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSave} className="p-3 space-y-2">

                            <div className="grid grid-cols-2 gap-3">
                                <div className="col-span-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Tên gọi</label>
                                    <input name="name" defaultValue={modal.data?.name} required className="w-ful px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                                </div>

                                {modal.target === 'DIS' && (
                                    <>
                                        <div>
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Loại bệnh</label>
                                            <select name="categoryId" defaultValue={modal.data?.categoryId || selectedCat?.id} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none">
                                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Mức độ</label>
                                            <select name="dangerLevel" defaultValue={modal.data?.dangerLevel} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none">
                                                <option>Trung bình</option>
                                                <option>Cao</option>
                                                <option>Rất cao</option>
                                            </select>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Triệu chứng (phân cách bằng dấu phẩy)</label>
                                            <input name="symptom" defaultValue={modal.data?.symptom} placeholder="Sốt, Ho, Đau đầu..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
                                        </div>
                                    </>
                                )}

                                <div className="col-span-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Mô tả ngắn</label>
                                    <textarea name="desc" defaultValue={modal.data?.desc} rows="3" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setModal({ isOpen: false })} className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition">Hủy</button>
                                <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">Lưu dữ liệu</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DiseaseManagement;