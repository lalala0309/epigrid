import React from "react";
import {
    LayoutDashboard, MapPin, Bell, User, LogOut,
    Search, ShieldCheck, AlertTriangle, Activity,
    Navigation, Info, Zap
} from "lucide-react";
import RadarMap from "../../components/map/RadarMap";
import ResizablePanel from "../../components/resize/ResizablePanel";
import AlertCard from "../../components/alert/AlertCard";


const UserDashboard = () => {
    return (
        <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-900 overflow-hidden">


            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0">



                {/* THÂN TRANG (GRID HÓA) */}
                <main className="flex-1 flex overflow-hidden">

                    {/* 🟡 3. STATS PANEL (300px) */}
                    <ResizablePanel
                        side="left"
                        defaultWidth={250}
                        min={180}
                        max={450}
                        className="bg-white border-r shadow-sm z-20"
                    >

                        {/* Header & Stats (Cố định phía trên) */}
                        <div className="p-4 border-b bg-slate-50/30">
                            {/* A. Trạng thái tổng quan */}
                            <div className="bg-emerald-50 border border-blue-100 rounded-sm p-4 mb-6 text-center shadow-sm">
                                <div className="inline-flex p-3 bg-blue-500 rounded-full text-white mb-2 shadow-lg shadow-blue-200">
                                    <ShieldCheck size={20} />
                                </div>
                                <h2 className="text-sm font-extrabold text-blue-700 leading-tight pb-1">AN TOÀN</h2>
                                {/* <p className="text-[10px] text-blue-800 mt-1 uppercase font-bold tracking-wide">Bán kính 1km không có ổ dịch</p> */}
                            </div>

                            {/* B. Thống kê nhanh */}
                            <h3 className="text-[10px] font-bold text-slate-600 uppercase mb-3">Khu vực của bạn</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {/* <StatCard label="Gần nhất" value="450m" sub="Sốt xuất huyết" /> */}
                                <StatCard label="Số ổ dịch" value="03" sub="Trong khu vực" />
                                <StatCard label="Mức độ" value="CAO" sub="Cảnh báo loại 1" color="text-orange-500" />
                                {/* <StatCard label="Cập nhật" value="5p" sub="Trước đó" /> */}
                            </div>
                        </div>

                        {/*  DANH SÁCH CHI TIẾT (Khu vực cuộn độc lập) */}
                        <div className="flex-1 flex flex-col min-h-0">
                            <div className="px-4 py-3 flex items-center justify-between bg-white sticky top-0 z-10">
                                <h3 className="text-[12px] font-bold text-slate-600">Ca nhiễm trong khu vực của bạn</h3>

                            </div>

                            {/* Container cuộn */}
                            <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-1 custom-scrollbar">
                                <DiseaseItem type="Sốt xuất huyết" distance="450m" level="red" cases={12} />
                                <DiseaseItem type="COVID-19" distance="900m" level="red" cases={3} />
                                <DiseaseItem type="Tả" distance="1.2km" level="red" cases={1} />
                                <DiseaseItem type="Thủy đậu" distance="1.5km" level="red" cases={5} />
                                <DiseaseItem type="Sởi" distance="1.8km" level="red" cases={2} />
                            </div>
                        </div>
                    </ResizablePanel>


                    {/* MAP (Center - Flex 1) */}
                    <section className="flex-1 relative bg-slate-200">
                        <RadarMap />
                        {/* Overlay Badge cho Map */}
                        {/* <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-sm border text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                            Live Radar Tracking
                        </div> */}
                    </section>

                    {/* ALERT PANEL (260px) - Đã chỉnh theo style cột trái */}
                    <ResizablePanel
                        side="right"
                        defaultWidth={260}
                        min={200}
                        max={450}
                        className="bg-white border-l shadow-sm z-20"
                    >

                        {/* Header Cảnh báo */}
                        <div className="p-4 border-b bg-gray-100">
                            <div className="flex items-center gap-2 mb-4">
                                <h2 className="font-black text-red-600 text-sm tracking-tight uppercase">cảnh báo</h2>
                            </div>

                            {/* Thông báo khẩn cấp dạng Banner nhỏ */}
                            <div className="bg-red-600 rounded-xl p-3 text-white">
                                <div className="flex items-center gap-2 mb-1">
                                    <Zap size={14} fill="currentColor" />
                                    <span className="text-[10px] font-black uppercase tracking-wider">Khẩn cấp</span>
                                </div>
                                <p className="text-[11px] font-bold leading-snug">Phát hiện ổ dịch Sốt xuất huyết mới trong bán kính 500m</p>
                            </div>
                        </div>

                        {/* Danh sách Alert cuộn */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 custom-scrollbar">
                            <h3 className="text-[10px] font-bold text-slate-500 uppercase mb-2">Lịch sử cảnh báo</h3>

                            <AlertCard
                                title="VƯỢT NGƯỠNG AN TOÀN"
                                desc="Số ca COVID-19 tăng lên 12 ca trong khu vực."
                                time="10 phút trước"
                                urgent
                            />
                            <AlertCard
                                title="Ghi nhận ca bệnh mới"
                                desc="Ghi nhận ca bệnh Mệt Xĩu cách vị trí của bạn 450m"
                                time="1 giờ trước"
                            />
                            <AlertCard
                                title="Ghi nhận ca bệnh mới"
                                desc="Ghi nhận ca bệnh Hơi Mệt cách vị trí của bạn 200m"
                                time="3 giờ trước"
                            />
                        </div>
                    </ResizablePanel>

                </main>
            </div>
        </div>
    );
};



const StatCard = ({ label, value, sub, color = "text-slate-900" }) => (
    <div className="p-3 border rounded-md bg-slate-50/50">
        <p className="text-[9px] font-bold text-slate-800 uppercase leading-none mb-1">{label}</p>
        <p className={`text-sm font-extrabold ${color}`}>{value}</p>
        {/* <p className="text-[10px] text-slate-500 mt-1 truncate">{sub}</p> */}
    </div>
);

const DiseaseItem = ({ type, distance, level, cases }) => {
    const statusConfig = {
        red: { dot: 'bg-red-500', text: 'text-gray-600', bg: 'bg-red-50' },
        orange: { dot: 'bg-orange-500', text: 'text-orange-600', bg: 'bg-orange-50' },
        yellow: { dot: 'bg-yellow-500', text: 'text-yellow-600', bg: 'bg-yellow-50' }
    };

    const config = statusConfig[level] || statusConfig.yellow;

    return (
        <div className="group flex flex-col p-2 border rounded-md  transition-all cursor-pointer bg-white">
            <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full bg-blue-600`}></div>
                    <span className="text-sm font-bold text-blue-800">{type}</span>
                </div>
                {/* <span className="text-[11px] font-bold text-slate-400 group-hover:text-blue-500 transition-colors">
                    // {distance}
                </span> */}
            </div>

            <div className="flex items-center justify-between ">
                <div className="pl-3 flex items-center">
                    <span className="text-xs font-semibold text-slate-600">Số ca ghi nhận:</span>
                </div>
                {/* Badge số ca nhiễm */}
                <span className={`px-1 py-0.5 rounded-md text-[11px] font-black ${config.text}`}>
                    {cases} Ca
                </span>
            </div>
        </div>
    );
};



export default UserDashboard;