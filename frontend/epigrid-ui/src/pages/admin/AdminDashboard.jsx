import React from 'react';
import logo from '../../assets/logo.png';
import { NavLink } from "react-router-dom";
import {
    Users, UserCheck, Activity, AlertTriangle, Map,
    HeartPulse, UserPlus, Search, Bell, LogOut, History, ShieldAlert
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Dữ liệu giả lập 14 ngày gần nhất
const lineData = [
    { name: '19/01', covid: 8, fever: 5, flu: 3 },
    { name: '20/01', covid: 12, fever: 7, flu: 4 },
    { name: '21/01', covid: 10, fever: 15, flu: 6 },
    { name: '22/01', covid: 18, fever: 12, flu: 8 },
    { name: '23/01', covid: 14, fever: 20, flu: 10 },
    { name: '24/01', covid: 25, fever: 15, flu: 12 },
    { name: '25/01', covid: 20, fever: 18, flu: 14 },
    { name: '26/01', covid: 12, fever: 8, flu: 5 },
    { name: '27/01', covid: 19, fever: 12, flu: 10 },
    { name: '28/01', covid: 15, fever: 25, flu: 8 },
    { name: '29/01', covid: 32, fever: 18, flu: 15 },
    { name: '30/01', covid: 22, fever: 30, flu: 20 },
    { name: '31/01', covid: 30, fever: 22, flu: 18 },
    { name: '01/02', covid: 45, fever: 28, flu: 25 },
];

const statsData = [
    { id: 1, title: 'Tổng người dùng', value: '1,245', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { id: 2, title: 'Nhân viên y tế', value: '56', icon: UserCheck, color: 'text-blue-600', bg: 'bg-blue-100' },
    { id: 3, title: 'Ca bệnh hôm nay', value: '32', icon: HeartPulse, color: 'text-blue-600', bg: 'bg-blue-100' },
    { id: 4, title: 'Ca tiếp xúc', value: '05', icon: UserPlus, color: 'text-blue-600', bg: 'bg-blue-100' },
    { id: 5, title: 'Cảnh báo mới', value: '08', icon: AlertTriangle, color: 'text-blue-600', bg: 'bg-blue-100' },
    { id: 6, title: 'Vùng dịch active', value: '05', icon: Map, color: 'text-blue-600', bg: 'bg-blue-100' },
];

const diseaseTypeData = [
    { name: 'COVID-19', value: 400, color: '#ef4444' },
    { name: 'Sốt xuất huyết', value: 300, color: '#f59e0b' },
    { name: 'Cúm A', value: 200, color: '#3b82f6' },
];


const AdminDashboard = () => {
    return (


        <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {/* KPI CARDS */}
            <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {statsData.map((stat) => (
                    <div key={stat.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-10 flex items-center gap-3 hover:shadow-md transition-all group">
                        <div className={`${stat.bg} ${stat.color} w-11 h-11 rounded-lg flex items-center justify-center group-hover:rotate-6 transition-transform`}>
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
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                            <div className="w-1 h-6 bg-blue-600 rounded-full"></div> Diễn biến dịch bệnh (14 ngày qua)
                        </h3>
                        {/* <div className="flex gap-4 text-[10px] font-bold uppercase">
                                    <span className="flex items-center gap-1 text-[#ef4444]">● COVID-19</span>
                                    <span className="flex items-center gap-1 text-[#f59e0b]">● Sốt xuất huyết</span>
                                    <span className="flex items-center gap-1 text-[#3b82f6]">● Cúm A</span>
                                </div> */}
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={lineData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} interval={1} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                />
                                <Line type="monotone" name="COVID-19" dataKey="covid" stroke="#ef4444" strokeWidth={1.5} dot={{ r: 2 }} activeDot={{ r: 4 }} />
                                <Line type="monotone" name="Sốt xuất huyết" dataKey="fever" stroke="#f59e0b" strokeWidth={1.5} dot={{ r: 2 }} activeDot={{ r: 4 }} />
                                <Line type="monotone" name="Cúm A" dataKey="flu" stroke="#3b82f6" strokeWidth={1.5} dot={{ r: 2 }} activeDot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
                    <h3 className="font-bold text-gray-800 text-lg mb-6">Cơ cấu loại dịch</h3>
                    <div className="flex-1 flex flex-col justify-center">
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={diseaseTypeData} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                                        {diseaseTypeData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-6 space-y-3">
                            {diseaseTypeData.map(item => (
                                <div key={item.name} className="flex justify-between items-center text-xs font-bold px-2">
                                    <span className="flex items-center gap-2 text-gray-500">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                                        {item.name}
                                    </span>
                                    <span className="text-gray-800 bg-gray-50 px-2 py-1 rounded-md">{item.value} ca</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* TABLES & LOGS - ĐÃ ĐƯỢC GIỮ LẠI ĐẦY ĐỦ */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-3 pb-6 items-stretch">

                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 h-[340px] flex flex-col">
                    <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2 text-[15px]">
                            <AlertTriangle size={16} className="text-red-500" /> Cảnh báo khẩn cấp
                        </h3>
                    </div>
                    <div className="overflow-y-auto flex-1">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-gray-100 text-gray-600 text-[9px] uppercase font-bold tracking-wider">
                                <tr>
                                    <th className="px-4 py-2">Khu vực</th>
                                    <th className="px-4 py-2">Dịch bệnh</th>
                                    <th className="px-4 py-2">Nội dung</th>
                                    <th className="px-4 py-2">Thời gian</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {[
                                    {
                                        area: 'Quận 1, TP.HCM',
                                        disease: 'COVID-19',
                                        msg: 'Vượt ngưỡng an toàn',
                                        color: 'text-red-600',
                                        time: '01/02/2026 14:32'
                                    },
                                    {
                                        area: 'Huyện Gia Lâm',
                                        disease: 'Sốt xuất huyết',
                                        msg: 'Ổ dịch mới xác nhận',
                                        color: 'text-orange-600',
                                        time: '01/02/2026 13:10'
                                    },
                                    {
                                        area: 'Quận 7, TP.HCM',
                                        disease: 'Cúm A',
                                        msg: 'Gia tăng ca nhiễm',
                                        color: 'text-yellow-600',
                                        time: '01/02/2026 12:40'
                                    },
                                    {
                                        area: 'Đà Nẵng',
                                        disease: 'COVID-19',
                                        msg: 'Phong tỏa tạm thời',
                                        color: 'text-red-600',
                                        time: '01/02/2026 11:55'
                                    },
                                    {
                                        area: 'Hải Phòng',
                                        disease: 'Sốt xuất huyết',
                                        msg: 'Nguy cơ bùng phát',
                                        color: 'text-orange-600',
                                        time: '01/02/2026 10:25'
                                    },
                                    {
                                        area: 'Cần Thơ',
                                        disease: 'Cúm A',
                                        msg: 'Theo dõi đặc biệt',
                                        color: 'text-yellow-600',
                                        time: '01/02/2026 09:10'
                                    },
                                    {
                                        area: 'Bình Dương',
                                        disease: 'COVID-19',
                                        msg: 'Tăng đột biến ca bệnh',
                                        color: 'text-red-600',
                                        time: '01/02/2026 08:30'
                                    }
                                ]
                                    .map((row, i) => (
                                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-2 font-semibold text-gray-700">
                                                {row.area}
                                            </td>
                                            <td className="px-4 py-2 text-[11px] font-medium">
                                                {row.disease}
                                            </td>
                                            <td className="px-4 py-2">
                                                <span className={`text-[11px] font-semibold ${row.color}`}>
                                                    {row.msg}
                                                </span>
                                            </td>

                                            <td className="px-4 py-2 text-[11px] text-gray-400 whitespace-nowrap">
                                                {row.time}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>

                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-[340px] flex flex-col">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2 text-sm">
                        <History size={16} className="text-blue-500" />
                        Hoạt động gần đây
                    </h3>

                    <div className="space-y-3 overflow-y-auto flex-1">

                        {[
                            { user: 'NVYT-015', action: 'tạo vùng dịch Quận 7', color: 'bg-blue-500' },
                            { user: 'NVYT-001', action: 'cập nhật 05 ca bệnh', color: 'bg-blue-500' },
                            { user: 'NVYT-015', action: 'tạo vùng dịch Quận 7', color: 'bg-blue-500' },
                            { user: 'NVYT-001', action: 'cập nhật 05 ca bệnh', color: 'bg-blue-500' },
                            { user: 'NVYT-023', action: 'thêm bệnh nhân mới', color: 'bg-blue-500' },
                            { user: 'NVYT-010', action: 'xóa cảnh báo cũ', color: 'bg-blue-500' },
                            { user: 'NVYT-007', action: 'tạo vùng dịch tại khu 51', color: 'bg-blue-500' }
                        ]
                            .map((log, i) => (
                                <div key={i} className="flex gap-3 items-start">
                                    <div className={`w-1.5 h-1.5 mt-1.5 rounded-full ${log.color}`}></div>

                                    <div>
                                        <p className="text-[12px] text-gray-700">
                                            <span className="font-semibold">{log.user}</span> {log.action}
                                        </p>

                                        <p className="text-[10px] text-gray-400">
                                            Vừa xong
                                        </p>
                                    </div>
                                </div>
                            ))}
                    </div>

                </div>

            </section>
        </div>

    );
};

export default AdminDashboard;