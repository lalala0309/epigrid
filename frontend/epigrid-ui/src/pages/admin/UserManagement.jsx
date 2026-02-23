import React from 'react';
import { Search, UserPlus, Lock, Key, Edit, Trash2, ShieldCheck, Users, UserX, MapPin, Filter, Mail } from 'lucide-react';
import { useEffect, useState } from "react";
import { useMemo } from "react";
import axios from "axios";


const UserManagement = () => {
    // const [users] = useState(Array.from({ length: 30 }, (_, i) => ({
    //     maNguoiDung: i + 1,
    //     hoTen: i === 0 ? 'Nguyễn Văn Admin' : `Người dùng thứ ${i + 1}`,
    //     email: `user${i + 1}@system.com`,
    //     maVaiTro: i === 0 ? 1 : (i % 2 === 0 ? 2 : 3),
    //     tenVaiTro: i === 0 ? 'ADMIN' : (i % 2 === 0 ? 'MANAGER' : 'USER'),
    //     viTri: '10.7626, 106.6601',
    //     status: i % 5 === 0 ? 'Locked' : 'Active'
    // })));

    // === state vaf callAPT 
    const [users, setUsers] = useState([]);

    // == state filter
    const [roleFilter, setRoleFilter] = useState("ALL");

    // === danh sách role từ API
    const roles = ["ALL", ...new Set(users.map(u => u.tenVaiTro))];

    // === State search 
    const [search, setSearch] = useState("");

    // === Tạo list đã đọc
    const filteredUsers = useMemo(() => {
        return users.filter(u => {
            const matchRole =
                roleFilter === "ALL" || u.tenVaiTro === roleFilter;

            const matchSearch =
                u.hoTen.toLowerCase().includes(search.toLowerCase()) ||
                u.email.toLowerCase().includes(search.toLowerCase());

            return matchRole && matchSearch;
        });
    }, [users, roleFilter, search]);







    useEffect(() => {
        axios.get("http://localhost:8081/api/users")
            .then(res => setUsers(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="bg-gray-100 h-screen flex flex-col text-[13px] overflow-hidden">
            {/* PHẦN CỐ ĐỊNH: THỐNG KÊ */}
            <div className="flex-none p-3 pb-0">
                <div className="grid grid-cols-2 md:grid-cols-7 gap-2 mb-2">
                    <StatCard
                        title="Tổng số"
                        value={users.length}
                        icon={<Users size={14} />}
                        color="text-blue-600"
                        bgColor="bg-blue-50"
                    />

                    <StatCard
                        title="Quản trị"
                        value={users.filter(u => u.maVaiTro === 1).length}
                        icon={<ShieldCheck size={14} />}
                        color="text-purple-600"
                        bgColor="bg-purple-50"
                    />


                    <StatCard
                        title="Nhân viên"
                        value={users.filter(u => u.maVaiTro === 2).length}
                        icon={<ShieldCheck size={14} />}
                        color="text-purple-600"
                        bgColor="bg-purple-50"
                    />
                    <StatCard
                        title="Người dùng"
                        value={users.filter(u => u.maVaiTro === 3).length}
                        icon={<ShieldCheck size={14} />}
                        color="text-purple-600"
                        bgColor="bg-purple-50"
                    />
                    <StatCard
                        title="Bị khóa"
                        value={users.filter(u => u.status?.toLowerCase() !== "active").length}
                        icon={<UserX size={14} />}
                        color="text-red-600"
                        bgColor="bg-red-50"
                    />

                    <StatCard
                        title="Đang hoạt động"
                        value={users.filter(u => u.status?.toLowerCase() === "active").length}
                        icon={<MapPin size={14} />}
                        color="text-green-600"
                        bgColor="bg-green-50"
                    />
                </div>

            </div>

            {/* VÙNG CHỨA BẢNG & SEARCH (Cố định khung này) */}
            <div className="flex-1 px-3 pb-3 overflow-hidden flex flex-col">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">

                    {/* THANH TÌM KIẾM (LUÔN HIỂN THỊ) */}
                    <div className="flex-none p-2 border-b overflow-hidden border-gray-100 flex flex-wrap items-center gap-2 bg-white z-10">
                        <div className="relative flex-1 min-w-[180px]">
                            <Search className="absolute left-2.5 top-1.5 text-gray-400" size={14} />
                            <input
                                type="text"
                                placeholder="Tìm kiếm tài khoản..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-8 pr-3 py-1 border border-gray-200 rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                            />

                        </div>
                        <div className="flex items-center gap-2">
                            <Filter size={14} className="text-gray-400" />
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="border border-gray-200 rounded px-2 py-1 bg-white text-xs outline-none"
                            >
                                {roles.map(role => (
                                    <option key={role} value={role}>
                                        {role === "ALL" ? "Mọi vai trò" : role}
                                    </option>
                                ))}
                            </select>

                        </div>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded flex items-center gap-1.5 font-medium text-xs transition-all">
                            <UserPlus size={14} /> Thêm
                        </button>
                    </div>

                    {/* VÙNG CUỘN CỦA BẢNG */}
                    <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-gray-300">
                        <table className="w-full text-left border-separate border-spacing-0">
                            <thead className="overflow-hidden">
                                <tr className="text-gray-500 uppercase text-[10px] font-bold tracking-wider">
                                    {/* TH HEADER CỐ ĐỊNH KHI CUỘN XUỐNG */}
                                    <th className="sticky top-0 z-20 bg-gray-50 border-b border-gray-200 px-3 py-2 w-12 text-center shadow-[inset_0_-1px_0_rgba(0,0,0,0.05)]">ID</th>
                                    <th className="sticky top-0 z-20 bg-gray-50 border-b border-gray-200 px-3 py-2 shadow-[inset_0_-1px_0_rgba(0,0,0,0.05)]">Họ và tên</th>
                                    <th className="sticky top-0 z-20 bg-gray-50 border-b border-gray-200 px-3 py-2 shadow-[inset_0_-1px_0_rgba(0,0,0,0.05)]">Email</th>
                                    <th className="sticky top-0 z-20 bg-gray-50 border-b border-gray-200 px-3 py-2 shadow-[inset_0_-1px_0_rgba(0,0,0,0.05)]">Vai trò</th>
                                    <th className="sticky top-0 z-20 bg-gray-50 border-b border-gray-200 px-3 py-2 shadow-[inset_0_-1px_0_rgba(0,0,0,0.05)]">Tọa độ</th>
                                    <th className="sticky top-0 z-20 bg-gray-50 border-b border-gray-200 px-3 py-2 text-center shadow-[inset_0_-1px_0_rgba(0,0,0,0.05)]">Trạng thái</th>
                                    <th className="sticky top-0 z-20 bg-gray-50 border-b border-gray-200 px-3 py-2 text-right shadow-[inset_0_-1px_0_rgba(0,0,0,0.05)]">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredUsers.map((u) => (

                                    <tr key={u.maNguoiDung} className="hover:bg-blue-50/40 transition-colors">
                                        <td className="px-3 py-1.5 text-center text-gray-600 font-mono text-[11px]">{u.maNguoiDung}</td>
                                        <td className="px-3 py-1.5 font-medium text-gray-700">{u.hoTen}</td>
                                        <td className="px-3 py-1.5 text-gray-500">
                                            <div className="flex items-center gap-1.5 text-[13px]">

                                                {u.email}
                                            </div>
                                        </td>
                                        <td className="px-3 py-1.5">
                                            <span className={`px-1.5 py-0.5 rounded font-bold text-[9px]
                                                ${u.maVaiTro === 1 ? 'text-green-800' :
                                                    u.maVaiTro === 2 ? 'text-blue-800' :
                                                        'text-gray-800'}`}>
                                                {u.tenVaiTro}
                                            </span>
                                        </td>
                                        <td className="px-3 py-1.5 text-gray-400 font-mono text-[10px]">
                                            <div className="flex items-center gap-1">
                                                <MapPin size={11} className="text-blue-300" /> {u.viTri}
                                            </div>
                                        </td>
                                        <td className="px-3 py-1.5 text-center">
                                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold
                                                ${u.status?.toLowerCase() === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                                                <span className={`w-1 h-1 rounded-full ${u.status?.toLowerCase() === 'active' ? 'bg-green-600' : 'bg-red-500'}`}></span>
                                                {u.status}
                                            </span>
                                        </td>
                                        <td className="px-3 py-1.5">
                                            <div className="flex justify-end gap-1">
                                                <ActionButton icon={<Edit size={12} />} color="hover:text-blue-600" />
                                                <ActionButton icon={<Key size={12} />} color="hover:text-orange-500" />
                                                <ActionButton icon={<Trash2 size={12} />} color="hover:text-red-600" />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Component con StatCard (Thu gọn padding và text)
const StatCard = ({ title, value, icon, color, bgColor }) => (
    <div className="bg-white p-2 rounded border border-gray-200 flex items-center gap-2">
        <div className={`p-1.5 rounded ${bgColor} ${color}`}>{icon}</div>
        <div>
            <p className="text-[9px] text-gray-400 font-bold uppercase leading-none mb-0.5">{title}</p>
            <p className="text-sm font-bold text-gray-700 leading-none">{value}</p>
        </div>
    </div>
);

// Component con ActionButton (Nhỏ hơn)
const ActionButton = ({ icon, color, title }) => (
    <button
        title={title}
        className={`p-1 rounded text-gray-400 hover:bg-white hover:shadow-sm transition-all active:scale-90 border border-transparent hover:border-gray-100 ${color}`}
    >
        {icon}
    </button>
);

export default UserManagement;