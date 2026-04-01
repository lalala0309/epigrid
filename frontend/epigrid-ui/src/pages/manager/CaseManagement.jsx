import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
    Plus, Search, ChevronRight, Edit, Trash2, X, Save,
    MapPin, Activity, MousePointer2, Info, User, Navigation,
    UserPlus, Phone, AlertCircle, Clock, ChevronsLeft, ChevronsRight,
    Calendar, Users, FileText, Shield
} from 'lucide-react';
import ResizablePanel from "../../components/resize/ResizablePanel";
import OpenLayerMap from "../../components/OpenLayerMap";
import diseaseApi from "../../api/diseaseApi";

import OLMap from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import OSM from "ol/source/OSM";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Style, Circle as CircleStyle, Fill, Stroke } from "ol/style";
import { fromLonLat, toLonLat } from "ol/proj";
import "ol/ol.css";
import caseApi from "../../api/caseApi";
import MapPicker from "../../components/map/MapPicker";
import CaseLocationMap from '../../components/map/CaseLocationMap';
import CaseListMap from '../../components/map/CaseListMap';
// ─── Mini Map ────────────────────────────────────────────────────────────────


// ─── Badge trạng thái ────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
    const map = {
        'DANG_MAC': 'bg-amber-50 text-amber-700 border-amber-100',
        'DA_KHOI': 'bg-green-50 text-green-700 border-green-100',
        'TU_VONG': 'bg-red-50 text-red-700 border-red-100',
    };
    const label = {
        'DANG_MAC': 'Đang mắc',
        'DA_KHOI': 'Đã khỏi',
        'TU_VONG': 'Tử vong',
    };
    return (
        <span className={`inline-flex items-center text-[9px] px-2 py-0.5 rounded-lg border font-bold ${map[status] || 'bg-slate-50 text-slate-600 border-slate-100'}`}>
            {label[status] || status}
        </span>
    );
};

// ─── Badge mức độ nguy cơ ─────────────────────────────────────────────────────
const RiskBadge = ({ risk }) => {
    const map = {
        'CAO': 'bg-red-50 text-red-700 border-red-100',
        'TRUNG_BINH': 'bg-amber-50 text-amber-700 border-amber-100',
        'THAP': 'bg-green-50 text-green-700 border-green-100',
    };
    const label = { 'CAO': 'Cao', 'TRUNG_BINH': 'Trung bình', 'THAP': 'Thấp' };
    return (
        <span className={`inline-flex items-center text-[9px] px-2 py-0.5 rounded-lg border font-bold ${map[risk] || 'bg-slate-50 text-slate-600 border-slate-100'}`}>
            {label[risk] || risk}
        </span>
    );
};

// ─── Section header ───────────────────────────────────────────────────────────
const SectionHead = ({ icon: Icon, label }) => (
    <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 border-b border-slate-100">
        {Icon && <Icon size={11} className="text-slate-400" />}
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
    </div>
);

// ─── Field hiển thị ───────────────────────────────────────────────────────────
const Field = ({ label, value, className = '' }) => (
    <div className={className}>
        <span className="text-[9px] text-slate-400 uppercase font-bold block mb-1">{label}</span>
        <p className="text-[11px] text-slate-700 font-medium">{value || '—'}</p>
    </div>
);

// ─── Form field wrapper ───────────────────────────────────────────────────────
const FormField = ({ label, required, children, className = '' }) => (
    <div className={`space-y-1 ${className}`}>
        <label className="text-[9px] font-bold text-slate-500 uppercase">
            {label} {required && <span className="text-red-400">*</span>}
        </label>
        {children}
    </div>
);

const inputCls = "w-full border border-slate-200 rounded-xl p-2.5 focus:border-indigo-500 outline-none text-[11px] bg-white";
const selectCls = "w-full border border-slate-200 rounded-xl p-2.5 outline-none text-[11px] bg-white focus:border-indigo-500";

