import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    LayoutDashboard, MapPin, Bell, User, LogOut,
    Search, ShieldCheck, AlertTriangle, Activity,
    Navigation, Info, Zap
} from "lucide-react";
import RadarMap from "../../components/map/RadarMap";
import ResizablePanel from "../../components/resize/ResizablePanel";


const UserDashboard = () => {
    const [diseases, setDiseases] = useState([]);
    const getRiskLevel = (total) => {
        if (total <= 3) return { label: "AN TOÀN", color: "green" };
        if (total <= 10) return { label: "NGUY CƠ THẤP", color: "yellow" };
        if (total <= 20) return { label: "CẢNH BÁO", color: "orange" };
        return { label: "NGUY HIỂM", color: "red" };
    };
    const [risk, setRisk] = useState({ label: "AN TOÀN", color: "green" });
    const riskConfig = {
        green: {
            bg: "bg-green-50",
            border: "border-green-200",
            text: "text-green-700",
            iconBg: "bg-green-500",
        },
        yellow: {
            bg: "bg-yellow-50",
            border: "border-yellow-200",
            text: "text-yellow-700",
            iconBg: "bg-yellow-500",
        },
        orange: {
            bg: "bg-orange-50",
            border: "border-orange-200",
            text: "text-orange-700",
            iconBg: "bg-orange-500",
        },
        red: {
            bg: "bg-red-50",
            border: "border-red-200",
            text: "text-red-700",
            iconBg: "bg-red-500",
        }
    };

    const config = riskConfig[risk.color];

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(async (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            const res = await axios.get(
                `http://localhost:8080/api/cases/nearby-summary?lat=${lat}&lng=${lng}&radius=1000`
            );

            setDiseases(res.data);

            // tính tổng ca
            const total = res.data.reduce((sum, d) => sum + d.cases, 0);

            // set level
            setRisk(getRiskLevel(total));
        });
    }, []);





    return (
        <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-900 overflow-hidden">


            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* THÂN TRANG (GRID HÓA) */}
                <main className="flex-1 flex overflow-hidden">

                    {/* STATS PANEL (300px) */}
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
                            <div className={`${config.bg} ${config.border} border rounded-sm p-4 mb-6 text-center shadow-sm`}>
                                <div className={`inline-flex p-3 ${config.iconBg} rounded-full text-white mb-2 shadow-lg`}>

                                    <ShieldCheck size={20} />
                                </div>
                                <h2 className={`text-sm font-extrabold ${config.text}`}>
                                    {risk.label}
                                </h2>
                                {/* <p className="text-[10px] text-blue-800 mt-1 uppercase font-bold tracking-wide">Bán kính 1km không có ổ dịch</p> */}
                            </div>

                            {/* B. Thống kê nhanh */}
                            {/* <h3 className="text-[10px] font-bold text-slate-600 uppercase mb-3">Khu vực của bạn</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <StatCard label="Số ổ dịch" value="03" sub="Trong khu vực" />
                                <StatCard label="Mức độ" value="CAO" sub="Cảnh báo loại 1" color="text-orange-500" />
                            </div> */}
                        </div>

                        {/*  Danh sách chi tiết trong khu vực */}
                        <div className="flex-1 flex flex-col min-h-0">
                            <div className="px-4 py-3 flex items-center justify-between bg-white sticky top-0 z-10">
                                <h3 className="text-[12px] font-bold text-slate-600">Ca nhiễm trong khu vực của bạn</h3>

                            </div>

                            {/* Container cuộn */}
                            <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-1 custom-scrollbar">
                                {diseases.map((d, index) => (
                                    <DiseaseItem
                                        key={index}
                                        type={d.name}
                                        cases={d.cases}
                                        level="red"
                                    />
                                ))}
                            </div>
                        </div>
                    </ResizablePanel>


                    {/* MAP (Center - Flex 1) */}
                    <section className="flex-1 relative bg-slate-200">
                        <RadarMap />

                    </section>
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