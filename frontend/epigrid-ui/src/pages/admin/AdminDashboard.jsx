import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Users, UserCheck, HeartPulse, UserPlus, Calendar
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const rawLineData = [
    { name: '18/01', covid: 5, fever: 3, flu: 2 }, { name: '19/01', covid: 8, fever: 5, flu: 3 },
    { name: '20/01', covid: 12, fever: 7, flu: 4 }, { name: '21/01', covid: 10, fever: 15, flu: 6 },
    { name: '22/01', covid: 18, fever: 12, flu: 8 }, { name: '23/01', covid: 14, fever: 20, flu: 10 },
    { name: '24/01', covid: 25, fever: 15, flu: 12 }, { name: '25/01', covid: 20, fever: 18, flu: 14 },
    { name: '26/01', covid: 12, fever: 8, flu: 5 }, { name: '27/01', covid: 19, fever: 12, flu: 10 },
    { name: '28/01', covid: 15, fever: 25, flu: 8 }, { name: '29/01', covid: 32, fever: 18, flu: 15 },
    { name: '30/01', covid: 22, fever: 30, flu: 20 }, { name: '31/01', covid: 30, fever: 22, flu: 18 },
    { name: '01/02', covid: 45, fever: 28, flu: 25 },
];


const AdminDashboard = () => {
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalStaff, setTotalStaff] = useState(0);
    const [totalCaseToday, setTotalCaseToday] = useState(0);
    const [totalContactToday, setTotalContactToday] = useState(0);
    const [viewDays, setViewDays] = useState(7);
    const [lineData, setLineData] = useState([]);
    const [lines, setLines] = useState([]);
    const [pieData, setPieData] = useState([]);
    const TOP_COLORS = [
        "#ef4444", // top 1 - đỏ
        "#facc15", // top 2 - vàng
        "#22c55e", // top 3 - xanh lá
        "#3b82f6", // top 4 - xanh dương
        "#9ca3af"  // còn lại - xám
    ];
    useEffect(() => {
        axios.get("http://localhost:8081/api/users/count").then(res => setTotalUsers(res.data)).catch(err => console.error(err));
        axios.get("http://localhost:8081/api/users/count-nvyt").then(res => setTotalStaff(res.data)).catch(err => console.error(err));
        axios.get("http://localhost:8084/api/cases/count-case-today").then(res => setTotalCaseToday(res.data)).catch(err => console.error(err));
        axios.get("http://localhost:8084/api/cases/contacts/count-contact-today").then(res => setTotalContactToday(res.data)).catch(err => console.error(err));
    }, []);

    useEffect(() => {
        axios.get(`http://localhost:8084/api/cases/chart/top-diseases?days=${viewDays}`)
            .then(res => {
                setLineData(res.data);
                if (res.data.length > 0) {
                    const keys = Object.keys(res.data[0]).filter(k => k !== "date");
                    setLines(keys);
                }
            });
    }, [viewDays]);

    useEffect(() => {
        axios.get(`http://localhost:8084/api/cases/chart/disease-pie?days=${viewDays}`)
            .then(res => setPieData(res.data))
            .catch(err => console.error(err));
    }, [viewDays]);

    const getColorByIndex = (index) => {
        return TOP_COLORS[index] || "#9ca3af";
    };

    const filteredLineData = rawLineData.slice(-viewDays);

    const statsData = [
        { id: 1, title: 'Tổng người dùng', value: totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
        { id: 2, title: 'Nhân viên y tế', value: totalStaff, icon: UserCheck, color: 'text-blue-600', bg: 'bg-blue-100' },
        { id: 3, title: 'Ca bệnh hôm nay', value: totalCaseToday, icon: HeartPulse, color: 'text-blue-600', bg: 'bg-blue-100' },
        { id: 4, title: 'Ca tiếp xúc hôm nay', value: totalContactToday, icon: UserPlus, color: 'text-blue-600', bg: 'bg-blue-100' },
    ];

    return (
        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
            {/* KPI CARDS */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {statsData.map((stat) => (
                    <div key={stat.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3 hover:shadow-md transition-all">
                        <div className={`${stat.bg} ${stat.color} w-11 h-11 rounded-lg flex items-center justify-center`}>
                            <stat.icon size={20} />
                        </div>
                        <div className='flex flex-col'>
                            <p className="text-gray-600 text-[10px] font-bold uppercase tracking-wider">{stat.title}</p>
                            <h3 className="text-[18px] font-black text-gray-800 mt-1">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </section>

            {/* CHARTS */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                            <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                            Diễn biến dịch bệnh ({viewDays} ngày qua)
                        </h3>

                        <div className="relative flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                            <Calendar size={14} className="text-gray-500" />
                            <select
                                value={viewDays}
                                onChange={(e) => setViewDays(Number(e.target.value))}
                                className="bg-transparent text-sm font-semibold text-gray-700 focus:outline-none cursor-pointer"
                            >
                                <option value={7}>7 ngày</option>
                                <option value={14}>14 ngày</option>
                                <option value={30}>30 ngày</option>
                            </select>
                        </div>
                    </div>

                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={lineData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />

                                {lines.map((key, index) => (
                                    <Line
                                        key={key}
                                        type="monotone"
                                        dataKey={key}
                                        stroke={getColorByIndex(index)}
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* PIE CHART */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
                    <h3 className="font-bold text-gray-800 text-lg mb-6">Cơ cấu loại dịch</h3>
                    <div className="flex-1 flex flex-col justify-center">
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={pieData} innerRadius={50} outerRadius={70} dataKey="value">
                                        {pieData.map((entry, index) => (
                                            <Cell key={index} fill={getColorByIndex(index)} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-6 space-y-3">
                            {pieData.map((item, index) => (
                                <div key={item.name} className="flex justify-between text-xs font-bold px-2">
                                    <span className="flex items-center gap-2 text-gray-500">
                                        <div
                                            className="w-2 h-2 rounded-full"
                                            style={{ backgroundColor: getColorByIndex(index) }}
                                        ></div>
                                        {item.name}
                                    </span>
                                    <span className="text-gray-800 bg-gray-50 px-2 py-1 rounded-md">
                                        {item.value} ca
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AdminDashboard;