// ─── Initial form states ──────────────────────────────────────────────────────
const EMPTY_CASE = {
    maBenhNhan: '',
    maDichBenh: '', maKhuVuc: '',
    // Bệnh nhân
    hoTen: '', soDienThoai: '', ngaySinh: '', gioiTinh: '',
    // Người ghi nhận
    nguoiBaoCao: '', nguoiBaoCaoHoTen: '', nguoiBaoCaoSDT: '', nguoiBaoCaoNgaySinh: '', nguoiBaoCaoGioiTinh: '',
    ngayPhatHien: '', tinhTrang: 'DANG_MAC',
    lat: '', lng: '', contacts: []
};

const EMPTY_CONTACT = {
    hoTen: '', soDienThoai: '', ngaySinh: '', gioiTinh: '',
    ngayTiepXuc: '', mucDoNguyCo: 'TRUNG_BINH', lat: '', lng: ''
};

// ─── Main Component ───────────────────────────────────────────────────────────
const CaseManagement = () => {

    const [selectedArea, setSelectedArea] = useState(null);
    useEffect(() => {
        const userId = localStorage.getItem("userId");

        fetch(`http://localhost:8082/api/areas/manager/${userId}`)
            .then(res => res.json())
            .then(data => {
                console.log("Area:", data);
                setSelectedArea({
                    id: data.id,
                    maGADM: data.maGADM,
                    level: data.level
                });
            });
    }, []);
    const [diseases, setDiseases] = useState([]);
    const [sb1Visible, setSb1Visible] = useState(true);

    useEffect(() => {
        diseaseApi.diseases.getAll()
            .then(res => setDiseases(res.data))
            .catch(err => console.error("Lỗi load diseases:", err));
    }, []);

    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // Load ca bệnh từ API
    const fetchCases = async () => {
        setLoading(true);
        try {
            const res = await caseApi.cases.getAll();
            // Map response về đúng shape frontend đang dùng
            const mapped = res.data.map(c => ({
                ...c,
                id: c.maCaBenh,
                contacts: (c.contacts || []).map(ct => ({
                    ...ct,
                    id: ct.maCaTiepXuc,
                }))
            }));
            setCases(mapped);
        } catch (err) {
            setError("Không thể tải danh sách ca bệnh");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => { fetchCases(); }, []);




    const [selectedDisease, setSelectedDisease] = useState(null);
    const [selectedCaseId, setSelectedCaseId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [view, setView] = useState('detail'); // 'detail' | 'form'
    const [formData, setFormData] = useState(null);
    const [activeTab, setActiveTab] = useState('info');

    const [isAddingContact, setIsAddingContact] = useState(false);
    const [contactForm, setContactForm] = useState(EMPTY_CONTACT);

    const selectedCase = cases.find(c => c.id === selectedCaseId);
    const [nguoiBaoCao, setNguoiBaoCao] = useState(null);

    useEffect(() => {
        if (!selectedCase?.nguoiBaoCao) return;

        fetch(`http://localhost:8081/api/users/${selectedCase.nguoiBaoCao}`)
            .then(res => res.json())
            .then(data => setNguoiBaoCao(data))
            .catch(err => console.error(err));

    }, [selectedCase]);

    const filteredCases = useMemo(() =>
        cases
            .filter(c => !selectedDisease || c.maDichBenh === selectedDisease.id)
            .filter(c => c.hoTen.toLowerCase().includes(searchTerm.toLowerCase())),
        [selectedDisease, searchTerm, cases]
    );

    const gioiTinhLabel = g => ({ NAM: 'Nam', NU: 'Nữ', KHAC: 'Khác' }[g] || '—');

    const handleOpenForm = (action, data = null) => {
        setFormData(action === 'add'
            ? { ...EMPTY_CASE, maDichBenh: selectedDisease?.id || '' }
            : { ...data }
        );
        setView('form');
        setActiveTab('info');
    };


    // ─── handleSave: gọi API create/update ───────────────────────────────────────
    const handleSave = async () => {
        if (!formData.hoTen || !formData.ngayPhatHien) return;
        const userId = localStorage.getItem("userId");
        // Build request body khớp CaBenhRequest
        const payload = {
            maBenhNhan: formData.maBenhNhan,
            maDichBenh: formData.maDichBenh || null,
            // maKhuVuc: formData.maKhuVuc || null,
            hoTen: formData.hoTen,
            maKhuVuc: selectedArea.id,
            soDienThoai: formData.soDienThoai,
            ngaySinh: formData.ngaySinh || null,
            gioiTinh: formData.gioiTinh || null,
            ngayPhatHien: formData.ngayPhatHien,
            tinhTrang: formData.tinhTrang || 'DANG_MAC',
            nguoiBaoCao: userId ? parseInt(userId) : null,
            lat: formData.lat ? parseFloat(formData.lat) : null,
            lng: formData.lng ? parseFloat(formData.lng) : null,
        };

        try {
            let res;
            if (formData.id) {
                res = await caseApi.cases.update(formData.id, payload);
            } else {
                res = await caseApi.cases.create(payload);
            }
            await fetchCases();                          // reload danh sách
            setView('detail');
            setSelectedCaseId(res.data.maCaBenh);
        } catch (err) {
            const msg = err.response?.data?.message || err.message;
            alert("Lỗi lưu ca bệnh: " + msg);
        }
    };

    // ─── handleAddContact: gọi API add contact ────────────────────────────────────
    const handleAddContact = async () => {
        if (!contactForm.hoTen) return;

        const payload = {
            hoTen: contactForm.hoTen,
            soDienThoai: contactForm.soDienThoai,
            ngaySinh: contactForm.ngaySinh || null,
            gioiTinh: contactForm.gioiTinh || null,
            ngayTiepXuc: contactForm.ngayTiepXuc || null,
            mucDoNguyCo: contactForm.mucDoNguyCo || 'TRUNG_BINH',
            lat: contactForm.lat ? parseFloat(contactForm.lat) : null,
            lng: contactForm.lng ? parseFloat(contactForm.lng) : null,
        };

        try {
            await caseApi.contacts.add(selectedCaseId, payload);
            await fetchCases();
            setIsAddingContact(false);
            setContactForm(EMPTY_CONTACT);
        } catch (err) {
            alert("Lỗi thêm ca tiếp xúc: " + err.message);
        }
    };

    const handleDeleteContact = (contactId) => {
        setCases(cases.map(c =>
            c.id !== selectedCaseId ? c
                : { ...c, contacts: c.contacts.filter(ct => ct.id !== contactId) }
        ));
    };

    // ─── handleDeleteCase: gọi API delete ────────────────────────────────────────
    const handleDeleteCase = async (caseId) => {
        if (!window.confirm("Xác nhận xóa ca bệnh này?")) return;
        try {
            await caseApi.cases.delete(caseId);
            await fetchCases();
            setSelectedCaseId(null);
            setView('detail');
        } catch (err) {
            alert("Lỗi xóa ca bệnh: " + err.message);
        }
    };

    return (
        <div className="flex h-screen w-full bg-slate-50 overflow-hidden text-[11px]">

            {/* ── Sidebar 1: Dịch bệnh ─────────────────────────────────── */}
            {sb1Visible ? (
                <ResizablePanel side="left" defaultWidth={200} min={160} className="bg-white border-r flex flex-col shrink-0">
                    <div className="p-3 border-b flex items-center justify-between h-10 bg-white">
                        <div className="flex items-center gap-1.5">
                            <Activity size={13} className="text-indigo-600" />
                            <span className="font-bold text-slate-400 uppercase text-[9px] tracking-wider">Loại dịch bệnh</span>
                        </div>
                        <button
                            onClick={() => setSb1Visible(false)}
                            className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                            title="Ẩn sidebar"
                        >
                            <ChevronsLeft size={13} />
                        </button>
                    </div>
                    <div className="p-2 space-y-1 overflow-y-auto">
                        <button
                            onClick={() => { setSelectedDisease(null); setSelectedCaseId(null); }}
                            className={`w-full text-left px-3 py-2 rounded-xl transition-all text-[10px] ${!selectedDisease ? "bg-indigo-50 text-indigo-800 font-bold" : "text-slate-600 hover:bg-slate-50"}`}
                        >
                            Tất cả ca bệnh
                        </button>
                        {diseases.map(d => (
                            <button key={d.id}
                                onClick={() => { setSelectedDisease(d); setSelectedCaseId(null); }}
                                className={`w-full text-left px-3 py-2 rounded-xl transition-all text-[10px] ${selectedDisease?.id === d.id ? "bg-indigo-50 text-indigo-800 font-bold" : "text-slate-600 hover:bg-slate-50"}`}
                            >
                                {d.name}
                            </button>
                        ))}
                    </div>
                </ResizablePanel>
            ) : (
                <div className="flex flex-col items-center py-2 px-1 bg-white border-r shrink-0">
                    <button
                        onClick={() => setSb1Visible(true)}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                        title="Hiện sidebar"
                    >
                        <ChevronsRight size={13} />
                    </button>
                </div>
            )}

            {/* ── Sidebar 2: Danh sách ca bệnh ─────────────────────────── */}
            <ResizablePanel side="left" defaultWidth={260} min={220} className="bg-white border-r flex flex-col shrink-0">
                <div className="p-3 border-b flex justify-between items-center h-10 bg-white">
                    <span className="font-bold text-slate-400 uppercase text-[9px] tracking-wider">Danh sách ca bệnh</span>
                    <button onClick={() => handleOpenForm('add')} className="p-1 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-colors">
                        <Plus size={13} />
                    </button>
                </div>
                <div className="p-2 border-b">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2 text-slate-400" size={11} />
                        <input
                            placeholder="Tìm tên bệnh nhân..."
                            className="w-full pl-7 pr-3 py-1.5 bg-slate-100 border-none rounded-xl outline-none focus:ring-1 focus:ring-indigo-400 text-[10px]"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="p-2 space-y-1 overflow-y-auto flex-1">
                    {filteredCases.length === 0 && (
                        <div className="py-8 text-center text-slate-400 text-[10px]">Không có kết quả</div>
                    )}
                    {filteredCases.map(c => (
                        <button key={c.id}
                            onClick={() => { setSelectedCaseId(c.id); setView('detail'); setIsAddingContact(false); setActiveTab('info'); }}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${selectedCaseId === c.id ? "bg-indigo-50 text-indigo-800 font-bold shadow-sm border border-indigo-100" : "text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-100"}`}
                        >
                            <div className="flex flex-col items-start overflow-hidden">
                                <span className="truncate w-full text-[10px]">{c.hoTen}</span>
                                <span className="text-[9px] text-slate-400 font-normal">{c.maBenhNhan}</span>
                            </div>
                            {selectedCaseId === c.id && <ChevronRight size={11} className="shrink-0" />}
                        </button>
                    ))}
                </div>
            </ResizablePanel>

            {/* ── Main ─────────────────────────────────────────────────── */}
            <main className="flex-1 p-2 flex flex-col min-w-0 relative">
                <div className="flex-1 bg-white border rounded-2xl shadow-sm flex flex-col overflow-hidden">

                    {/* ══ FORM THÊM / SỬA CA BỆNH ════════════════════════ */}
                    {view === 'form' && formData ? (
                        <div className="flex flex-col h-full">
                            <div className="p-3 border-b bg-slate-50/50 flex justify-between items-center h-10 shrink-0">
                                <div className="flex items-center gap-2 font-bold text-indigo-800 uppercase text-[10px]">
                                    <Edit size={13} />
                                    <span>{formData.id ? 'Cập nhật thông tin ca bệnh' : 'Ghi nhận ca bệnh mới'}</span>
                                </div>
                                <button onClick={() => setView('detail')} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
                                    <X size={13} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-hidden">
                                <div className="grid grid-cols-2 h-full divide-x">

                                    {/* Cột trái */}
                                    <div className="overflow-y-auto">
                                        {/* Thông tin bệnh nhân */}
                                        <SectionHead icon={User} label="Thông tin bệnh nhân" />
                                        <div className="p-4 grid grid-cols-2 gap-3">
                                            <FormField label="Mã bệnh nhân" required className="col-span-2">
                                                <input
                                                    className={inputCls}
                                                    value={formData.maBenhNhan}
                                                    onChange={e => setFormData({ ...formData, maBenhNhan: e.target.value })}
                                                    placeholder="Nhập mã bệnh nhân..."
                                                />
                                            </FormField>
                                            <FormField label="Họ và tên" required className="col-span-2">
                                                <input className={inputCls} value={formData.hoTen}
                                                    onChange={e => setFormData({ ...formData, hoTen: e.target.value })}
                                                    placeholder="VD: Nguyễn Văn A..." />
                                            </FormField>
                                            <FormField label="Ngày sinh" required>
                                                <input type="date" className={inputCls} value={formData.ngaySinh}
                                                    onChange={e => setFormData({ ...formData, ngaySinh: e.target.value })} />
                                            </FormField>
                                            <FormField label="Giới tính" required>
                                                <select className={selectCls} value={formData.gioiTinh}
                                                    onChange={e => setFormData({ ...formData, gioiTinh: e.target.value })}>
                                                    <option value="">-- Chọn --</option>
                                                    <option value="NAM">Nam</option>
                                                    <option value="NU">Nữ</option>
                                                    <option value="KHAC">Khác</option>
                                                </select>
                                            </FormField>
                                            <FormField label="Số điện thoại">
                                                <input className={inputCls} value={formData.soDienThoai}
                                                    onChange={e => setFormData({ ...formData, soDienThoai: e.target.value })}
                                                    placeholder="09xx..." />
                                            </FormField>
                                            <FormField label="Loại bệnh">
                                                <select className={selectCls} value={formData.maDichBenh}
                                                    onChange={e => setFormData({ ...formData, maDichBenh: parseInt(e.target.value) })}>
                                                    <option value="">-- Chọn --</option>
                                                    {diseases.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                                </select>
                                            </FormField>
                                            <FormField label="Ngày phát hiện" required>
                                                <input type="date" className={inputCls} value={formData.ngayPhatHien}
                                                    onChange={e => setFormData({ ...formData, ngayPhatHien: e.target.value })} />
                                            </FormField>
                                            <FormField label="Tình trạng">
                                                <select className={selectCls} value={formData.tinhTrang}
                                                    onChange={e => setFormData({ ...formData, tinhTrang: e.target.value })}>
                                                    <option value="DANG_MAC">Đang mắc</option>
                                                    <option value="DA_KHOI">Đã khỏi</option>
                                                    <option value="TU_VONG">Tử vong</option>
                                                </select>
                                            </FormField>
                                        </div>


                                        {/* Tọa độ */}
                                        <div className="mx-4 mb-4 p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
                                            <div className="flex items-center gap-1.5 text-indigo-700 font-bold text-[9px] uppercase mb-2">
                                                <MapPin size={11} /> Tọa độ vị trí
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="space-y-1">
                                                    <label className="text-[9px] text-indigo-500 font-bold">Vĩ độ (Lat)</label>
                                                    <input type="number" value={formData.lat}
                                                        onChange={e => setFormData({ ...formData, lat: e.target.value })}
                                                        className="w-full border border-indigo-200 bg-white rounded-xl p-2.5 outline-none text-[11px] focus:border-indigo-400"
                                                        placeholder="10.76..." />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[9px] text-indigo-500 font-bold">Kinh độ (Lng)</label>
                                                    <input type="number" value={formData.lng}
                                                        onChange={e => setFormData({ ...formData, lng: e.target.value })}
                                                        className="w-full border border-indigo-200 bg-white rounded-xl p-2.5 outline-none text-[11px] focus:border-indigo-400"
                                                        placeholder="106.66..." />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 px-4 pb-4 justify-end">
                                            <button onClick={() => setView('detail')} className="px-5 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all uppercase text-[9px]">
                                                Hủy bỏ
                                            </button>
                                            <button onClick={handleSave} className="px-7 py-2 bg-indigo-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all uppercase text-[9px] tracking-widest">
                                                <Save size={12} /> Lưu hồ sơ
                                            </button>
                                        </div>
                                    </div>

                                    {/* Cột phải: bản đồ */}
                                    <div className="flex flex-col">
                                        <div className="p-3 bg-slate-50 border-b flex items-center gap-2">
                                            <Navigation size={12} className="text-indigo-500" />
                                            <span className="font-bold text-slate-400 uppercase text-[9px] tracking-wider">Chọn vị trí trên bản đồ</span>
                                        </div>
                                        <div className="flex-1 p-3">
                                            <MapPicker
                                                lat={formData.lat}
                                                lng={formData.lng}
                                                selectedArea={selectedArea}
                                                onChange={(lat, lng) =>
                                                    setFormData(f => ({ ...f, lat, lng }))
                                                }
                                            />

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        /* ══ CHI TIẾT CA BỆNH ══════════════════════════════════ */
                    ) : selectedCase ? (
                        <div className="flex flex-col h-full">
                            {/* Header */}
                            <div className="p-3 border-b bg-slate-50/50 flex justify-between items-center h-10 shrink-0">
                                <div className="flex items-center gap-2 font-bold text-indigo-800 uppercase text-[10px]">
                                    <User size={13} />
                                    <span>{selectedCase.hoTen}</span>
                                    <StatusBadge status={selectedCase.tinhTrang} />
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={() => handleOpenForm('edit', selectedCase)} className="p-1.5 hover:bg-indigo-50 text-indigo-500 rounded-lg transition-colors">
                                        <Edit size={12} />
                                    </button>
                                    <button onClick={() => handleDeleteCase(selectedCase.id)} className="p-1.5 hover:bg-red-50 text-red-400 rounded-lg transition-colors">
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="flex border-b shrink-0">
                                {[
                                    { key: 'info', label: 'Thông tin ca bệnh', icon: Info },
                                    { key: 'contacts', label: `Ca tiếp xúc (${selectedCase.contacts?.length || 0})`, icon: Users }
                                ].map(tab => (
                                    <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                                        className={`flex items-center gap-1.5 px-4 py-2.5 text-[10px] font-bold border-b-2 transition-all ${activeTab === tab.key ? 'border-indigo-500 text-indigo-700 bg-indigo-50/40' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                                        <tab.icon size={11} />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* ── Tab: Thông tin ─────────────────────────── */}
                            {activeTab === 'info' && (
                                <div className="flex-1 grid grid-cols-2 overflow-hidden divide-x">
                                    <div className="overflow-y-auto">
                                        {/* Bệnh nhân */}
                                        <SectionHead icon={User} label="Thông tin bệnh nhân" />
                                        <div className="p-4 grid grid-cols-2 gap-x-4 gap-y-3">
                                            <Field label="Mã bệnh nhân" value={selectedCase.maBenhNhan} className="col-span-2" />
                                            <Field label="Họ và tên" value={selectedCase.hoTen} className="col-span-2" />
                                            <Field label="Ngày sinh" value={selectedCase.ngaySinh} />
                                            <Field label="Giới tính" value={gioiTinhLabel(selectedCase.gioiTinh)} />
                                            <Field label="Số điện thoại" value={selectedCase.soDienThoai} />
                                            <div>
                                                <span className="text-[9px] text-slate-400 uppercase font-bold block mb-1">Tình trạng</span>
                                                <StatusBadge status={selectedCase.tinhTrang} />
                                            </div>
                                        </div>

                                        {/* Dịch tễ */}
                                        <SectionHead icon={Activity} label="Thông tin dịch tễ" />
                                        <div className="p-4 grid grid-cols-2 gap-x-4 gap-y-3">
                                            <Field label="Loại bệnh" value={diseases.find(d => d.id === selectedCase.maDichBenh)?.name} />
                                            <Field label="Ngày phát hiện" value={selectedCase.ngayPhatHien} />
                                            <Field label="Tọa độ" value={selectedCase.lat && selectedCase.lng ? `${selectedCase.lat}, ${selectedCase.lng}` : '—'} className="col-span-2" />
                                        </div>

                                        {/* Người ghi nhận */}
                                        <SectionHead icon={Shield} label="Người ghi nhận" />

                                        <div className="p-4 grid grid-cols-2 gap-x-4 gap-y-3">
                                            <Field
                                                label="Họ và tên"
                                                value={nguoiBaoCao?.hoTen || "..."}
                                                className="col-span-2"
                                            />

                                            <Field
                                                label="Mã nhân viên"
                                                value={nguoiBaoCao?.maNhanVien || "..."}
                                            />

                                            <Field
                                                label="Email"
                                                value={nguoiBaoCao?.email || "..."}
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 relative">
                                        <CaseLocationMap
                                            selectedArea={selectedArea}
                                            areaColor="rgba(0,150,255,0.10)"
                                            lat={selectedCase.lat}
                                            lng={selectedCase.lng}
                                        />
                                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg border text-[9px] font-bold shadow-sm">
                                            Vị trí ca bệnh
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── Tab: Ca tiếp xúc ───────────────────────── */}
                            {activeTab === 'contacts' && (
                                <div className="flex-1 flex flex-col overflow-hidden">

                                    {/* Action bar */}
                                    <div className="px-4 py-2 border-b bg-slate-50/50 flex justify-between items-center shrink-0">
                                        <span className="text-[9px] text-slate-400 italic">Người tiếp xúc gần với ca bệnh</span>
                                        <button
                                            onClick={() => { setIsAddingContact(v => !v); setContactForm(EMPTY_CONTACT); }}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-[9px] font-bold hover:bg-indigo-700 transition-all uppercase tracking-wide shadow-sm shadow-indigo-100"
                                        >
                                            {isAddingContact ? <X size={10} /> : <Plus size={10} />}
                                            {isAddingContact ? 'Đóng form' : 'Thêm ca tiếp xúc'}
                                        </button>
                                    </div>

                                    {/* ── Form thêm ca tiếp xúc (độc lập, trên danh sách) ── */}
                                    {isAddingContact && (
                                        <div className="border-b border-indigo-100 bg-indigo-50/20 shrink-0">
                                            <div className="mx-3 my-3 border border-indigo-200 rounded-2xl overflow-hidden">
                                                <div className="px-4 py-2 bg-indigo-600 flex items-center justify-between">
                                                    <div className="flex items-center gap-2 text-white font-bold text-[9px] uppercase">
                                                        <UserPlus size={12} /> Thêm ca tiếp xúc mới
                                                    </div>
                                                    <button onClick={() => setIsAddingContact(false)} className="text-white/60 hover:text-white transition-colors">
                                                        <X size={12} />
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-2 divide-x bg-white">
                                                    {/* Form fields */}
                                                    <div className="p-4 grid grid-cols-2 gap-3">
                                                        <FormField label="Họ và tên" required className="col-span-2">
                                                            <input className={inputCls} value={contactForm.hoTen}
                                                                onChange={e => setContactForm({ ...contactForm, hoTen: e.target.value })}
                                                                placeholder="VD: Nguyễn Thị E..." />
                                                        </FormField>
                                                        <FormField label="Ngày sinh">
                                                            <input type="date" className={inputCls} value={contactForm.ngaySinh}
                                                                onChange={e => setContactForm({ ...contactForm, ngaySinh: e.target.value })} />
                                                        </FormField>
                                                        <FormField label="Giới tính">
                                                            <select className={selectCls} value={contactForm.gioiTinh}
                                                                onChange={e => setContactForm({ ...contactForm, gioiTinh: e.target.value })}>
                                                                <option value="">-- Chọn --</option>
                                                                <option value="NAM">Nam</option>
                                                                <option value="NU">Nữ</option>
                                                                <option value="KHAC">Khác</option>
                                                            </select>
                                                        </FormField>
                                                        <FormField label="Số điện thoại">
                                                            <input className={inputCls} value={contactForm.soDienThoai}
                                                                onChange={e => setContactForm({ ...contactForm, soDienThoai: e.target.value })}
                                                                placeholder="09xx..." />
                                                        </FormField>
                                                        <FormField label="Ngày tiếp xúc">
                                                            <input type="date" className={inputCls} value={contactForm.ngayTiepXuc}
                                                                onChange={e => setContactForm({ ...contactForm, ngayTiepXuc: e.target.value })} />
                                                        </FormField>
                                                        <FormField label="Mức độ nguy cơ">
                                                            <select className={selectCls} value={contactForm.mucDoNguyCo}
                                                                onChange={e => setContactForm({ ...contactForm, mucDoNguyCo: e.target.value })}>
                                                                <option value="THAP">Thấp</option>
                                                                <option value="TRUNG_BINH">Trung bình</option>
                                                                <option value="CAO">Cao</option>
                                                            </select>
                                                        </FormField>

                                                        {/* Tọa độ */}
                                                        <div className="col-span-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                                                            <span className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1">
                                                                <MapPin size={9} className="text-indigo-400" /> Tọa độ nơi ở
                                                            </span>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <input type="number" value={contactForm.lat}
                                                                    onChange={e => setContactForm({ ...contactForm, lat: e.target.value })}
                                                                    className={inputCls} placeholder="Lat: 10.76..." />
                                                                <input type="number" value={contactForm.lng}
                                                                    onChange={e => setContactForm({ ...contactForm, lng: e.target.value })}
                                                                    className={inputCls} placeholder="Lng: 106.6..." />
                                                            </div>
                                                        </div>

                                                        <div className="col-span-2 flex gap-2 justify-end pt-1">
                                                            <button onClick={() => setIsAddingContact(false)} className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 text-[9px] uppercase">
                                                                Hủy
                                                            </button>
                                                            <button onClick={handleAddContact} className="px-5 py-1.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 text-[9px] uppercase flex items-center gap-1.5 shadow-sm shadow-indigo-100">
                                                                <Save size={10} /> Lưu
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Mini map */}
                                                    <div className="flex flex-col">
                                                        <div className="px-3 py-2 bg-slate-50 border-b flex items-center gap-1.5">
                                                            <Navigation size={10} className="text-indigo-500" />
                                                            <span className="text-[9px] font-bold text-slate-400 uppercase">Chọn vị trí nơi ở</span>
                                                        </div>
                                                        <div className="flex-1 p-3 min-h-[200px]">
                                                            <MapPicker
                                                                lat={contactForm.lat}
                                                                lng={contactForm.lng}
                                                                selectedArea={selectedArea}
                                                                onChange={(lat, lng) =>
                                                                    setContactForm(f => ({ ...f, lat, lng }))
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* ── Danh sách ca tiếp xúc (luôn hiển thị, độc lập) ── */}
                                    <div className="flex-1 overflow-y-auto">
                                        <SectionHead icon={Users} label={`Danh sách đã ghi nhận (${selectedCase.contacts?.length || 0})`} />

                                        {(!selectedCase.contacts || selectedCase.contacts.length === 0) && (
                                            <div className="flex flex-col items-center justify-center py-12 text-slate-400 space-y-2">
                                                <AlertCircle size={26} className="text-slate-200" />
                                                <span className="text-[10px]">Chưa có ca tiếp xúc nào được ghi nhận</span>
                                            </div>
                                        )}

                                        {selectedCase.contacts?.map(ct => (
                                            <div key={ct.id} className="flex items-center gap-3 px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-all">
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-[11px] font-bold text-indigo-700 shrink-0">
                                                    {ct.hoTen?.charAt(0)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="font-bold text-slate-700 text-[11px]">{ct.hoTen}</span>
                                                        <RiskBadge risk={ct.mucDoNguyCo} />
                                                    </div>
                                                    <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                                                        <span className="text-[9px] text-slate-400 flex items-center gap-1">
                                                            <Calendar size={8} />
                                                            {ct.ngaySinh} · {gioiTinhLabel(ct.gioiTinh)}
                                                        </span>
                                                        {ct.soDienThoai && (
                                                            <span className="text-[9px] text-slate-400 flex items-center gap-1">
                                                                <Phone size={8} />{ct.soDienThoai}
                                                            </span>
                                                        )}
                                                        {ct.ngayTiepXuc && (
                                                            <span className="text-[9px] text-slate-400 flex items-center gap-1">
                                                                <Clock size={8} />Tiếp xúc: {ct.ngayTiepXuc}
                                                            </span>
                                                        )}
                                                        {ct.lat && ct.lng && (
                                                            <span className="text-[9px] text-slate-400 flex items-center gap-1">
                                                                <MapPin size={8} />{ct.lat}, {ct.lng}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <button onClick={() => handleDeleteContact(ct.id)} className="p-1.5 hover:bg-red-50 text-red-400 rounded-lg transition-colors shrink-0">
                                                    <Trash2 size={11} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        /* ══ TRANG TRỐNG ════════════════════════════════════════ */
                    ) : (
                        <div className="flex-1 relative">
                            <CaseListMap
                                selectedArea={selectedArea}
                                areaColor="rgba(0,150,255,0.10)"
                                cases={filteredCases}
                            />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default CaseManagement;