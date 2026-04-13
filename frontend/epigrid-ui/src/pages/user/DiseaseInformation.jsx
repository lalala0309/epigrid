import { useState, useEffect } from "react";
import {
    ChevronRight, Info, Pencil, Trash2, Plus,
    Activity, ShieldAlert, Stethoscope, Share2,
    MousePointer2, Search, X, Bug
} from "lucide-react";
import diseaseApi from "../../api/diseaseApi";


const DiseaseInformation = () => {
    const [diseases, setDiseases] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [allSymptoms, setAllSymptoms] = useState([]);
    const [allAgents, setAllAgents] = useState([]);
    const [allTrans, setAllTrans] = useState([]);
    const [allGroups, setAllGroups] = useState([]);
    const selectedDisease = diseases.find(d => d.id === selectedId);

    useEffect(() => {
        diseaseApi.symptoms.getAll().then(res => setAllSymptoms(res.data));
        diseaseApi.transmissions.getAll().then(res => setAllTrans(res.data));
        diseaseApi.dangerGroups.getAll().then(res => setAllGroups(res.data));
        diseaseApi.agents.getAll().then(res => setAllAgents(res.data));
    }, []);


    const symptomDetails = selectedDisease?.symptoms?.map(name =>
        allSymptoms.find(s => s.name === name)
    );
    const agentDetails = selectedDisease?.agents?.map(name =>
        allAgents.find(a => a.name === name)
    );
    const transDetails = selectedDisease?.transmission?.map(name =>
        allTrans.find(t => t.tenDuongLay === name)
    );
    const group = allGroups.find(g => g.maNhom === selectedDisease?.dangerGroupId);
    useEffect(() => {
        diseaseApi.diseases.getAll()
            .then(res => {
                const data = res.data;

                setDiseases(data);

                if (data.length > 0) {
                    setSelectedId(data[0].id);
                }
            })
            .catch(err => {
                console.error("Lỗi load diseases:", err);
            });
    }, []);

    // Xử lý lọc danh sách theo tên dịch bệnh
    const filteredDiseases = diseases.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-[#F8FAFC] overflow-hidden text-xs antialiased">
            {/* Sidebar bên trái */}
            <aside className="w-72 bg-white border-r border-gray-200 flex flex-col">

                {/* Header */}
                <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                        Thư viện dịch bệnh
                    </p>
                </div>

                {/* Search */}
                <div className="px-3 py-3 border-b border-gray-100">
                    <div className="relative">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-100 rounded-lg py-2 pl-9 pr-8 text-sm outline-none
            focus:ring-2 focus:ring-blue-200 focus:bg-white transition"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto py-2">
                    {filteredDiseases.length > 0 ? (
                        filteredDiseases.map(d => (
                            <button
                                key={d.id}
                                onClick={() => setSelectedId(d.id)}
                                className={`w-full flex items-center justify-between px-4 py-3 text-sm transition
                ${selectedId === d.id
                                        ? "bg-blue-50 text-[#1E3A8A] font-semibold border-r-2 border-blue-600"
                                        : "text-gray-600 hover:bg-gray-50"
                                    }`}
                            >
                                <span className="truncate">{d.name}</span>
                            </button>
                        ))
                    ) : (
                        <div className="text-center text-gray-400 text-sm py-6">
                            Không tìm thấy
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Content - Ebook View */}
            <main className="flex-1 overflow-y-auto bg-white selection:bg-indigo-100">
                {selectedDisease ? (
                    <div className="max-w-4xl mx-auto py-10">
                        <header className="mb-5 space-y-3">
                            <h1 className="text-2xl font-black text-slate-900 leading-[1.1] tracking-tight">
                                {selectedDisease.name}
                            </h1>

                            <div className="flex flex-wrap gap-3 pt-2">
                                <div className="flex items-center gap-1.5 px-4 py-3 bg-slate-50 text-slate-600 rounded-lg font-bold border border-slate-100">
                                    <div className="flex flex-col leading-tight">
                                        {/* <span> {group?.tenNhom}</span> */}
                                        <span className="text-xs text-slate-500 font-normal">
                                            Dịch bệnh  {selectedDisease.name} thuộc nhóm {group?.moTa}
                                        </span>
                                    </div>
                                </div>

                            </div>
                        </header>

                        <article className="space-y-10">
                            <section>
                                <div className="flex items-center mb-2">
                                    <div className="px-2 text-slate-600">
                                        <Bug size={18} />
                                    </div>
                                    <h2 className="text-lg font-bold text-slate-800 tracking-tight">Tác nhân gây bệnh</h2>
                                </div>

                                <div className="text-base leading-[1.5] text-slate-600 border-l-4 border-blue-100 pl-6">
                                    {agentDetails?.map((a, i) => (
                                        <div key={i}>
                                            <p className="font-bold">• {a?.name}</p>
                                            <p className="text-sm leading-[1.5] text-slate-600 ml-3 pb-3">
                                                {a?.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                            </section>
                            <section>
                                <div className="flex items-center mb-2">
                                    <div className="px-2 text-slate-600">
                                        <Stethoscope size={20} />
                                    </div>
                                    <h2 className="text-lg font-bold text-slate-800 tracking-tight">Triệu chứng nhận biết</h2>
                                </div>
                                <div className="text-base leading-[1.5] text-slate-600 border-l-4 border-blue-100 pl-6">
                                    {symptomDetails?.map((s, i) => (
                                        <div key={i}>
                                            <p className="font-bold">• {s?.name}</p>
                                            <p className="text-sm text-slate-600 leading-[1.5] ml-3 pb-3">{s?.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <div className="flex items-center mb-2">
                                    <div className="px-2 text-slate-600">
                                        <Share2 size={20} />
                                    </div>
                                    <h2 className="text-lg font-black text-slate-800 tracking-tight">Cơ chế lây truyền</h2>
                                </div>
                                <div className="text-base leading-[1.5] text-slate-600 border-l-4 border-blue-100 pl-6">         {transDetails?.map((t, i) => (
                                    <div key={i}>
                                        <p className="font-bold">• {t?.tenDuongLay}</p>
                                        <p className="text-sm text-slate-600 leading-[1.5] ml-3 pb-3">{t?.moTa}</p>
                                    </div>
                                ))}
                                </div>
                            </section>

                            <section>
                                <div className="flex items-center mb-2">
                                    <div className="px-2 text-slate-600">
                                        <Info size={20} />
                                    </div>
                                    <h2 className="text-lg font-black text-slate-800 tracking-tight">Thông tin chi tiết dịch bệnh</h2>
                                </div>
                                <div className="text-sm leading-[1.5] text-slate-700">
                                    {selectedDisease.desc}
                                </div>
                            </section>
                        </article>

                        <footer className="mt-20 pt-10 border-t border-slate-100 flex justify-between items-center text-slate-400">
                            <p>© 2026 Hệ thống Thông tin Y tế dự phòng</p>
                            <div className="flex gap-4">
                                <button className="hover:text-indigo-600 transition-colors"><Pencil size={18} /></button>
                                <button className="hover:text-rose-600 transition-colors"><Trash2 size={18} /></button>
                            </div>
                        </footer>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center bg-slate-50 text-slate-400">
                        <MousePointer2 size={48} className="mb-4 animate-bounce text-slate-300" />
                        <h2 className="text-xl font-bold">Bắt đầu trải nghiệm đọc</h2>
                        <p>Chọn một dịch bệnh từ danh sách để xem nội dung chi tiết</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default DiseaseInformation;