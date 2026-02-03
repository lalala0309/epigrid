import React, { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import {
    Users, Activity, AlertTriangle, Map, ShieldAlert,
    Search, Bell, LogOut, ChevronDown, ChevronRight, LayoutGrid
} from "lucide-react";

const linkStyle = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200
    ${isActive
        ? "bg-blue-50 text-[#1E3A8A] font-bold"
        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`;

const subLinkStyle = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition
            ${isActive
        ? "bg-blue-50 text-[#1E3A8A] font-semibold"
        : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"}`;


const AdminLayout = () => {
    // State quản lý việc đóng/mở danh mục hệ thống
    const location = useLocation();

    const isSystemRoute =
        location.pathname.startsWith("/admin/areas") ||
        location.pathname.startsWith("/admin/diseases");

    const [isSystemMenuOpen, setIsSystemMenuOpen] = useState(isSystemRoute);

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans text-gray-800">

            {/* SIDEBAR */}
            <aside className="w-56 bg-white flex flex-col transition-all z-20 flex-shrink-0 border-r border-gray-200">
                <div className="p-6 pr-2 flex items-center gap-3">
                    <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
                    <h1 className="text-2xl font-black text-blue-900 tracking-tighter">EpiGrid </h1>
                </div>

                <nav className="flex-1 px-3 py-1 space-y-1">
                    <p className="px-3 text-[10px] font-bold text-gray-800 uppercase t mb-4">
                        Main Menu
                    </p>

                    {/* Dashboard */}
                    <NavLink to="/admin" end className={linkStyle}>
                        {({ isActive }) => (
                            <>
                                <Activity size={18} strokeWidth={isActive ? 2.5 : 2} />
                                <span className="text-[13px] whitespace-nowrap">Dashboard</span>
                            </>
                        )}
                    </NavLink>

                    {/* Quản lý User */}
                    <NavLink to="/admin/users" className={linkStyle}>
                        {({ isActive }) => (
                            <>
                                <Users size={18} strokeWidth={isActive ? 2.5 : 2} />
                                <span className="text-[13px] whitespace-nowrap">Quản lý Người dùng</span>
                            </>
                        )}
                    </NavLink>

                    {/* Danh mục hệ thống - Thay thế cho 2 mục cũ */}
                    <div>
                        <button
                            onClick={() => setIsSystemMenuOpen(!isSystemMenuOpen)}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                        >
                            <div className="flex items-center gap-3">
                                <LayoutGrid size={18} strokeWidth={2} />
                                <span className="text-[13px] whitespace-nowrap">Danh mục hệ thống</span>
                            </div>
                            {isSystemMenuOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </button>

                        {/* Menu con hiển thị khi mở */}
                        {isSystemMenuOpen && (
                            <div className="ml-8 space-y-1 mt-1 border-l border-gray-200 pl-3">

                                <NavLink to="/admin/areas" className={subLinkStyle}>
                                    <span className="text-[12px]">Quản lý khu vực</span>
                                </NavLink>

                                <NavLink to="/admin/diseases" className={subLinkStyle}>
                                    <span className="text-[12px]">Quản lý dịch bệnh</span>
                                </NavLink>

                            </div>
                        )}

                    </div>



                    {/* Vùng dịch & Cảnh báo */}
                    {/* <a
                        href="#"
                        className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                    >
                        <AlertTriangle size={18} strokeWidth={2} />
                        <span className="text-[13px] whitespace-nowrap">Vùng dịch & Cảnh báo</span>
                    </a> */}
                </nav>

                <div className="p-3 mt-auto">
                    <button className="flex items-center gap-3 px-3 py-3 w-full text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium">
                        <LogOut size={18} className="flex-shrink-0" />
                        <span className="text-[13px]">Đăng xuất</span>
                    </button>
                </div>
            </aside>

            {/* MAIN */}
            <main className="flex-1 flex flex-col overflow-hidden">

                {/* TOPBAR */}
                <header className="h-14 bg-[#1E3A8A] flex items-center justify-between px-6 z-10 shadow-lg flex-none">
                    <div className="relative w-96">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search size={16} className="text-blue-200" />
                        </span>
                        <input className="block w-full pl-10 pr-3 py-2 bg-blue-900/40 border border-blue-700/50 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-xs" placeholder="Tìm kiếm dữ liệu hệ thống..." type="text" />
                    </div>
                    <div className="flex items-center">
                        <button className="p-2 text-blue-100 hover:bg-blue-800 rounded-full relative transition-colors">
                            <Bell size={18} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#1E3A8A]"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-5 border-l border-blue-700/50">
                            <div className="text-right">
                                <p className="text-xs font-semibold text-white leading-tight">Admin Manager</p>
                                <p className="text-[10px] text-blue-200 font-medium">Quản trị viên</p>
                            </div>
                            <div className="w-8 h-8 rounded-full border-2 border-blue-400 p-0.5">
                                <img src="https://ui-avatars.com/api/?name=Admin&background=fff&color=1E3A8A" className="w-full h-full rounded-full shadow-sm" alt="avatar" />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1">
                    <Outlet />
                </div>

            </main>
        </div>
    );
};

export default AdminLayout;