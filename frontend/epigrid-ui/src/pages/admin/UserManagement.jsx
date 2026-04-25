import React from 'react';
import { Search, UserPlus, Lock, Key, Edit, Trash2, ShieldCheck, Users, UserX, MapPin, Filter, Mail } from 'lucide-react';
import { useEffect, useState } from "react";
import { useMemo } from "react";
import axios from "axios";

const UserManagement = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRole, setSelectedRole] = useState("");
    const [maNhanVien, setMaNhanVien] = useState("");

    const handleSubmitRole = async () => {
        try {
            if (!selectedRole) return;

            if (Number(selectedRole) === 2 && !maNhanVien) {
                alert("Nhập mã nhân viên");
                return;
            }

            await axios.put(`http://localhost:8080/api/users/${selectedUser.maNguoiDung}/role`, {
                maVaiTro: Number(selectedRole),
                maNhanVien: selectedRole == 2 ? maNhanVien : null
            });

            // update UI ko gọi lại API
            setUsers(prev =>
                prev.map(u =>
                    u.maNguoiDung === selectedUser.maNguoiDung
                        ? {
                            ...u,
                            maVaiTro: Number(selectedRole),
                            tenVaiTro:
                                selectedRole == 1 ? "ADMIN" :
                                    selectedRole == 2 ? "MANAGER" : "USER"
                        }
                        : u
                )
            );

            setShowModal(false);

        } catch (err) {
            console.error(err);
            alert("Lỗi update");
        }
    };

    const handleDeleteUser = async (user) => {
        const confirmDelete = window.confirm(
            `Xóa người dùng "${user.hoTen}" ?`
        );

        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:8080/api/users/${user.maNguoiDung}`);

            // update UI không gọi lại API)
            setUsers(prev => prev.filter(u => u.maNguoiDung !== user.maNguoiDung));
            alert("Xóa người dùng thành công");

        } catch (err) {
            alert("Không thể xoá người dùng này");
        }
    };
    // state vaf callAPT 
    const [users, setUsers] = useState([]);

    // state filter
    const [roleFilter, setRoleFilter] = useState("ALL");

    // danh sách role từ API
    const roles = ["ALL", ...new Set(users.map(u => u.tenVaiTro))];

    // State search 
    const [search, setSearch] = useState("");

    // Tạo list đã đọc
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
        axios.get("http://localhost:8080/api/users")
            .then(res => setUsers(res.data))
            .catch(err => console.error(err));
    }, []);

    const ActionButton = ({ icon, color, title, onClick }) => (
        <button
            onClick={onClick}
            title={title}
            className={`p-1 rounded text-gray-400 hover:bg-white hover:shadow-sm transition-all active:scale-90 border border-transparent hover:border-gray-100 ${color}`}
        >
            {icon}
        </button>
    );

    return (
        <>
            <div className="bg-gray-100 h-full flex flex-col text-[13px] overflow-hidden">
                <div className="flex-none p-3 pb-0">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
                        <StatCard
                            title="Tổng số người dùng"
                            value={users.length}
                            icon={<Users size={20} />}
                            color="text-blue-600"
                            bgColor="bg-blue-50"
                        />

                        <StatCard
                            title="Quản trị viên"
                            value={users.filter(u => u.maVaiTro === 1).length}
                            icon={<ShieldCheck size={20} />}
                            color="text-purple-600"
                            bgColor="bg-purple-50"
                        />


                        <StatCard
                            title="Nhân viên quản lý"
                            value={users.filter(u => u.maVaiTro === 2).length}
                            icon={<ShieldCheck size={20} />}
                            color="text-purple-600"
                            bgColor="bg-purple-50"
                        />
                        <StatCard
                            title="Người dùng"
                            value={users.filter(u => u.maVaiTro === 3).length}
                            icon={<ShieldCheck size={20} />}
                            color="text-purple-600"
                            bgColor="bg-purple-50"
                        />
                        {/* <StatCard
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
                    /> */}
                    </div>

                </div>

                {/* bảng và thanh searrch cố định */}
                <div className="flex-1 px-3 pb-3 overflow-hidden flex flex-col">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">

                        {/*thanh tìm kiếm luôn hiển thị*/}
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
                            {/* <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded flex items-center gap-1.5 font-medium text-xs transition-all">
                            <UserPlus size={14} /> Thêm
                        </button> */}
                        </div>


                        <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-gray-300">
                            <table className="w-full text-left border-separate border-spacing-0">
                                <thead className="overflow-hidden">
                                    <tr className="text-gray-500 uppercase text-[10px] font-bold tracking-wider">
                                        {/* header cố định */}
                                        <th className="sticky top-0 z-20 bg-gray-50 border-b border-gray-200 px-3 py-2 w-12 text-center shadow-[inset_0_-1px_0_rgba(0,0,0,0.05)]">ID</th>
                                        <th className="sticky top-0 z-20 bg-gray-50 border-b border-gray-200 px-3 py-2 shadow-[inset_0_-1px_0_rgba(0,0,0,0.05)]">Họ và tên</th>
                                        <th className="sticky top-0 z-20 bg-gray-50 border-b border-gray-200 px-3 py-2 shadow-[inset_0_-1px_0_rgba(0,0,0,0.05)]">Email</th>
                                        <th className="sticky top-0 z-20 bg-gray-50 border-b border-gray-200 px-3 py-2 shadow-[inset_0_-1px_0_rgba(0,0,0,0.05)]">Vai trò</th>
                                        <th className="sticky top-0 z-20 bg-gray-50 border-b border-gray-200 px-3 py-2 shadow-[inset_0_-1px_0_rgba(0,0,0,0.05)]">Tọa độ</th>
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
                                            {/* <td className="px-3 py-1.5 text-center">
                                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold
                                                ${u.status?.toLowerCase() === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                                                <span className={`w-1 h-1 rounded-full ${u.status?.toLowerCase() === 'active' ? 'bg-green-600' : 'bg-red-500'}`}></span>
                                                {u.status}
                                            </span>
                                        </td> */}
                                            <td className="px-3 py-1.5">
                                                <div className="flex justify-end gap-1">
                                                    <ActionButton
                                                        icon={<Edit size={12} />}
                                                        color="hover:text-blue-600"
                                                        onClick={() => {
                                                            setSelectedUser(u);
                                                            setSelectedRole(u.maVaiTro);
                                                            setMaNhanVien("");
                                                            setShowModal(true);
                                                        }}
                                                    />
                                                    {/* <ActionButton icon={<Key size={12} />} color="hover:text-orange-500" /> */}
                                                    <ActionButton
                                                        icon={<Trash2 size={12} />}
                                                        color="hover:text-red-600"
                                                        onClick={() => handleDeleteUser(u)}
                                                    />
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

            {showModal && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl w-[340px] p-4 shadow-lg">
                        <h2 className="text-sm font-bold mb-2 text-blue-800">Cập nhật quyền</h2>

                        {/* thông tin user */}
                        <div className="mb-3 p-2 bg-gray-50 rounded border border-gray-100">
                            <p className="text-sm font-semibold text-gray-700">
                                {selectedUser?.hoTen}
                            </p>
                            <p className="text-[13px] text-gray-400">
                                {selectedUser?.email}
                            </p>

                        </div>

                        {/* role */}
                        <div className="mb-3">
                            <label className="text-xs text-gray-500">Vai trò</label>
                            <select
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                className="w-full border rounded px-2 py-1 mt-1 text-sm"
                            >
                                <option value={1}>ADMIN</option>
                                <option value={2}>MANAGER</option>
                                <option value={3}>USER</option>
                            </select>
                        </div>

                        {/* NVYT */}
                        {Number(selectedRole) === 2 && (
                            <div className="mb-3">
                                <label className="text-xs text-gray-500">Mã nhân viên</label>
                                <input
                                    value={maNhanVien}
                                    onChange={(e) => setMaNhanVien(e.target.value)}
                                    className="w-full border rounded px-2 py-1 mt-1 text-sm"
                                    placeholder="Nhập mã nhân viên y tế"
                                />
                            </div>
                        )}

                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-3 py-1 text-xs border rounded"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSubmitRole}
                                className="px-3 py-1 text-xs bg-blue-600 text-white rounded"
                            >
                                Lưu
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

// Component con StatCard thu gọn padding và text
const StatCard = ({ title, value, icon, color, bgColor }) => (
    <div className="bg-white px-5 py-3 rounded-xl border border-gray-200 flex items-center gap-4">
        <div className={`p-3 rounded ${bgColor} ${color}`}>
            <span className="h-10 w-10">{icon}</span>
        </div>
        <div>
            <p className="text-[12px] text-gray-400 font-bold uppercase leading-none mb-0.5">{title}</p>
            <p className="text-lg font-bold text-gray-700 leading-none">{value}</p>
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