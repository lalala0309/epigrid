import React, { useState } from 'react';
import { Search, UserPlus, Lock, Key, Edit, Trash2, ShieldCheck, Users, UserX, MapPin, Filter, Mail } from 'lucide-react';

const UserManagement = () => {
    const [users] = useState(Array.from({ length: 30 }, (_, i) => ({
        maNguoiDung: i + 1,
        hoTen: i === 0 ? 'Nguyễn Văn Admin' : `Người dùng thứ ${i + 1}`,
        email: `user${i + 1}@system.com`,
        maVaiTro: i === 0 ? 1 : (i % 2 === 0 ? 2 : 3),
        tenVaiTro: i === 0 ? 'ADMIN' : (i % 2 === 0 ? 'MANAGER' : 'USER'),
        viTri: '10.7626, 106.6601',
        status: i % 5 === 0 ? 'Locked' : 'Active'
    })));

    return (
        <div className="bg-gray-100 h-screen flex flex-col text-[13px] overflow-hidden">
            {/* PHẦN CỐ ĐỊNH: THỐNG KÊ */}
            <div className="flex-none p-3 pb-0">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
                    <StatCard title="Tổng số" value={users.length} icon={<Users size={14} />} color="text-blue-600" bgColor="bg-blue-50" />
                    <StatCard title="Quản trị" value="1" icon={<ShieldCheck size={14} />} color="text-purple-600" bgColor="bg-purple-50" />
                    <StatCard title="Bị khóa" value="4" icon={<UserX size={14} />} color="text-red-600" bgColor="bg-red-50" />
                    <StatCard title="Vị trí" value="20" icon={<MapPin size={14} />} color="text-green-600" bgColor="bg-green-50" />
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
                                placeholder="Tìm kiếm nhanh..."
                                className="w-full pl-8 pr-3 py-1 border border-gray-200 rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter size={14} className="text-gray-400" />
                            <select className="border border-gray-200 rounded px-2 py-1 bg-white text-xs outline-none">
                                <option>Mọi vai trò</option>
                                <option>ADMIN</option>
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
                                {users.map((u) => (
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
                                                ${u.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                                                <span className={`w-1 h-1 rounded-full ${u.status === 'Active' ? 'bg-green-600' : 'bg-red-500'}`}></span>
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