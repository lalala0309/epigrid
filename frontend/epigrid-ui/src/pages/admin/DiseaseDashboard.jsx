import axios from "axios";
import React, { useState, useEffect, useMemo } from 'react';
import {
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';
import {
    Menu, X, Map as MapIcon, History, LayoutDashboard,
    TrendingUp, PieChart as PieIcon, Search, User,
    ChevronRight, ChevronDown, Layers, Activity, Calendar, Filter
} from 'lucide-react';
import diseaseApi from "../../api/diseaseApi";
import areaApi from "../../api/areaApi";

// --- DATA MOCKUP ---

// const structureData = [
//     { name: 'Đang điều trị', value: 2021, color: '#2563eb' },
//     { name: 'Đã hồi phục', value: 10230, color: '#059669' },
//     { name: 'Tử vong', value: 154, color: '#dc2626' },
// ];

// const reportHistory = [
//     { caseId: 'BN-2026-001', staffId: 'NV-042', staffName: 'Nguyễn Trần Anh', date: '2026-04-20', type: 'Ca nhiễm', disease: 'covid-19' },
//     { caseId: 'BN-2026-002', staffId: 'NV-015', staffName: 'Lê Thị Bình', date: '2026-04-19', type: 'Tiếp xúc gần', disease: 'covid-19' },
//     { caseId: 'BN-2026-003', staffId: 'NV-042', staffName: 'Nguyễn Trần Anh', date: '2026-04-18', type: 'Ca nhiễm', disease: 'covid-19' },
// ];

const DiseaseDashboard = () => {
    // UI State
    const [showDiseaseSidebar, setShowDiseaseSidebar] = useState(true);
    const [showAreaSidebar, setShowAreaSidebar] = useState(true);
    const [viewMode, setViewMode] = useState('chart');

    const [reportHistory, setReportHistory] = useState([]);
    const [searchArea, setSearchArea] = useState('');

    // Filter State
    const formatDate = (date) => {
        const d = new Date(date);
        const offset = d.getTimezoneOffset() * 60000;
        const local = new Date(d.getTime() - offset);
        return local.toISOString().split('T')[0];
    };

    const getToday = () => formatDate(new Date());

    const get7DaysAgo = () => {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        return formatDate(d);
    };

    const [dateRange, setDateRange] = useState({
        start: get7DaysAgo(),
        end: getToday()
    });
    const [searchDisease, setSearchDisease] = useState('');
    const [searchHistory, setSearchHistory] = useState('');

    const [diseases, setDiseases] = useState([]);
    const [selectedDisease, setSelectedDisease] = useState(null);

    const [areas, setAreas] = useState([]);
    const [selectedAreaId, setSelectedAreaId] = useState(null);

    useEffect(() => {
        const fetchDiseases = async () => {
            try {
                const res = await diseaseApi.diseases.getAll();
                setDiseases(res.data);
                if (res.data.length > 0) {
                    setSelectedDisease(res.data[0].id);
                }
            } catch (err) {
                console.error("Lỗi load diseases:", err);
            }
        };

        fetchDiseases();
    }, []);

    useEffect(() => {
        const fetchAreas = async () => {
            try {
                const res = await areaApi.getAll();

                const transform = (list) => list.map(a => ({
                    ...a,
                    children: a.children ? transform(a.children) : []
                }));

                setAreas(transform(res.data));

                // auto chọn node đầu tiên
                if (res.data.length > 0) {
                    setSelectedAreaId(res.data[0].id);
                }

            } catch (err) {
                console.error("Lỗi load areas:", err);
            }
        };

        fetchAreas();
    }, []);

    const [stats, setStats] = useState({
        newCases: 0,
        recovered: 0,
        deaths: 0
    });

    console.log("Selected Area ID:", selectedAreaId);

    useEffect(() => {
        if (!selectedAreaId || !selectedDisease) return;

        const fetchStats = async () => {
            try {
                const res = await axios.get("http://localhost:8080/api/cases/stats/today", {
                    params: {
                        maKhuVuc: selectedAreaId,
                        diseaseId: selectedDisease
                    }
                });
                setStats(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchStats();
    }, [selectedAreaId, selectedDisease]);

    const [trendData, setTrendData] = useState([]);
    useEffect(() => {
        if (!selectedAreaId || !selectedDisease) return;

        const fetchChart = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:8080/api/cases/chart/line",
                    {
                        params: {
                            maKhuVuc: selectedAreaId,
                            diseaseId: selectedDisease,
                            startDate: dateRange.start,
                            endDate: dateRange.end
                        }
                    }
                );

                setTrendData(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchChart();
    }, [selectedAreaId, selectedDisease, dateRange]);

    const selectedDiseaseObj = diseases.find(d => d.id === selectedDisease);

    const [structureData, setStructureData] = useState([]);
    useEffect(() => {
        if (!selectedAreaId || !selectedDisease) return;

        const fetchPie = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:8080/api/cases/chart/status-pie",
                    {
                        params: {
                            maKhuVuc: selectedAreaId,
                            diseaseId: selectedDisease,
                            startDate: dateRange.start,
                            endDate: dateRange.end
                        }
                    }
                );

                setStructureData(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchPie();
    }, [selectedAreaId, selectedDisease, dateRange]);

    useEffect(() => {
        if (!selectedAreaId) return;

        const fetchHistory = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:8080/api/cases/history",
                    {
                        params: { maKhuVuc: selectedAreaId }
                    }
                );

                setReportHistory(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchHistory();
    }, [selectedAreaId]);

    // Logic lọc danh mục bệnh
    const filteredDiseases = useMemo(() => {
        return diseases.filter(d =>
            d.name.toLowerCase().includes(searchDisease.toLowerCase())
        );
    }, [searchDisease, diseases]);

    // Logic tìm kiếm lịch sử
    const filteredHistory = useMemo(() => {
        const keyword = searchHistory.toLowerCase();

        return reportHistory.filter(item =>
            (item.caseId || '').toLowerCase().includes(keyword) ||
            (item.staffId || '').toLowerCase().includes(keyword) ||
            (item.staffName || '').toLowerCase().includes(keyword)
        );
    }, [searchHistory, reportHistory]);

    const filterAreas = (list, keyword) => {
        return list
            .map(area => {
                const nameMatch = area.name.toLowerCase().includes(keyword.toLowerCase());

                const filteredChildren = area.children
                    ? filterAreas(area.children, keyword)
                    : [];

                //  nếu CHÍNH NODE match → KHÔNG cần giữ toàn bộ con
                if (nameMatch) {
                    return {
                        ...area,
                        children: filteredChildren // hoặc [] nếu muốn chỉ hiện node
                    };
                }

                // nếu CON match → giữ cha + chỉ giữ con match
                if (filteredChildren.length > 0) {
                    return {
                        ...area,
                        children: filteredChildren
                    };
                }

                return null;
            })
            .filter(Boolean);
    };

    const filteredAreas = useMemo(() => {
        if (!searchArea) return areas;
        return filterAreas(areas, searchArea);
    }, [areas, searchArea]);

    return (
        <div className="flex h-full bg-[#F8FAFC] text-[12px] antialiased text-slate-700 overflow-hidden">

            {/* SIDEBAR 1: DANH MỤC BỆNH (Đã thêm Search) */}
            {showDiseaseSidebar && (
                <aside className="w-52 bg-white border-r border-slate-200 flex flex-col flex-none shadow-sm transition-all">
                    <div className="p-3 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h2 className="font-bold text-slate-800 flex items-center gap-2">
                            <Activity size={16} className="text-blue-600" /> Dịch bệnh
                        </h2>
                        <button onClick={() => setShowDiseaseSidebar(false)} className="text-slate-400 hover:text-red-500"><X size={14} /></button>
                    </div>

                    {/* Thanh tìm kiếm bệnh mới */}
                    <div className="p-2 border-b border-slate-50">
                        <div className="relative">
                            <Search className="absolute left-2 top-2 text-slate-400" size={12} />
                            <input
                                type="text"
                                placeholder="Tìm bệnh..."
                                value={searchDisease}
                                onChange={(e) => setSearchDisease(e.target.value)}
                                className="w-full pl-7 pr-2 py-1.5 text-[11px] bg-slate-100 border-none rounded outline-none focus:ring-1 ring-blue-400"
                            />
                        </div>
                    </div>

                    <nav className="flex-1 overflow-y-auto p-2 space-y-0.5 scrollbar-hover">
                        {filteredDiseases.length > 0 ? (
                            filteredDiseases.map(d => (
                                <button
                                    key={d.id}
                                    onClick={() => setSelectedDisease(d.id)}
                                    className={`w-full flex items-center px-3 py-2 rounded transition-all 
                                ${selectedDisease === d.id
                                            ? 'bg-blue-50 text-blue-700 font-bold shadow-sm'
                                            : 'hover:bg-slate-50 text-slate-600'
                                        }`}
                                >
                                    <div className={`w-1.5 h-1.5 rounded-full mr-2 
                                    ${selectedDisease === d.id ? 'bg-blue-600' : 'bg-slate-300'}`}
                                    />
                                    <span className="truncate">{d.name}</span>
                                </button>
                            ))
                        ) : (
                            <div className="p-4 text-center text-slate-400 text-[10px]">Không tìm thấy</div>
                        )}
                    </nav>
                </aside>
            )}

            {/* SIDEBAR 2: CẤU TRÚC KHU VỰC */}
            {showAreaSidebar && (
                <aside className="w-56 bg-white border-r border-slate-200 flex flex-col flex-none shadow-sm transition-all">
                    <div className="p-3 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h2 className="font-bold text-slate-800 flex items-center gap-2">
                            <Layers size={16} className="text-indigo-600" /> Khu vực
                        </h2>
                        <button onClick={() => setShowAreaSidebar(false)} className="text-slate-400 hover:text-red-500"><X size={14} /></button>
                    </div>
                    <div className="p-2 border-b border-slate-50">
                        <div className="relative">
                            <Search className="absolute left-2 top-2 text-slate-400" size={12} />
                            <input
                                type="text"
                                placeholder="Tìm vùng..."
                                value={searchArea}
                                onChange={(e) => setSearchArea(e.target.value)}
                                className="w-full pl-7 pr-2 py-1.5 text-[11px] bg-slate-100 border-none rounded outline-none focus:ring-1 ring-blue-400"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 scrollbar-hidden scrollbar-hover">
                        {filteredAreas.map(area => (
                            <AreaTreeItem
                                key={area.id}
                                item={area}
                                selectedId={selectedAreaId}
                                setSelectedId={setSelectedAreaId}
                            />
                        ))}
                    </div>
                </aside>
            )}

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* GLOBAL HEADER */}
                <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 z-10 shadow-sm">
                    <div className="flex items-center gap-3">
                        {!showDiseaseSidebar && (
                            <button onClick={() => setShowDiseaseSidebar(true)} className="p-1.5 bg-slate-100 hover:bg-blue-100 rounded text-blue-600 transition-colors">
                                <Activity size={16} />
                            </button>
                        )}
                        {!showAreaSidebar && (
                            <button onClick={() => setShowAreaSidebar(true)} className="p-1.5 bg-slate-100 hover:bg-indigo-100 rounded text-indigo-600 transition-colors">
                                <Layers size={16} />
                            </button>
                        )}
                        <div className="h-4 w-[1px] bg-slate-200 mx-1" />
                        <div className="flex items-center gap-2 text-slate-400 uppercase tracking-widest font-bold text-[10px]">
                            <span className="text-blue-600">
                                {selectedDiseaseObj?.name}
                            </span>
                            <ChevronRight size={12} />
                            <span className="text-slate-800">Dashboard</span>
                        </div>
                    </div>



                    <div className="flex items-center gap-4">
                        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                            <button onClick={() => setViewMode('chart')} className={`px-4 py-1.5 rounded-md text-[10px] font-black transition-all ${viewMode === 'chart' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                                <LayoutDashboard size={14} className="inline mr-1.5" /> BIỂU ĐỒ
                            </button>
                            <button onClick={() => setViewMode('history')} className={`px-4 py-1.5 rounded-md text-[10px] font-black transition-all ${viewMode === 'history' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                                <History size={14} className="inline mr-1.5" /> LỊCH SỬ
                            </button>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-2 space-y-2">
                    {viewMode === 'chart' ? (
                        <>
                            {/* Stats Grid */}
                            <div className="grid grid-cols-4 gap-2">
                                <StatCard title="Ca nhiễm mới" value={`+${stats.newCases}`} sub="" color="text-blue-600" icon={<Activity size={18} />} border="border-b-2 border-blue-500" />
                                <StatCard title="Hồi phục" value={stats.recovered} sub="" color="text-emerald-600" icon={<TrendingUp size={18} />} border="border-b-2 border-emerald-500" />
                                <StatCard title="Tử vong" value={stats.deaths} sub="" color="text-red-600" icon={<X size={18} />} border="border-b-2 border-red-500" />
                            </div>

                            {/* Charts Section */}
                            <div className="grid grid-cols-12 gap-2">
                                <div className="col-span-12 xl:col-span-8 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="font-bold text-slate-600 uppercase text-[11px] flex items-center gap-2">
                                            <TrendingUp size={16} className="text-blue-600" /> Diễn biến dịch bệnh
                                        </h3>
                                        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-2 py-1 shadow-sm">
                                            <Calendar size={14} className="text-slate-400" />

                                            <input
                                                type="date"
                                                value={dateRange.start}
                                                onChange={(e) =>
                                                    setDateRange(prev => ({ ...prev, start: e.target.value }))
                                                }
                                                className="text-[11px] outline-none text-slate-600"
                                            />

                                            <span className="text-slate-400 text-[11px]">→</span>

                                            <input
                                                type="date"
                                                value={dateRange.end}
                                                onChange={(e) =>
                                                    setDateRange(prev => ({ ...prev, end: e.target.value }))
                                                }
                                                className="text-[11px] outline-none text-slate-600"
                                            />
                                        </div>
                                    </div>
                                    <div className="h-[350px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                <defs>
                                                    <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                    </linearGradient>
                                                    <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                                    </linearGradient>
                                                    <linearGradient id="colorDeath" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                                <Area type="monotone" dataKey="cases" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCases)" />
                                                <Area type="monotone" dataKey="recovered" stroke="#059669" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRec)" />
                                                <Area type="monotone" dataKey="deaths" stroke="#dc2626" strokeWidth={2.5} fillOpacity={1} fill="url(#colorDeath)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                <div className="col-span-12 xl:col-span-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                    <h3 className="font-black text-slate-800 uppercase text-[11px] mb-6 flex items-center gap-2 tracking-wider">
                                        <PieIcon size={16} className="text-purple-600" /> Cơ cấu tình trạng
                                    </h3>
                                    <div className="h-[250px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie data={structureData} innerRadius={60} outerRadius={85} paddingAngle={8} dataKey="value">
                                                    {structureData.map((entry, index) => <Cell key={index} fill={entry.color} strokeWidth={0} />)}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="mt-4 space-y-3">
                                        {structureData.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-lg transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                                    <span className="text-slate-500 font-medium">{item.name}</span>
                                                </div>
                                                <span className="font-black text-slate-700">{item.value.toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        /* HISTORY VIEW */
                        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col scrollbar-hover">
                            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <div className="relative w-80">
                                    <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
                                    <input
                                        type="text"
                                        value={searchHistory}
                                        onChange={(e) => setSearchHistory(e.target.value)}
                                        placeholder="Tìm theo mã bệnh nhân, nhân viên..."
                                        className="w-full pl-10 pr-4 py-2 text-[11px] border border-slate-200 rounded-lg outline-none focus:ring-2 ring-blue-100 focus:border-blue-400"
                                    />
                                </div>
                                <div className="text-[11px] text-slate-400 font-medium">
                                    Hiển thị {filteredHistory.length} kết quả
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left ">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-2 text-[12px] font-black text-slate-600 ">Mã ca bệnh</th>
                                            <th className="px-6 py-2 text-[12px] font-black text-slate-600 ">Nhân viên xử lý</th>
                                            <th className="px-6 py-2 text-[12px] font-black text-slate-600 ">Mã nhân viên</th>
                                            <th className="px-6 py-2 text-[12px] font-black text-slate-600 ">Dịch bệnh</th>
                                            <th className="px-6 py-2 text-[12px] font-black text-slate-600 text-right">Thời gian</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredHistory.map((report, i) => (
                                            <tr key={i} className="hover:bg-blue-50/30 transition-colors group">
                                                <td className="px-6 py-2 font-bold text-blue-600 group-hover:underline cursor-pointer">{report.caseId}</td>
                                                <td className="px-6 py-2">
                                                    <div className="flex items-center gap-2">

                                                        <div>
                                                            <div className="font-bold text-slate-700">{report.staffName}</div>

                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-2">
                                                    <div className="text-[12px] text-slate-400">{report.staffId}</div>
                                                </td>
                                                <td className="px-6 py-2">
                                                    <span className="px-2.5 py-1 rounded-full font-bold text-[12px] tracking-tighter ">
                                                        {report.disease}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-2 text-right text-slate-400 tabular-nums">{report.date}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

// --- SUB-COMPONENTS ---
const StatCard = ({ title, value, sub, color, icon, border }) => (
    <div className={`bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md border-blue-600`}>
        <div className="flex justify-between items-start">
            <p className="text-[14px] text-slate-600 font-bold">{title}</p>
            <div className={`${color} opacity-80`}>{icon}</div>
        </div>
        <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-black tracking-tight ${color}`}>{value}</span>
            <span className="text-[12px] text-slate-400 font-medium">{sub}</span>
        </div>
    </div>
);

const AreaTreeItem = ({ item, selectedId, setSelectedId }) => {
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
                className={`flex items-center justify-between px-2 py-2 rounded-lg cursor-pointer transition-all
                ${isSelected ? 'bg-indigo-50 text-indigo-700 font-bold shadow-sm' : 'hover:bg-slate-50 text-slate-500'}`}
            >
                <div className="flex items-center gap-2 overflow-hidden">
                    {hasChildren ? (open ? <ChevronDown size={13} /> : <ChevronRight size={13} />) : <div className="w-[13px]" />}
                    {item.level === 'TINH' ? <MapIcon size={14} className="text-indigo-500" /> : <div className={`w-1.5 h-1.5 rounded-full ml-1 ${isSelected ? 'bg-indigo-600' : 'bg-slate-300'}`} />}
                    <span className="text-[11px] truncate tracking-tighter">{item.name}</span>
                </div>
            </div>
            {hasChildren && open && (
                <div className="ml-4 border-l border-slate-100 pl-1 mt-0.5">
                    {item.children.map(child => <AreaTreeItem key={child.id} item={child} selectedId={selectedId} setSelectedId={setSelectedId} />)}
                </div>
            )}
        </div>
    );
};

export default DiseaseDashboard;