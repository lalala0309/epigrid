import React from 'react';
import logo from '../../assets/logo.png';


const Home = () => {
    return (
        <div className="min-h-screen bg-[#F8FAFF] font-sans text-slate-800">
            {/* Navigation Bar */}
            <nav className="flex justify-between items-center px-10 py-5 bg-[#1E3A8A] shadow-xl border-b border-blue-800 sticky top-0 z-50">
                <div className="flex items-center gap-2">


                    <div className=" inline-flex">
                        <img src={logo} alt="Logo" className="w-10 h-10 object-contain brightness-0 invert" />
                    </div>
                    <h1 className="text-2xl font-black text-white tracking-tighter">EpiGrid </h1>
                </div>
                <div className="flex gap-4 items-center">
                    <a
                        href="/login"
                        className="px-6 py-2 text-sm font-bold text-blue-100 hover:text-white border border-transparent hover:border-blue-400/50 rounded-full transition-all duration-200"
                    >
                        Đăng nhập
                    </a>
                    <a
                        href="/register"
                        className="px-6 py-2.5 text-sm font-bold bg-white text-[#1E3A8A] rounded-full shadow-md hover:bg-blue-50 hover:shadow-blue-900/20 active:scale-95 transition-all duration-200"
                    >
                        Đăng ký
                    </a>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="mx-auto px-8 py-20 text-center 
                   bg-blue-50 rounded-3xl shadow-sm">



                {/* <span className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-widest">
                    Hệ thống quản lý dịch tễ thông minh
                </span> */}
                <h2 className="mt-3 text-5xl md:text-6xl font-black text-slate-900 leading-tight">
                    Theo dõi & Phân tích <br />
                    <span className="text-blue-600">Dịch tễ Cộng đồng</span>
                </h2>
                <p className="mt-6 text-lg text-slate-500 max-w-2xl mx-auto font-medium">
                    EpiGrid cung cấp giải pháp bản đồ số và dữ liệu thời gian thực giúp quản lý,
                    cảnh báo và ngăn chặn sự lây lan của các loại dịch bệnh một cách hiệu quả.
                </p>
            </header>

            {/* Risk Levels Section (Dựa trên gợi ý layout màu của bạn) */}

            {/* Features Section */}
            <section className="bg-white py-20">
                <div className="max-w-6xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="space-y-4">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                            <i className="bi bi-map-fill text-2xl"></i>
                        </div>
                        <h4 className="text-xl font-bold text-slate-800">Bản đồ số hóa</h4>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Hiển thị trực quan các điểm nóng dịch tễ trên nền tảng bản đồ tương tác với độ chính xác cao.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                            <i className="bi bi-graph-up-arrow text-2xl"></i>
                        </div>
                        <h4 className="text-xl font-bold text-slate-800">Phân tích dữ liệu</h4>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Hệ thống tự động tổng hợp báo cáo và đưa ra các biểu đồ xu hướng dịch bệnh theo thời gian.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                            <i className="bi bi-shield-check text-2xl"></i>
                        </div>
                        <h4 className="text-xl font-bold text-slate-800">Quản lý an toàn</h4>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Bảo mật dữ liệu tuyệt đối và phân quyền người dùng chặt chẽ giữa quản trị viên và nhân viên y tế.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-10 text-center text-slate-400 text-xs font-medium uppercase tracking-widest">
                &copy; 2026 EpiGrid System - Quản lý dịch tễ cộng đồng
            </footer>
        </div>
    );
};

export default Home;